document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");

    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            event.preventDefault();

            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let password2 = document.getElementById("password2").value;

            if (password !== password2) {
                alert("Passwords do not match!");
                return;
            }

            let formData = { username, password };

            fetch("signup.php", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error === "") {
                    alert("Signup successful!");
                    window.location.href = "./login.html";
                } else {
                    alert("Error: " + data.error);
                }
            })
            .catch(error => console.error("Error:", error));
        });
    }
});

