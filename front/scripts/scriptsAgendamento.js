document.getElementById('agendamentoCadastro').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const nomeCliente = document.getElementById('nomeCliente').value;
    const emailCliente = document.getElementById('emailCliente').value;
    const emailMecanico = document.getElementById('emailMecanico').value;
    const servico = document.getElementById('servico').value;
    const dataAgendamento = document.getElementById('data').value;
    

  

    try {
        const response = await fetch('http://localhost:3000/cadastro-agendamento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'nomeCliente': nomeCliente, 'emailCliente': emailCliente, 'emailMecanico': emailMecanico,  'servico': servico, 'dataAgendamento': dataAgendamento })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Agendamento cadastrado com sucesso!");
            window.location.href = "index.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
    }
});