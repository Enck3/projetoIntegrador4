

const express = require('express');
const app = express();
const PORT = 3000;
const bcrypt = require('bcrypt')



const { MongoClient } = require('mongodb');


const uri = 'mongodb+srv://lucaspcanhete:123456qwerty@cluster0.qvz9g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
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
        const { name, email, password, telefone, endereco } = req.body;

        // Verificar se os campos foram fornecidos
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça nome, email e password' });
        }

        // Acessar a coleção de usuários
        const db = client.db('projetoIntegrador'); // Substitua pelo nome do seu banco
        const usersCollection = db.collection('users');

        // Verificar se o usuário ou e-mail já existe
        const existingUser = await usersCollection.findOne({ $or: [{ name }, { email }, { telefone }, { endereco }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Nome de usuário ou e-mail já está em uso' });
        }

        // Criptografar a senha antes de armazená-la
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar o objeto do novo usuário
        const newUser = {
            name,
            email,
            password: hashedPassword,
            telefone,
            endereco, 
            createdAt: new Date()
        };

        // Inserir o novo usuário na coleção
        const result = await usersCollection.insertOne(newUser);

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: result.insertedId });
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
        const db = client.db('projetoIntegrador'); // Substitua pelo nome do seu banco
        const usersCollection = db.collection('users');

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


app.post('/register-mechanic', async (req, res) => {
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






// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


