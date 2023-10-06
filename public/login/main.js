// show Password
function showPassword(event) {
    event.target.className = "bi bi-eye-slash";
    event.target.previousElementSibling.type = "text";
    event.target.removeEventListener('click', showPassword);
    event.target.addEventListener('click', hidePassword);
}

// hide password
function hidePassword(event) {
    event.target.className = "bi bi-eye";
    event.target.previousElementSibling.type = "password";
    event.target.removeEventListener('click', hidePassword);
    event.target.addEventListener('click', showPassword);
}



function login(event) {
    event.preventDefault()
    let email = document.getElementById("email-login").value
    let password = document.getElementById("password-login").value
    let message = document.querySelector(".validationMessage");

    if (!(email.endsWith("@gmail.com"))) {
        message.innerText = `Invalid email address`;
        message.style.display = "block";
        message.style.color = "#e55865";
        return;
    }

    if (
        email.trim() === '' ||
        password.trim() === ''
        // || password.length > 8 || password.length < 4
    ) {
        message.innerText = `Please fill required fields`;
        message.style.display = "block";
        message.style.color = "#e55865";
        return;
    }

    axios.post(`/api/v1/login`, {
            email: email,
            password: password,
        })
        .then(function(response) {
            console.log("login successfully")
            message.style.display = "none"
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Login Successfull',
                timer: 1000,
                showConfirmButton: false
            });
            window.location.pathname = "/"
        })
        .catch(function(error) {
            // handle error
            console.log("error")
            console.error(error.data);
            Swal.fire({
                icon: 'error',
                title: 'Error in logging in',
                text: "Please enter correct email or password",
                timer: 2500,
                showConfirmButton: false
            });
        })

    document.getElementById("email-login").value
    document.getElementById("password-login").value
}