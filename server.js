const express = require('express');
const path = require('path')
const sql = require("mssql")
var cors = require("cors");

const server = express();
const PORT = 3000;

const config = {
    user: 'ramonfranco',
    password: '!@Ra321!@',
    server: 'brasil-fatec2.database.windows.net',
    database: 'fatec-web-jogo',
    options: {
        encrypt: true
    }
}

const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

server.use(cors(corsOpts));

server.use(express.json())

server.use(express.static(path.join(__dirname)))

server.post('/atualizarVida', async (req, res) => {

    const { vidaHeroi, vidaVilao } = req.body

    try {
        await sql.connect(config)
        const request = new sql.Request();
        await request.query(
            `MERGE INTO Personagens AS target
        USING (VALUES ('heroi', ${vidaHeroi}), ('vilao', ${vidaVilao})) AS source (Nome, Vida)
        ON target.Nome = source.Nome
        WHEN MATCHED THEN
          UPDATE SET Vida = source.Vida
        WHEN NOT MATCHED THEN
          INSERT (Nome, Vida) VALUES (source.Nome, source.Vida);`
        )
        res.status(200).send('Vida do herói e vilão foram atualizadas com exito')
    } catch (e) {
        console.error(e)
        res.status(500).send('Erro ao atualiza a vida!')
    }
})

server.get('/characters', async (req, res) => {
    await sql.connect(config)
    const request = new sql.Request();

    const vidaHeroi = await request.query("SELECT * FROM personagens WHERE nome = 'heroi'")
    const heroi = vidaHeroi.recordset[0]

    const vidaVilao = await request.query("SELECT * FROM personagens WHERE nome = 'vilao'")
    const vilao = vidaVilao.recordset[0]

    res.json({ heroi, vilao })
})

server.post('/cadastrar', async (req, res) => {
    const { userEmail, userPassword } = req.body
    try {
        await sql.connect(config);
        const requestSQL = new sql.Request()
        requestSQL.input('userEmail', sql.VarChar, userEmail);
        requestSQL.input('userPassword', sql.VarChar, userPassword);
        const resultSQL = await requestSQL.query(
            `
            insert into usuarios (user_email, user_password)
            values (@userEmail, @userPassword)
            `
        )
        console.log(resultSQL.rowsAffected[0])
        if (resultSQL.rowsAffected[0] > 0) {
            res.status(200).redirect('/login');
        } else {
            res.status(401).send("Informações inválidas");
        }
    } catch (e) {
        console.error(e)
        res.status(500).send("Erro ao realizar o cadastro")
    }
})

server.post('/login', async (req, res) => {
    const { userEmail, userPassword } = req.body
    try {
        await sql.connect(config)
        const request = new sql.Request();
        request.input('userEmail', sql.VarChar, userEmail);
        request.input('userPassword', sql.VarChar, userPassword);
        const result = await request.query(
            `SELECT 1 FROM usuarios WHERE user_email = @userEmail AND user_password = @userPassword`
        );

        if (result.recordset.length > 0) {
            res.status(200).redirect('/jogo');
        } else {
            res.status(401).send("Credenciais inválidas");
        }
    } catch (e) {
        res.status(500).send("Erro ao realizar o login")
    }

})
server.get('/jogo', (req, res) => {
    const filePath = path.join(__dirname, 'jogo.html');
    res.sendFile(filePath);
});

server.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar o servidor
server.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
}); 