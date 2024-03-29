const express = require('express');
const server = express();

server.use(express.json());

//Query params = ?nome=NodeJS
//Route params = /curso/2
//Request body =  { nome: 'Node.js', tipo: 'backend'}

const cursos = ['NodeJs', 'React native', 'Java','Python']

//Middleware global
server.use((req, res, next) => {
    console.log(`Url chamada: ${req.url}`);
    return next();
})

function checkCurso(req, res, next){
    if(!req.body.name){
        return res.status(400).json({error:'O campo nome é obrigatório'});
    }
    return next();
}

function checkIndexCurso(req, res, next){
    const curso = cursos[req.params.index]
    if(!curso){
        return res.status(400).json({error:'Curso não encontrato'});
    }

    req.curso = curso;

    return next();
}

server.get('/cursos', (req, res) => {
    return res.json(cursos);
});

server.get('/cursos/:index', checkIndexCurso, (req, res) => {    
    return res.json(req.curso)
});

server.post('/cursos', checkCurso, (req, res) => {
    const { name } = req.body;
    cursos.push(name);

    return res.json(cursos);
}),

server.put('/cursos/:index', checkCurso, checkIndexCurso, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;
    cursos[index] = name;
    return res.json(cursos);
})

server.delete('/cursos/:index', checkIndexCurso, (req, res) => {
    const { index } = req.params;
    cursos.splice(index, 1);
    return res.send();
})

server.listen(3000);