const express = require('express');
const app = express();
const port = 3000;
let newElementCounter = 0;

app.use(express.json());

let elements = [
  { id: 1, name: "Element 1", description: "First element" },
  { id: 2, name: "Element 2", description: "Second element" }
];

// Get all elements
app.get('/elements', (req, res) => {
  res.json(elements);
});

// Get a unique element by ID
app.get('/elements/:id', (req, res) => {
  const element = elements.find(el => el.id === parseInt(req.params.id));
  if (!element) return res.status(404).send('Element not found');
  res.json(element);
});

// Create a new element
app.post('/elements', (req, res) => {
  const newElement = {
    id: elements.length + 1,
    name: req.body.name || null,
    description: req.body.description || ""
  };
  
  if (!newElement.name) {
	res.status(400).send('Creating request: name prop is missing!');
	return;
  }
  
  try {
	elements.push(newElement);
	newElementCounter++
	console.log(`post request were called at ${newElementCounter} times`);
	res.status(201).json(newElement);
  } catch(err) {
	console.error(err);
	res.status(500).send('Insert new element is falied!');
  }
 
});

// Update an entire element
app.put('/elements/:id', (req, res) => {
  const element = elements.find(el => el.id === parseInt(req.params.id));
  if (!element) return res.status(404).send('Element not found');

  element.name = req.body.name;
  element.description = req.body.description;
  res.json(element);
});

// Partially update an element
// Allows partial updates, so you can update only specific fields instead of replacing the whole object.
app.patch('/elements/:id', (req, res) => {
  const element = elements.find(el => el.id === parseInt(req.params.id));
  if (!element) return res.status(404).send('Element not found');

  if (req.body.name) element.name = req.body.name;
  if (req.body.description) element.description = req.body.description;

  res.json(element);
});

// Delete an element
app.delete('/elements/:id', (req, res) => {
  const elementIndex = elements.findIndex(el => el.id === parseInt(req.params.id));

  if (elementIndex === -1) {
    return res.status(404).send("Element not found");
  }

  elements.splice(elementIndex, 1);
  res.status(200).send("Element deleted successfully");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
