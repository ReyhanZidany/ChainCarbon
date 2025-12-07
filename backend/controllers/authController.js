import db from "../config/db.js";

// Register
export const registerUser = (req, res) => {
  const { name, email, password, company, website, type, province, city } =
    req.body;

  const sql =
    "INSERT INTO users (name, email, password, company, website, type, province, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, email, password, company, website, type, province, city],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.status(201).json({ message: "User registered successfully" });
    }
  );
};

// Login
export const loginUser = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });
    return res
      .status(200)
      .json({ message: "Login successful", user: results[0] });
  });
};
