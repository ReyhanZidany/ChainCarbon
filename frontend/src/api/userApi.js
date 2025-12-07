import API from "./axios";

// Ambil profil user yang login
export const getUserProfile = async (token) => {
  const res = await API.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update profil user
export const updateUserProfile = async (form, token) => {
  const res = await API.put("/users/me", form, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
