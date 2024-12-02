const cors = require('cors');


const express = require('express');
const app = express();
const PORT = 3000;
const bcrypt = require('bcrypt');

const net = require('net');



const { MongoClient } = require('mongodb');

app.use(express.json());

app.use(cors());

const uri = 'mongodb+srv://lucaspcanhete:123456qwerty@cluster0.ypscm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connectDB = async () => {
    try {
        await client.connect();
        console.log('MongoDB conectado com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1); 
    }
};




connectDB();

// Rota básica
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/user/register', async (req, res) => {
    try {
        const { name, email, password, telefone, cidade } = req.body;

        // Verificar se os campos foram fornecidos
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça nome, email e password' });
        }

        // Acessar a coleção de usuários
        const db = client.db('projetoIntegrador4');
        const usersCollection = db.collection('users');

        // Verificar se o usuário ou e-mail já existe
        const existingUser = await usersCollection.findOne({ $or: [{ email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Nome de usuário ou e-mail já está em uso' });
        }

        // Criar conexão com o servidor Java
        const clientJava = new net.Socket();

        clientJava.connect(8080, 'localhost', () => {
            console.log('Conectado ao servidor Java');
            clientJava.write(`${password}\n`); // Enviar senha ao servidor
        });

        clientJava.on('data', async (data) => {
            try {
                const isValid = data.toString().trim(); // Remover espaços ou quebras de linha
                console.log('Resposta do servidor Java:', isValid);

                if (isValid === "True") {
                    // Hash da senha e inserção no banco
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = {
                        name,
                        email,
                        password: hashedPassword,
                        telefone,
                        cidade,
                        createdAt: new Date(),
                    };
                    const result = await usersCollection.insertOne(newUser);
                    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: result.insertedId });
                } else {
                    res.status(400).json({ message: 'Senha inválida' });
                }
            } catch (error) {
                console.error('Erro ao processar resposta do Java:', error);
                res.status(500).json({ message: 'Erro ao validar senha' });
            } finally {
                clientJava.destroy(); // Garantir encerramento da conexão
            }
        });

        clientJava.on('error', (error) => {
            console.error('Erro na conexão com o servidor Java:', error);
            res.status(500).json({ message: 'Erro na comunicação com o servidor Java' });
        });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
});


app.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar se os campos foram fornecidos
        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça email e password' });
        }

        // Acessar a coleção de usuários
        const db = client.db('projetoIntegrador4'); // Substitua pelo nome do seu banco
        const usersCollection = db.collection('users');

        // Verificar se o usuário ou e-mail já existe
        const user = await usersCollection.findOne( { email: email } );
        if (!user) {
            return res.status(400).json({ message: 'Usuário não existente' });
        }

       
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Senha incorreta.' });
        }

       

        
        

        
        

        res.status(201).json({ message: 'Login realizado com sucesso', userId: user._id });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
});


app.post('/mecanico/register', async (req, res) => {
    try {
        const {
            nome,
            especialidades,
            localizacao,
            avaliacao_media = 0, // Valor inicial de 0
            preco_base,
            servicos_oferecidos,
            dias_funcionamento,
            horarios_funcionamento
        } = req.body;

        // Validação dos dados obrigatórios
        if (!nome || !localizacao || !especialidades || !preco_base || !dias_funcionamento || !horarios_funcionamento) {
            return res.status(400).json({ message: 'Campos obrigatórios estão faltando.' });
        }

        // Acessar a coleção de mecânicos
        const db = client.db('nome-do-banco'); // Substitua pelo nome do seu banco
        const mechanicsCollection = db.collection('mecanicos');
        const servicesCollection = db.collection('servicos');

        // Criar o novo mecânico
        const newMechanic = {
            nome,
            especialidades,
            localizacao,
            avaliacao_media,
            preco_base,
            dias_funcionamento,
            horarios_funcionamento,
            createdAt: new Date()
        };

        // Inserir o mecânico e obter o ID gerado
        const mechanicResult = await mechanicsCollection.insertOne(newMechanic);
        const mechanicId = mechanicResult.insertedId;

        // Inserir os serviços oferecidos, se houver
        if (servicos_oferecidos && servicos_oferecidos.length > 0) {
            const serviceDocs = servicos_oferecidos.map(service => ({
                mecanico_id: mechanicId,
                nome_servico: service.nome_servico,
                descricao: service.descricao,
                preco: service.preco,
                tempo_estimado: service.tempo_estimado
            }));
            await servicesCollection.insertMany(serviceDocs);
        }

        res.status(201).json({ message: 'Mecânico cadastrado com sucesso!', mechanicId });
    } catch (error) {
        console.error('Erro ao cadastrar mecânico:', error);
        res.status(500).json({ message: 'Erro ao cadastrar mecânico' });
    }
});


app.post('/mecanico/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar se os campos foram fornecidos
        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça email e password' });
        }

        // Acessar a coleção de usuários
        const db = client.db('projetoIntegrador'); // Substitua pelo nome do seu banco
        const usersCollection = db.collection('mecanicos');

        // Verificar se o usuário ou e-mail já existe
        const user = await usersCollection.findOne( { email: email } );
        if (!user) {
            return res.status(400).json({ message: 'Usuário não existente' });
        }

        // Criptografar a senha antes de armazená-la
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Senha incorreta.' });
        }


        res.status(201).json({ message: 'Login realizado com sucesso', userId: user._id });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
});


