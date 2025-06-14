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

const PORT = 3001

app.listen(PORT,()=>{
  console.log(`server running on port ${PORT}`)
})






























































































































// const express = require('express');
// const app = express();

// app.use(express.json());

// let profiles = [
//   { fname: 'franklin', lname: 'njoroge', age: 18, id: 1 },
//   { fname: 'franklin', lname: 'kavita', age: 27, id: 2 },
//   { fname: 'franklin', lname: 'njeri', age: 47, id: 3 }
// ];

// // Generate a new unique string ID
// const generateId = () => {
//   const maxId = profiles.length > 0
//     ? Math.max(...profiles.map(p => Number(p.id)))
//     : 0;
//   return maxId + 1;
// };

// // Root route
// app.get('/', (req, res) => {
//   res.send('<h1>Hello World</h1>');
// });

// // Get all profiles
// app.get('/api/profiles', (req, res) => {
//   res.json(profiles);
// });

// // Get a single profile by ID
// app.get('/api/profiles/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const profile = profiles.find(p => p.id === id);

//   if (profile) {
//     res.json(profile);
//   } else {
//     res.status(404).json({ error: 'Profile not found' });
//   }
// });

// // Add a new profile
// app.post('/api/profiles', (req, res) => {
//   const body = req.body;

//   // Validate required fields
//   if (!body.fname) {
//     return res.status(400).json({ error: 'First name is required' });
//   }

//   const profile = {
//     fname: body.fname,
//     lname: body.lname || '',
//     age: body.age || null,
//     id: generateId()
//   };

//   profiles = profiles.concat(profile);
//   console.log('Added profile:', profile);
//   res.status(201).json(profile);
// });

// // Delete a profile by ID
// app.delete('/api/profiles/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const initialLength = profiles.length;

//   profiles = profiles.filter(profile => profile.id !== id);

//   if (profiles.length < initialLength) {
//     res.status(204).end(); // Successfully deleted
//   } else {
//     res.status(404).json({ error: 'Profile not found' });
//   }
// });

// // Start server
// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
