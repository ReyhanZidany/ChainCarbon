import API from "./axios";

// Ambil data user by ID
export const getUserById = async (id) => {
  try {
    const res = await API.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Gagal mengambil data user" };
  }
};

// Update profil user
export const updateUser = async (id, userData) => {
  try {
    const res = await API.put(`/users/${id}`, userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Gagal memperbarui profil" };
  }
};
