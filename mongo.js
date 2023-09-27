/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

if (process.argv.leng < 3) {
  console.log('Give me a password as a argument')
  process.exit(1)
}

mongoose.set('strictQuery', false)
// eslint-disable-next-line no-undef
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

person.save()
  .then(result => {
    /*console.log('Person saved')*/
  })

Person.find({})
  .then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      if (person.name || person.number) {
        console.log(person.name, person.number)
      }
    })
    mongoose.connection.close()
  })