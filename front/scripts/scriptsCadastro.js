document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const telefone = document.getElementById('telefone').value;
    const cidade = document.getElementById('cidade').value;

    if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'name': nome, 'email': email, 'password': password, 'telefone': telefone, 'cidade': cidade })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
    }
});