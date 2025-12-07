import db from "../config/db.js";

// 🔹 Ambil data user berdasarkan ID
export const getUserById = (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT id, name, email, company, website, type, province, city, created_at, updated_at FROM users WHERE id = ?";

  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Gagal mengambil data user" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(rows[0]);
  });
};

// 🔹 Update profil user
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, company, website, province, city } = req.body;

  // Hanya field tertentu yang boleh diupdate
  const sql = `
    UPDATE users 
    SET name = ?, company = ?, website = ?, province = ?, city = ?, updated_at = NOW()
    WHERE id = ?
  `;

  db.query(sql, [name, company, website, province, city, id], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Gagal memperbarui profil" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Ambil data terbaru setelah update
    db.query(
      "SELECT id, name, email, company, website, type, province, city, created_at, updated_at FROM users WHERE id = ?",
      [id],
      (err, rows) => {
        if (err) {
          console.error("Error fetching user:", err);
          return res.status(500).json({ message: "Gagal mengambil data user" });
        }

        res.json(rows[0]);
      }
    );
  });
};
