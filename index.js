const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

app.use(bodyParser.json())
morgan.token("bodyJson", function (req) {return JSON.stringify(req.body)})
app.use(morgan(":method :url :bodyJson :status :res[content-length] - :response-time ms"))
app.use(express.static("build"))
app.use(cors())

app.get("/persons", (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(Person.format))
        })
        .catch(error => {
            console.log(error)
        })
})

app.get("/persons/:id", (request, response) => {
    const id = request.params.id

    Person.findById(id)
        .then(p => response.json(Person.format(p)))
        .catch(e => console.log(e))
})

app.post("/persons", (request, response) => {
    const {name, number} = request.body

    if (name === undefined) {
        return response.status(400).json({error: "name is missing"})
    }

    if (number === undefined) {
        return response.status(400).json({error: "number is missing"})
    }

    const aPerson = new Person({
        name,
        number,
    })

    aPerson
        .save()
        .then(person => {
            response.status(201).json(Person.format(person))
        })
        .catch(error => {
            console.log(error)

            if (error.code === 11000) {
                response.status(409).json({error_message: `Cannot add duplicate person: ${name}`})
            } else {
                response.status(500).end()
            }
        })
})

app.delete("/persons/:id", (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            console.log(error)
            response.status(400).end()
        })
})

app.put("/persons/:id", (request, response) => {
    const id = request.params.id
    const {name, number} = request.body

    Person
        .findByIdAndUpdate(id, {name, number}, {new: true})
        .then(p => response.json(Person.format(p)))
        .catch(error => console.log(error))
})

app.get("/info", (request, response) => {
    Person
        .count()
        .then(c => {
            response.send(`<html>
                <body>
                    <p>puhelinluettelossa on ${c} henkilön tiedot</p>
                    <p>${new Date()}</p>
                </body>
                </html>`)
        })
        .catch(e => console.log(e))

    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})