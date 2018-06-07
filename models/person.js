const mongoose = require("mongoose")
const Schema = mongoose.Schema

if (process.env.MONGO_URI === undefined) {
    require("dotenv").config()
}

const url = process.env.MONGO_URI

mongoose.connect(url)

const personSchema = new Schema({
    name: {type: String, unique: true},
    number: String
})

personSchema.statics.format = function (p) {
    return {
        id: p._id,
        name: p.name,
        number: p.number
    }
}

const Person = mongoose.model("Person", personSchema)

module.exports = Person