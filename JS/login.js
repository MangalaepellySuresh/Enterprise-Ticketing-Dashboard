const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginRole = document.getElementById("loginRole");

const nameInput = document.getElementById("name");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const confirmPassword = document.getElementById("confirmPassword");
const department = document.getElementById("department");
const regRole = document.getElementById("regRole");

const passwordRulesBox = document.getElementById("passwordRules");
const r1 = document.getElementById("r1");
const r2 = document.getElementById("r2");
const r3 = document.getElementById("r3");
const r4 = document.getElementById("r4");
const r5 = document.getElementById("r5");

const showError = (id, message) => {
  document.getElementById(id).innerText = message;
};

const clearErrors = () => {
  document.querySelectorAll(".error").forEach(e => e.innerText = "");
};

const getUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || [];
};

const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};


const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

const checkPasswordRules = (password) => {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };
};


const isStrongPassword = (password) => {
  const r = checkPasswordRules(password);
  return r.length && r.upper && r.lower && r.number && r.special;
};

const updatePasswordUI = (password) => {
  if (!passwordRulesBox) return;

  if (password === "") {
    passwordRulesBox.style.display = "none";
    return;
  }

  passwordRulesBox.style.display = "block";
  const rules = checkPasswordRules(password);

  toggleRule(r1, rules.length);
  toggleRule(r2, rules.upper);
  toggleRule(r3, rules.lower);
  toggleRule(r4, rules.number);
  toggleRule(r5, rules.special);
};

const toggleRule = (element, valid) => {
  element.classList.toggle("valid", valid);
};

const handleRegister = (event) => {
  event.preventDefault();
  clearErrors();

  const name = nameInput.value.trim();
  const email = regEmail.value.trim().toLowerCase();
  const password = regPassword.value;
  const confirmPwd = confirmPassword.value;
  const dept = department.value.trim();
  const role = regRole.value;

  if (name.length < 3) {
    showError("nameError", "Minimum 3 characters");
    return;
  }

  if (!isValidEmail(email)) {
    showError("regEmailError", "Enter valid email");
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    showError("regEmailError", "Email already registered");
    return;
  }

  if (!isStrongPassword(password)) {
    showError("regPasswordError", "Weak password");
    return;
  }

  if (password !== confirmPwd) {
    showError("confirmError", "Passwords do not match");
    return;
  }

  if (!dept) {
    showError("deptError", "Enter department");
    return;
  }

  if (!role) {
    showError("roleError", "Select role");
    return;
  }

  users.push({ name, email, password, department: dept, role });
  saveUsers(users);
  window.location.href = "login.html";
};

const handleLogin = (event) => {
  event.preventDefault();
  clearErrors();

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value;
  const role = loginRole.value;

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    showError("loginEmailError", "Email not registered");
    return;
  }

  if (!email) {
    showError("loginEmailError", "Enter email");
    return;
  }

  if (!password) {
    showError("loginPasswordError", "Enter password");
    return;
  }
  if (user.password !== password) {
    showError("loginPasswordError", "Incorrect password");
    return;
  }

  if (!role) {
    showError("loginRoleError", "Select role");
    return;
  }


  if (user.role !== role) {
    showError("loginRoleError", "Role mismatch");
    return;
  } if (!user.ac)

    localStorage.setItem("loggedInUser", JSON.stringify(user));
  window.location.href = "tickets.html";
};

document.addEventListener("DOMContentLoaded", () => {

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
    regPassword.addEventListener("input", () => {
      updatePasswordUI(regPassword.value);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

});
