//import check user logged in
import { isUserLoggedIn } from "./utilities.js";

// check if user is already logged in

export const authCheck = () => {
  window.addEventListener("DOMContentLoaded", () => {
    if (isUserLoggedIn()) {
      window.location.href = "pages/dashboard.html";
    } else {
      window.location.href = "pages/login.html";
    }
  });
};

// call authCheck function
authCheck();
