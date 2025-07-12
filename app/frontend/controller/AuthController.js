
import { logInUser, registerUser, SendVerifyMail, SendSignInMail } from "../api/AuthApiHandler.js"
import { loginWithToken } from "../api/VerifactionApiHandler.js"
import { showToast } from "../helper.js";

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById("RegisterForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function handleSignUp(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            registerUser(username, email, password).then((res) => {
                var now = new Date(res.jwt.epiresAt)
                document.cookie = "token=" + res.jwt.token + ";expires=" + now + ";path=/";
                document.getElementById('kontoerstelltOverlay').style.display = 'flex'
            }).catch((err) => {
                showToast("❌ Failed to sign up user: " + (err.message || "Unknown error"))
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
            logInUser(email, password).then((res) => {
                var now = new Date(res.jwt.epiresAt)
                document.cookie = "token=" + res.jwt.token + ";expires=" + now + ";path=/";
                //admin cookie for navbar
                if (res.user.roles.some(role => role.roleName === 'admin')) {
                    document.cookie = "admin=" + res.jwt.token + ";expires=" + now + ";path=/";
                }
                window.location.href = '/';
            }).catch((err) => {
                showToast("❌ Failed to sign in user: " + (err.message || "Unknown error"));
                console.error(err);
            });
        });
    }

    const button = document.getElementById("button-sendAgain");
    if (button) {
        button.addEventListener("click", function handleSendVerifyMail(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            SendVerifyMail(email).then((res) => {
                const emailSentOverlay = document.getElementById('emailSentOverlay');
                if (emailSentOverlay) {
                    emailSentOverlay.style.display = 'flex';
                } else {
                    console.error('Element with ID "emailSentOverlay" not found');
                }
            }).catch((err) => {
                showToast("❌ Failed to send email again: " + (err.message || "Unknown error"));
                console.error(err);
            });
        });
    }

    const loginFormLink = document.getElementById("LoginFormLink");
    if (loginFormLink) {
        loginFormLink.addEventListener("submit", function handleLogIn(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            SendSignInMail(email).then((res) => {
                document.getElementById('emailSentOverlay').style.display = 'flex'
            }).catch((err) => {
                showToast("❌ Failed to sign in user: " + (err.message || "Unknown error"));
                console.error(err);
            });
        });
    }

    const loginToken = document.getElementById("loginToken-content");
    if (loginToken) {
        let params = new URLSearchParams(document.location.search)
        const token = params.get("token")
        loginWithToken(token).then((res) => {
            var now = new Date(res.jwt.epiresAt)
            document.cookie = "token=" + res.jwt.token + ";expires=" + now + ";path=/";
            window.location.href = '/';
        }).catch((err) => {
            showToast("❌ Failed to sign in user: " + (err.message || "Unknown error"));
            console.error(err);
        });
    }
});