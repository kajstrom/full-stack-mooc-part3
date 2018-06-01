const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")

app.use(bodyParser.json())

morgan.token("bodyJson", function (req, res) {return JSON.stringify(req.body)})

app.use(morgan(':method :url :bodyJson :status :res[content-length] - :response-time ms'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    }
]

app.get("/persons", (request, response) => {
    response.json(persons)
})

app.get("/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person)  {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generateRandomId = () => {
    return Math.floor(Math.random() * 10000)
}

app.post("/persons", (request, response) => {
    const id = generateRandomId()
    const {name, number} = request.body

    if (name === undefined) {
        return response.status(400).json({error: "name is missing"})
    }

    if (number === undefined) {
        return response.status(400).json({error: "number is missing"})
    }

    if (undefined !== persons.find(p => p.name === name)) {
        return response.status(400).json({error: `person with name ${name} already exists!`})
    }


    persons = persons.concat({
        name,
        number,
        id
    })

    response.status(201).end()
})

app.delete("/persons/:id", (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.get("/info", (request, response) => {
    response.send(`<html>
    <body>
        <p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
        <p>${new Date()}</p>
    </body>
    </html>`)
})

app.listen(3001, () => {
    console.log("Server running on port 3001")
})