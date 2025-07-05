import { logInUser, registerUser, verifyMail } from "../api/AuthApiHandler.js"

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById("RegisterForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function handleSignUp(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            registerUser(username, email, password).then((res) => {
                document.cookie = "token=" + res.jwt.token;
                window.location.href = '/';
            }).catch((err) => {
                alert("❌ Failed to sign up user: " + (err.message || "Unknown error"));
                console.error(err);
            });
        });
    }

    const loginForm = document.getElementById("LoginFormPassword");
    if (loginForm) {
        loginForm.addEventListener("submit", function handleLogIn(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            console.log(email);
            logInUser(email, password).then((res) => {
                document.cookie = "token=" + res.jwt.token;
                window.location.href = '/';
            }).catch((err) => {
                alert("❌ Failed to sign in user: " + (err.message || "Unknown error"));
                console.error(err);
            });
        });
    }

    const button = document.getElementById("verify");
    if (button) {
        button.addEventListener("click", function handleverifyMail(event) {
            event.preventDefault();
            const email = req.
            verifyMail(email, token).then((res) => {
                window.location.href = '/';
            }).catch((err) => {
                alert("❌ Failed to sign in user: " + (err.message || "Unknown error"));
                console.error(err);
            });
        });
    }
});