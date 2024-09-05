document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordMessage = document.getElementById('passwordMessage');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Toggle password visibility
    passwordToggle.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggle.innerHTML = '&#128065;'; // Eye icon
        } else {
            passwordInput.type = 'password';
            passwordToggle.innerHTML = '&#128065;'; // Eye icon
        }
    });

    // Password strength validation
    const isPasswordStrong = (password) => {
        // https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength
        //AA#12abc
        const regex = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/;
        return regex.test(password);
    };

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
        passwordMessage.classList.add('hidden');

        const username = document.getElementById('username').value;
        const password = passwordInput.value;

        if (!isPasswordStrong(password)) {
            passwordMessage.classList.remove('hidden');
            return;
        }

        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
        })
        .then(function (response) {
            if (response.status === 201) {
                return response.json();
            } else {
                return response.json().then(function (data) {
                    throw new Error(data.message || 'An error occurred during login.');
                });
            }
        })
        .then(function (data) {
            successMessage.classList.remove('hidden');
            successMessage.textContent = 'Login successful! Redirecting...';
            localStorage.setItem('token', data.token);

            setTimeout(function () {
                window.location.href = '/home.html';
            }, 2000);
        })
        .catch(function (error) {
            errorMessage.classList.remove('hidden');
            errorMessage.textContent = error.message;
        });
    });
});
