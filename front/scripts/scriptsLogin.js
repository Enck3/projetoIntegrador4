document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'email': email, 'password': password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Login realizado com sucesso!");
            window.location.href = "buscameclocal.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Erro ao fazer login: " + error.message);
    }
});