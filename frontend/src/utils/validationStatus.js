// helper untuk map nilai is_validated ke label yang konsisten dan mudah dipakai di UI
export const mapValidationStatus = (val) => {
    const n = Number(val);
    if (n === 1) return "Verified";
    if (n === 2) return "Rejected";
    return "Awaiting Verification";
  };
  
  export const statusBadgeClass = (status) => {
    // return a tailwind class string for badge depending on status text
    if (status === "Verified") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700"; // Awaiting Verification
  };