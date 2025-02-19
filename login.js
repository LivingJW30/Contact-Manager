function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie = "userId=" + userId + "; expires=" + date.toUTCString() + "; path=/; SameSite=Lax";
    console.log("Cookie saved:",  document.cookie);
}  

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupBtn = document.getElementById("signup-btn");

    if (signupBtn) {
        signupBtn.addEventListener("click", function() {
            window.location.href = "signup.html";
        });
    }

    if (loginForm) {
        console.log("hi again");
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let formData = { username, password };
  
            // make api  request
            fetch("login.php", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" }
            })
            // request err
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            // success
            .then(data => {
                if (data.error === "") {
                    // change here: defines userId to get contacts
                    userId = data.id;
                    saveCookie();
                    alert("Login successful! User ID: " + userId);
                    //window.location.href = "contactManager.html";
                } else {
                    alert("Error: " + data.error);
                }
            })
            // generic error
            .catch(error => {
                console.error("Error:", error);
                alert("Login failed: " + error.message); // Show user feedback
            });
        });
    }
});
