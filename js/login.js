// import validation functions and Generate random token function
import { validateEmail, validatePassword, generateToken } from "./utilities.js";

// import save and get and remove functions from storge.js
import { saveToStorage, getFromStorage } from "./storge.js";

// select elements
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const errorMail = document.getElementById("email-error");
const errorPassword = document.getElementById("password-error");
const currentUser = getFromStorage("auth");
const passwordIcon = document.querySelector(".password-icon");

// toggle password visibility
passwordIcon.addEventListener("click", () => {
  const classList = passwordIcon.classList;
  if (classList.contains("fa-eye-slash")) {
    classList.remove("fa-eye-slash");
    classList.add("fa-eye");
  } else {
    classList.remove("fa-eye");
    classList.add("fa-eye-slash");
  }
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

// check if user is already logged in
window.addEventListener("DOMContentLoaded", () => {
  if (currentUser) {
    window.location.href = "dashboard.html";
  }
});

// validate email on input
emailInput.addEventListener("input", () => {
  if (!validateEmail(emailInput.value)) {
    errorMail.textContent = "Please enter a valid email.";
  } else {
    errorMail.textContent = "";
  }
});

// validate password on input
passwordInput.addEventListener("input", () => {
  if (!validatePassword(passwordInput.value)) {
    errorPassword.textContent = "Password must be at least 6 characters.";
  } else {
    errorPassword.textContent = "";
  }
});

// handle form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  // validate email and password
  if (!validateEmail(email)) {
    errorMail.textContent = "Please enter a valid email.";
    return;
  }
  if (!validatePassword(password)) {
    errorPassword.textContent = "Password must be at least 6 characters.";
    return;
  }
  errorMail.textContent = "";
  errorPassword.textContent = "";

  // save current user to local storage
  const token = generateToken();

  saveToStorage("auth", token);
  emailInput.value = "";
  passwordInput.value = "";
  window.location.href = "dashboard.html";
});
