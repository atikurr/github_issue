const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;

  const password = document.getElementById("password").value;

  // Check Credentials
  if (username === "admin" && password === "admin123") {
    localStorage.setItem("isLoggedIn", true);

    window.location.href = "issues.html";
  } else {
    alert("Invalid Username or Password");
  }
});
