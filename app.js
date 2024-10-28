import { MongoClient } from 'mongodb';

const express = require('express');
const app = express();
const PORT = 3000;


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
        const { username, email, password } = req.body;

        // Verificar se os campos foram fornecidos
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça username, email e password' });
        }

        // Acessar a coleção de usuários
        const db = client.db('projetoIntegrador'); // Substitua pelo nome do seu banco
        const usersCollection = db.collection('users');

        // Verificar se o usuário ou e-mail já existe
        const existingUser = await usersCollection.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Nome de usuário ou e-mail já está em uso' });
        }

        // Criptografar a senha antes de armazená-la
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar o objeto do novo usuário
        const newUser = {
            username,
            email,
            password: hashedPassword,
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

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


