document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupBtn = document.getElementById("signup-btn");

    if (signupBtn) {
        signupBtn.addEventListener("click", function() {
            window.location.href = "signup.html";
        });
    }

    if (loginForm) {
        console.log("hi") 
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let formData = { username, password };

            fetch("login.php", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" }
            })
            .then(response => { 
              console.log("api request failed :((")
              response.json()
            })
            .then(data => {
                if (data.error === "") {
                    alert("Login successful! User ID: " + data.id);
                    window.location.href = "Manager"; // send to the contact manager
                } else {
                    alert("Error: " + data.error);
                }
            })
            .catch(error => console.error("Error:", error));
        });
    }
});
