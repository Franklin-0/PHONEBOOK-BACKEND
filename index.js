const express = require('express')
const app = express();
app.use(express.json());
const morgan = require('morgan')
app.use(morgan('tiny')) 
morgan.token('post-data', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

const persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/', (req, res) => {
  res.send('Phonebook API is running. Use /api/persons to see data.');
});

app.get('/info', (req, res) => {
  const numberOfPersons = persons.length;
  const currentTime = new Date();

  res.send(`
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentTime}</p>
  `);
});

app.get('/api/persons/:id',(req, res)=>{
  const userid = req.params.id
  const person = persons.find(person=>
    person.id === userid
  );
  if (person){
    res.json(person)
  }
  else{
    res.status(404).end();  }
})

app.delete('/api/persons/:id', (req, res) => {
  const userid = req.params.id;
  const index = persons.findIndex(person => person.id == userid);

  if (index !== -1) {
    persons.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});





app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }

  const nameExists = persons.find(person => person.name === body.name);
  if (nameExists) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  const generateId = () => Math.floor(Math.random() * 1_000_000).toString();

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  };

  persons.push(newPerson);

  res.status(201).json(newPerson);

});



app.get('/api/persons', (req, res)=>{
  res.json(persons)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

