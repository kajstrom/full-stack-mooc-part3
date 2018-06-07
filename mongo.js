const Person = require("./models/person")

const argv = process.argv

if (argv[2] !== undefined && argv[3] !== undefined)  {
    const name = process.argv[2],
        number = process.argv[3]

    const aPerson = new Person({
        name,
        number
    })

    aPerson
        .save()
        .then(() => {
            console.log(`lisättiin henkilö ${name} numero ${number} luetteloon`)
        })
} else {
    Person
        .find({})
        .then(persons => {
            console.log("puhelinluettelo:")
            persons.forEach(p => console.log(`${p.name} ${p.number}`))
        })
}

