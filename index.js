const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

let people = [{ name: 'Arto Hellas', number: '040-123456', id: 1 },
            { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
            { name: 'Dan Abramov', number: '12-43-234345', id: 3},
            { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }]

app.get("/api/persons", (req, res) => {
    res.json(people)    
})

app.get("/info", (req, res) => {
    const current = new Date()
    res.send(`<p>Phonebook has info for ${people.length} people</p><p>${current.toUTCString() + current.getTimezoneOffset()}</p>`)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = people.find(p => p.id === id)
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).json({
            error: "Invalid ID. Please try again"
        })
    }
})

const generateID = (min, max) => {
    return Math.floor(Math.random()*(max - min) + min)
}

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    people = people.filter(p => p.id !== id)
    res.status(204).end()
})


app.post("/api/persons", (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(404).json({
            error: "Name and number have to be provided"
        })
    }
    else{
        const names = new Set(people.map(p => p.name))
        if (names.has(body.name)) {
            res.status(404).json({
                error: "Name must be unique"
            })
        }
        else {
            const person = {
                name: body.name,
                number: body.number,
                id: generateID(10, 1000)
            }
            people = people.concat(person)
            res.json(person)
        }
    }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})