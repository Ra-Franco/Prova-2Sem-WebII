const express = require('express');
const path = require('path')
const sql = require("mssql")

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

server.use(express.json())

server.use(express.static(path.join(__dirname)))

server.post('/atualizarVida', async (req, res) => {
    const { vidaHeroi, vidaVilao } = req.body
    console.log()
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


// Rota para servir o arquivo HTML principal
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// Iniciar o servidor
server.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});