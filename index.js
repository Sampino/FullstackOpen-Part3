require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
const PORT = process.env.PORT || 3001
var morgan = require('morgan')

const requestLogger = (req, res, next) => {
	console.log('Method:', req.method)
	console.log('Path:  ', req.path)
	console.log('Body:  ', req.body)
	console.log('---')
	next()
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

morgan.token('req-body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

app.get('/', (req, res) => {
	res.send('<h1>Hello</h1>')
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(people => {
		res.json(people)
	})
})

app.get('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	Person.findById(id)
		.then(person => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch(err => next(err))

})

/*app.get('/info', (req, res) => {
	const requestTime = new Date()
	res.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${requestTime}</p>`)
})*/

app.delete('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	Person.findByIdAndRemove(id)
		.then(person => {
			if (person) {
				res.json(person)
				console.log(person)
			} else {
				res.status(404).send({ error: '404 NOT FOUND' })
			}
		})
		.catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	const { name, number } = req.body

	if (name === undefined || number === null) {
		return res.status(404).send({
			error: 'missing content'
		})
	}

	const newPerson = {
		name: name,
		number: number
	}

	Person.findByIdAndUpdate(
		id,
		newPerson,
		{ new: true, runValidators: true, context: 'query' })
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body
	if (body.name === undefined || body.number === undefined) {
		return res.status(400).json({
			error: 'missing content'
		})
	}

	const newPerson = new Person({
		name: body.name,
		number: body.number
	})

	newPerson.save()
		.then(personSaved => {
			res.json(personSaved)
		})
		.catch(err => {
			next(err)
		})

})

const unknownEndpoint = (req, res) => {
	res.status(404).send({
		error: 'unknown endpoint'
	})
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
	console.error(err.message)

	if (err.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message })
	}

	next(err)
}

app.use(errorHandler)

app.listen(PORT)
console.log(`Server running on port ${PORT}`)