app.get('/mecanico/perfil/:id', async (req, res) => {
    try {
        const mechanicId = req.params.id;

        if (!ObjectId.isValid(mechanicId)) {
            return res.status(400).json({ message: 'ID de mecânico inválido.' });
        }

        const db = client.db('projetoIntegrador');
        const mechanicosCollection = db.collection('mecanicos');
        const servicosCollection = db.collection('servicos');

        // Obter detalhes do mecânico
        const mechanic = await mechanicsCollection.findOne({ _id: new ObjectId(mechanicId) });

        if (!mechanic) {
            return res.status(404).json({ message: 'Mecânico não encontrado.' });
        }

        // Obter detalhes dos serviços oferecidos pelo mecânico
        const services = await servicosCollection.find({ mecanico_id: new ObjectId(mechanicId) }).toArray();

        res.status(200).json({
            mechanic: {
                nome: mechanic.nome,
                especialidades: mechanic.especialidades,
                localizacao: mechanic.localizacao,
                preco_base: mechanic.preco_base,
                dias_funcionamento: mechanic.dias_funcionamento,
                horarios_funcionamento: mechanic.horarios_funcionamento,
                avaliacao_media: mechanic.avaliacao_media,
                servicos_oferecidos: services
            }
        });
    } catch (error) {
        console.error('Erro ao exibir perfil do mecânico:', error);
        res.status(500).json({ message: 'Erro ao exibir perfil do mecânico' });
    }
});


app.put('/mecanico/editar/:id', async (req, res) => {
    try {
        const mechanicId = req.params.id;
        const { nome, especialidades, localizacao, preco_base, dias_funcionamento, horarios_funcionamento } = req.body;

        // Verificar se o ID é válido
        if (!ObjectId.isValid(mechanicId)) {
            return res.status(400).json({ message: 'ID de mecânico inválido.' });
        }

        const db = client.db('projetoIntegrador');
        const mechanicsCollection = db.collection('mecanicos');

        // Atualizar o perfil do mecânico
        const updateData = {
            ...(nome && { nome }),
            ...(especialidades && { especialidades }),
            ...(localizacao && { localizacao }),
            ...(preco_base && { preco_base }),
            ...(dias_funcionamento && { dias_funcionamento }),
            ...(horarios_funcionamento && { horarios_funcionamento })
        };

        const result = await mechanicsCollection.updateOne(
            { _id: new ObjectId(mechanicId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Mecânico não encontrado.' });
        }

        res.status(200).json({ message: 'Perfil de mecânico atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao editar perfil do mecânico:', error);
        res.status(500).json({ message: 'Erro ao editar perfil do mecânico' });
    }
});

app.get('/buscar-por-cidade', async (req, res) => {
    const { cidade } = req.query;

    // Verifica se o parâmetro de cidade foi passado
    if (!cidade) {
        return res.status(400).json({ error: 'A cidade é obrigatória para a busca.' });
    }

    try {
        await client.connect();
        const database = client.db('projetoIntegrador');
        const mecanicosCollection = database.collection('mecanicos');

        // Filtra os mecânicos pela cidade fornecida
        const mecanicos = await mecanicosCollection.find({ localizacao: cidade }).toArray();

        // Retorna uma mensagem caso não haja mecânicos na cidade
        if (mecanicos.length === 0) {
            return res.status(404).json({ message: 'Nenhum mecânico encontrado nessa cidade.' });
        }

        res.json(mecanicos);
    } catch (error) {
        console.error('Erro ao buscar mecânicos:', error);
        res.status(500).json({ error: 'Erro no servidor ao buscar mecânicos.' });
    } finally {
        await client.close();
    }
});

app.post('/cadastro-agendamento', async (req, res) => {
    try {
        const {
            nomeCliente,
            emailCliente,
            emailMecanico,
            servico,
            dataAgendamento
            
        } = req.body;

        // Validação dos dados obrigatórios
        if (!nomeCliente || !emailCliente || !servico || !dataAgendamento || !emailMecanico) {
            return res.status(400).json({ message: 'Campos obrigatórios estão faltando.' });
        }

        // Acessar a coleção de mecânicos
        const db = client.db('projetoIntegrador4');
        
        const agendamentoCollection = db.collection('agendamentos');
         // Substitua pelo nome do seu banco
        

        // Criar o novo mecânico
        const newAgendamento = {
            nomeCliente,
            emailCliente,
            emailMecanico,
            
            servico,
            dataAgendamento
        };

        // Inserir o mecânico e obter o ID gerado
        const agendamentoResult = await agendamentoCollection.insertOne(newAgendamento);
        const agendamentoId = agendamentoResult.insertedId;

        // Inserir os serviços oferecidos, se houver
        

        res.status(201).json({ message: 'Agendamento cadastrado com sucesso!', agendamentoId });
    } catch (error) {
        console.error('Erro ao cadastrar mecânico:', error);
        res.status(500).json({ message: 'Erro ao cadastrar mecânico' });
    }
});




// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


