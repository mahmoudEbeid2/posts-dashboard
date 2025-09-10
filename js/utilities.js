// get from storage
import { getFromStorage } from "./storge.js";

//validate email
export function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

//validate password
export function validatePassword(password) {
  return password.length >= 6;
}

//generate random token
export function generateToken(length = 32) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// check if user is logged in
export function isUserLoggedIn() {
  const currentUser = getFromStorage("currentUser");
  return !!currentUser;
}
