

## API de Gestão Escolar

Projeto da Parte 01 

A ideia da atividade era criar uma API bem simples pra cadastrar e listar alunos de uma escola, usando:

`Node.js, Express e MongoDB`

## O que a aplicação faz
Cadastra um aluno (nome, idade, email, curso e turma) e lista todos os alunos cadastrados.

Salva tudo no MongoDB: 
banco: gestao_escolar,
coleção: alunos


## Tecnologias usadas
Node.js
Express
MongoDB driver
dotenv 
Thunder Client 
MongoDB Compass


## Como rodar o projeto

---- Instalar as dependências: ----

`npm install`

Criar um arquivo .env na raiz do projeto com:
MONGODB_URI=mongodb://localhost:27017
DB_NAME=gestao_escolar
PORT=3000
Ter o MongoDB rodando na máquina

---- Rodar a aplicação: -----

`npm start `

Se der tudo certo, aparece no terminal:

MongoDB conectado ao banco: gestao_escolar
Servidor rodando em http://localhost:3000

## Rotas
POST /alunos

Cadastra um aluno novo. Exemplo abaixo

json
{
  "nome": "Pedro Henrique",
  "idade": 19,
  "email": "pedro.henrique@email.com",
  "curso": "Informática",
  "turma": "3INFO"
}

nome, idade, email e curso são obrigatórios.

Além desses comandos, a API adiciona sozinha:
situacao: "ativo"
dataMatricula (data e hora do cadastro)


## GET /alunos
Retorna a lista de todos os alunos cadastrados, em JSON.


## GET /alunos/:id
Busca um único aluno pelo _id do MongoDB.

Se o id não for um ObjectId válido, retorna 400 avisando que o identificador é inválido.
 Se o id for válido mas não existir aluno com esse _id, retorna 404 avisando que o aluno não foi encontrado.
Se encontrar, retorna o aluno em JSON.


## PUT /alunos/:id
Atualiza os dados de um aluno específico usando updateOne() com $set.

Precisa mandar todos os campos no corpo da requisição, exemplo:

json
{
  "nome": "Pedro",
  "idade": 20,
  "email": "pedrohenrique@email.com",
  "curso": "Informática",
  "turma": "1INFO",
  "telefone": "0000-00000"
}


ID inválido 
Aluno não encontrado 
Atualizado com sucesso 

## DELETE /alunos/:id
Exclui um aluno pelo _id usando deleteOne().

ID inválido 
Aluno não encontrado 
Excluído com sucesso 

## Evolução 
Adicionei o campo telefone. Ele pode ser cadastrado no POST /alunos e também atualizado depois pelo PUT /alunos/:id.


## Como eu testei

Usei o Thunder Client pra fazer os testes:

Cadastrei 6 alunos diferentes com POST /alunos

Listei todos com GET /alunos e confirmei que os 6 apareceram

Abri o MongoDB Compass, entrei no banco gestao_escolar, 
coleção alunos, e confirmei que os dados foram salvos.

Copiei o _id de um aluno e busquei ele sozinho com GET /alunos/:id

Atualizei os dados desse aluno com PUT /alunos/:id e confirmei a mudança no GET /alunos/:id e no MongoDB Compass

Excluí o aluno com DELETE /alunos/:id e confirmei que sumiu no GET /alunos e no MongoDB Compass

Abri o MongoDB Compass, entrei no banco gestao_escolar, coleção alunos, e confirmei que os dados foram salvos, atualizados e removidos corretamente.


`Os prints desses testes estão na pasta 'Print' `