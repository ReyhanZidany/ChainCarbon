// backend/controllers/authController.js
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

function generateCompanyId() {
  return "C" + Math.floor(100 + Math.random() * 900);
}

//
// ===================== REGISTER =====================
//
export const registerUser = async (req, res) => {
  const { email, password, company, website, type, province, city } = req.body;

  // Validation (keep existing validation code)
  if (!email || !password || !company) {
    return res.status(400).json({ 
      success: false,
      message: "Email, password, and company name are required",
      error: "MISSING_REQUIRED_FIELDS"
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: "Please enter a valid email address",
      error: "INVALID_EMAIL_FORMAT"
    });
  }

  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: "Password must be at least 6 characters long",
      error: "WEAK_PASSWORD"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const companyId = generateCompanyId();

    const sql = `
      INSERT INTO users (email, password, company, company_id, website, type, province, city, is_validated, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())
    `;

    db.query(
      sql,
      [email, hashedPassword, company, companyId, website, type, province, city],
      (err, result) => {
        if (err) {
          console.error("❌ Database registration error:", err);
          
          if (err.code === "ER_DUP_ENTRY") {
            // Duplicate Company ID
            if (err.sqlMessage.includes("company_id")) {
              return res.status(409).json({
                success: false,
                message: "Generated company ID already exists. Please try registering again.",
                error: "COMPANY_ID_DUPLICATE"
              });
            }
          
            // Duplicate Email
            if (err.sqlMessage.includes("email")) {
              return res.status(409).json({
                success: false,
                message: "This email is already registered. Please use a different email or sign in.",
                error: "EMAIL_ALREADY_EXISTS"
              });
            }
          
            // Generic duplicate fallback
            return res.status(409).json({
              success: false,
              message: "Duplicate entry detected.",
              error: "DUPLICATE_ENTRY"
            });
          }          
          
          return res.status(500).json({ 
            success: false,
            message: "Failed to register user. Please try again later.",
            error: "DATABASE_ERROR",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
          });
        }

        // ✅ SUCCESS - User saved to MySQL ONLY (NOT blockchain yet)
        console.log("\n✅ Registration successful (MySQL)");
        console.log("   User ID:", result.insertId);
        console.log("   Company:", company);
        console.log("   Company ID:", companyId);
        console.log("   Email:", email);
        console.log("   Status: PENDING APPROVAL");
        console.log("   ⚠️ NOT registered to blockchain yet");

        return res.status(201).json({
          success: true,
          message: "Registration successful! Your account is pending validation by the regulator.",
          data: {
            userId: result.insertId,
            companyId,
            email,
            company,
            type,
            status: "pending_validation",
            statusMessage: "Your account will be reviewed by our team. You'll receive an email notification once approved.",
            estimatedReviewTime: "1-2 business days"
          },
          blockchain: {
            status: "pending",
            message: "Will be registered on blockchain after regulator approval"
          }
        });
      }
    );
  } catch (error) {
    console.error("❌ Server error during registration:", error);
    return res.status(500).json({ 
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: "SERVER_ERROR",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

//
// ===================== LOGIN =====================
//
export const loginUser = (req, res) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: "Email and password are required",
      error: "MISSING_CREDENTIALS"
    });
  }

  const sql = "SELECT * FROM users WHERE LOWER(email) = LOWER(?)";
  
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("❌ Database error during login:", err);
      return res.status(500).json({ 
        success: false,
        message: "Database connection error. Please try again later.",
        error: "DATABASE_ERROR",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password. Please check your credentials and try again.",
        error: "INVALID_CREDENTIALS"
      });
    }

    const user = results[0];
    
    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid email or password. Please check your credentials and try again.",
          error: "INVALID_CREDENTIALS"
        });
      }

      // Block login if not validated (except regulators)
      if (user.type !== "regulator" && user.is_validated !== 1) {
        console.log("⚠️ Login blocked - Account not validated");
        console.log("   User:", user.email);
        console.log("   Company:", user.company);
        
        return res.status(403).json({ 
          success: false,
          message: "Your account is pending validation",
          error: "ACCOUNT_NOT_VALIDATED",
          details: {
            status: "pending_validation",
            title: "Account Verification Required",
            description: "Your account is currently under review by our regulatory team. You will receive an email notification once your account has been approved.",
            estimatedTime: "This usually takes 1-2 business days",
            contact: "If you have any questions, please contact support@chaincarbon.com"
          }
        });
      }

      //Generate JWT token with complete user data
      const tokenPayload = {
        id: user.id,
        email: user.email,
        company: user.company,
        companyId: user.company_id || null,
        type: user.type,
        role: user.role || user.type,
        isValidated: user.is_validated === 1
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Prepare safe user object (excluding sensitive data)
      const safeUser = {
        id: user.id,
        email: user.email,
        name: user.company,
        company: user.company,
        companyId: user.company_id || null,
        website: user.website,
        type: user.type,
        role: user.role || user.type,
        province: user.province,
        city: user.city,
        isValidated: user.is_validated === 1,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };

      console.log("✅ Login successful");
      console.log("   User:", safeUser.name);
      console.log("   Email:", safeUser.email);
      console.log("   Type:", safeUser.type);
      console.log("   Role:", safeUser.role);
      console.log("   Company ID:", safeUser.companyId);
      console.log("   Validated:", safeUser.isValidated);
      console.log("   Last Login:", new Date().toISOString());

      return res.status(200).json({ 
        success: true,
        message: `Welcome back, ${safeUser.name}!`,
        token,
        user: safeUser,
        expiresIn: "24h"
      });
      
    } catch (error) {
      console.error("❌ Server error during login:", error);
      return res.status(500).json({ 
        success: false,
        message: "An unexpected error occurred during login. Please try again.",
        error: "SERVER_ERROR",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
};

//
// ===================== GET USER PROFILE =====================
//
export const getUserProfile = (req, res) => {
  const userId = req.user.id;

  const sql = "SELECT id, email, company, company_id, website, type, role, province, city, is_validated, created_at, updated_at FROM users WHERE id = ?";
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Database error fetching user profile:", err);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch user profile",
        error: "DATABASE_ERROR"
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "User not found",
        error: "USER_NOT_FOUND"
      });
    }

    const user = results[0];
    return res.status(200).json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.company,
        company: user.company,
        companyId: user.company_id,
        website: user.website,
        type: user.type,
        role: user.role || user.type,
        province: user.province,
        city: user.city,
        isValidated: user.is_validated === 1,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  });
};

//
// ===================== LOGOUT (Optional - Client-side token removal) =====================
//
export const logoutUser = (req, res) => {
  // JWT is stateless, so logout is handled client-side by removing the token
  // This endpoint is optional and can be used for logging purposes
  
  console.log("👋 User logged out");
  console.log("   User ID:", req.user?.id);
  console.log("   Email:", req.user?.email);
  
  return res.status(200).json({ 
    success: true,
    message: "Logged out successfully. Please clear your token on the client side."
  });
};