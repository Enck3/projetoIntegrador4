document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === "usuario@example.com" && password === "senha123") {
        localStorage.setItem("isLoggedIn", "true");
        alert("Login realizado com sucesso!");
        window.location.href = "profile.html";
    } else {
        alert("Email ou senha incorretos.");
    }
});

function logout() {
    localStorage.removeItem("isLoggedIn");
    alert("Você saiu!");
    window.location.href = "login.html";
}

document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return;
    }

    alert(`Usuário ${nome} cadastrado com sucesso!`);
    window.location.href = "login.html";
});

function loadProfile() {
    if (!localStorage.getItem("isLoggedIn")) {
        window.location.href = "login.html";
        return;
    }
    
    document.getElementById('nome').textContent = "Nome do Mecânico";
    document.getElementById('email').textContent = "mecanico@example.com";
}
document.addEventListener("DOMContentLoaded", loadProfile);

document.addEventListener("DOMContentLoaded", function () {
    const profileLink = document.getElementById("profileLink");

    if (localStorage.getItem("isLoggedIn")) {
        profileLink.style.display = "inline";
    } else {
        profileLink.style.display = "none";
    }
});

function searchMechanics() {
    const specialtyFilter = document.getElementById('specialtyFilter').value;
    const resultsContainer = document.getElementById('results');

    resultsContainer.innerHTML = `<p>Buscando mecânicos com especialidade: ${specialtyFilter}...</p>`;
}

function searchMechanicsByLocation() {
    const location = document.getElementById('location').value;
    const resultsContainer = document.getElementById('results');

    resultsContainer.innerHTML = `<p>Buscando mecânicos próximos de ${location}...</p>`;
}
