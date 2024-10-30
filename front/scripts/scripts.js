/*
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
*/
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

function logout() {
    localStorage.removeItem("isLoggedIn");
    alert("Você saiu!");
    window.location.href = "login.html";
}
/*
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
*/
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
/*
function searchMechanics() {
    const specialtyFilter = document.getElementById('specialtyFilter').value;
    const resultsContainer = document.getElementById('results');

    resultsContainer.innerHTML = `<p>Buscando mecânicos com especialidade: ${specialtyFilter}...</p>`;
}
*/
function searchMechanics() {
    const specialtyFilter = document.getElementById('specialtyFilter').value;
    const resultsContainer = document.getElementById('results');

    resultsContainer.innerHTML = `<p>Buscando mecânicos com especialidade: ${specialtyFilter}...</p>`;

    fetch('http://localhost:3000/mecanicos/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ especialidade: specialtyFilter })
    })
    .then(response => {
        if (!response.ok) throw new Error("Erro ao buscar mecânicos");
        return response.json();
    })
    .then(mechanics => {
        if (mechanics.length > 0) {
            resultsContainer.innerHTML = mechanics.map(mec => `
                <div class="mechanic-card">
                    <h3>${mec.nome}</h3>
                    <p>Especialidades: ${mec.especialidades.join(', ')}</p>
                    <button onclick="viewMechanicProfile('${mec._id}')">Ver perfil</button>
                </div>
            `).join('');
        } else {
            resultsContainer.innerHTML = "<p>Nenhum mecânico encontrado.</p>";
        }
    })
    .catch(error => {
        resultsContainer.innerHTML = "<p>Erro de conexão com o servidor.</p>";
        console.error("Erro ao buscar mecânicos:", error);
    });
}
/*
function searchMechanicsByLocation() {
    const location = document.getElementById('location').value;
    const resultsContainer = document.getElementById('results');

    resultsContainer.innerHTML = `<p>Buscando mecânicos próximos de ${location}...</p>`;
}
*/
async function searchMechanicsByLocation() {
    // Obtém a localização do campo de entrada
    const location = document.getElementById('location').value;

    // Verifica se o campo de localização foi preenchido
    if (!location) {
        alert('Por favor, digite uma localização para buscar.');
        return;
    }

    try {
        // Faz uma requisição GET para a rota de busca de mecânicos por cidade
        const response = await fetch(`/buscar-por-cidade?cidade=${encodeURIComponent(location)}`);
        
        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao buscar mecânicos.');
        }

        // Converte a resposta em JSON
        const mechanics = await response.json();

        // Seleciona o contêiner de resultados e limpa o conteúdo anterior
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        // Verifica se há mecânicos na resposta
        if (mechanics.length === 0) {
            resultsContainer.innerHTML = '<p>Nenhum mecânico encontrado para essa localização.</p>';
            return;
        }

        // Itera pelos mecânicos e cria elementos HTML para exibir os dados
        mechanics.forEach(mechanic => {
            const mechanicDiv = document.createElement('div');
            mechanicDiv.classList.add('mechanic');

            // Cria elementos para as informações do mecânico
            const name = document.createElement('h3');
            name.textContent = `Nome: ${mechanic.nome}`;
            
            const specialties = document.createElement('p');
            specialties.textContent = `Especialidades: ${mechanic.especialidades.join(', ')}`;
            
            const locationElement = document.createElement('p');
            locationElement.textContent = `Localização: ${mechanic.localizacao}`;
            
            const rating = document.createElement('p');
            rating.textContent = `Avaliação Média: ${mechanic.avaliacao_media ? mechanic.avaliacao_media.toFixed(1) : 'N/A'}`;
            
            const basePrice = document.createElement('p');
            basePrice.textContent = `Preço Base: R$${mechanic.preco_base.toFixed(2)}`;

            // Anexa as informações ao contêiner do mecânico
            mechanicDiv.appendChild(name);
            mechanicDiv.appendChild(specialties);
            mechanicDiv.appendChild(locationElement);
            mechanicDiv.appendChild(rating);
            mechanicDiv.appendChild(basePrice);

            // Adiciona o mecânico ao contêiner de resultados
            resultsContainer.appendChild(mechanicDiv);
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar mecânicos. Tente novamente mais tarde.');
    }
}
// Função para buscar os detalhes do mecânico
async function loadMechanicProfile(mechanicId) {
    try {
        const response = await fetch(`/mecanico/perfil/${mechanicId}`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar perfil do mecânico.');
        }

        const data = await response.json();
        const mechanic = data.mechanic;

        // Preencher os elementos HTML com os dados do mecânico
        document.getElementById('nome').textContent = mechanic.nome;
        document.getElementById('localizacao').textContent = mechanic.localizacao;
        document.getElementById('preco_base').textContent = `R$${mechanic.preco_base.toFixed(2)}`;
        document.getElementById('dias_funcionamento').textContent = mechanic.dias_funcionamento.join(', ');
        document.getElementById('horarios_funcionamento').textContent = mechanic.horarios_funcionamento.join(', ');
        document.getElementById('avaliacao_media').textContent = mechanic.avaliacao_media ? mechanic.avaliacao_media.toFixed(1) : 'N/A';
        document.getElementById('especialidades').textContent = mechanic.especialidades.join(', ');

        // Exibir serviços oferecidos
        const servicosContainer = document.getElementById('servicos_oferecidos');
        servicosContainer.innerHTML = ''; // Limpa o conteúdo anterior
        mechanic.servicos_oferecidos.forEach(servico => {
            const serviceDiv = document.createElement('div');
            serviceDiv.textContent = servico.nome; // Altere para os campos corretos se necessário
            servicosContainer.appendChild(serviceDiv);
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar perfil do mecânico. Tente novamente mais tarde.');
    }
}