function getLoggedInUser() {
  try {
    const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    return {
      name: user.name || user.fullName || user.username || "Guest User",
      role: user.role || user.userRole || "End User",
    };
  } catch {
    return { name: "Guest User", role: "End User" };
  }
}const loggedInUser = getLoggedInUser();
 
 document.getElementById('username').textContent=loggedInUser.name;
   document.getElementById("userLogo").textContent = loggedInUser.name.charAt(0);