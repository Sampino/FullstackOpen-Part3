/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

console.log(`CONNECTING TO: ${url}`)

mongoose.connect(url)
  .then(result => {
    console.log('Connected to MONGODB')
  })
  .catch(err => {
    console.log(`There is an error with the connection: ${err}`)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 9, //I put 9 because "-" is also counted
    maxLength: 13,
    validate: {
      validator: function (value) {
        return /^(\d{2,3}-\d+)$/.test(value)
      },
      message: 'Invalid phone number format',
    },
    required: true
  }
})

personSchema.set('validateBeforeSave', true)

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)