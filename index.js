const express = require('express') // Importar o express para o projeto
const port = 3000 // Criação da porta para acesso ao projeto
const app = express() // Para facilitar, coloquei o express dentro da variável app
app.use(express.json())
const uuid = require('uuid')

/* Query Params => meusite.com/users?nome=felipe&age=20

 app.get('/users', (request, response) => {
    const {name, age, city} = request.query  Nos parâmetros da URL, tenho 2 propriedades com nome de "age e name".
     Posso guardar essas propriedades dentro das variáveis de MESMO nome dessa forma, como se fosse um objeto.
     E o valor que essa variável irá guardar será o query inteiro, com todos os parâmetros.
     Então eu tenho que colocar o nome da variável igualzinho ao nome da propriedade, caso contrário o programa não vai achar o valor.     

    return response.json({ name, age, city })  Aqui está sendo retornado para o front-end os dados em formato JSON, que é basicamente um Objeto. 
    Ao colocar o .json, o que virá dentro dos () tem que ser um objeto ou array, que é o que o JSON aceita.
    E colocamos dentro desse objeto os nomes dos parâmetros que foram usados na URL. 
    Dessa forma economizamos muito código.
}) */


/* Request Body
app.get('/users', (request, response) => {
    console.log(request.body)

    return response.json({ message: "ok"})
}) */

const users = [] // Lista com os usuários a serem cadastrados

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ message: 'User not found' })
    }

    request.userIndex = index
    request.userId = id

    next()
} // Esse é o middleware

app.get('/users', (request, response) => {
    return response.json(users)
}) // Requisição do tipo GET

app.post('/users', (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(users)
}) // Requisição do tipo post  (criar usuários)

app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updatedUser = { id, name, age }

    users[index] = updatedUser

    return response.json(updatedUser)
}) // Requisição do tipo put para atualizar dados 

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
}) // Requisição do tipo delete para deletar dados


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
}) // Avisa qual é a porta que a aplicação está rodando

