import { registerUser } from "../api/AuthApiHandler.js"

document.getElementById("RegisterForm")

.addEventListener("submit", function handleSignUp(event){
    event.preventDefault();
    const email = document.getElementById('email').value
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    registerUser(username, email, password).then((res) => {
        document.cookie = "token="+res.jwt.token;
        window.location.href = '/';
    }).catch((err) => {
        alert("❌ Failed to sign up user: " + (err.message || "Unknown error"));
        console.error(err)
    })
});