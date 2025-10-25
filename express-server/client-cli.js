"use strict";

const axios = require("axios");
const readline = require("readline");
const http = require('http');


const serverDomainDict = {
	nodejs: "http://localhost:3000",
	django: "http://localhost:8000"
};
const BASE_URL = `${serverDomainDict["django"]}`;

const ERROR_ID_NULL = 'Error: ID is null, it must be number! Write "- elementID" after command selection!';

const COMMAND_DICT = {
	1: "get all elements",
	2: "insert new element",
	3: "update element by PUT",
	4: "update element by PATCH",
	5: "delete element",
	10:"help",
	0: "exit"
};

class CliApp {
  constructor(readlineStream){
	this._readlineStream = readlineStream;
  }
  
_setRequestHeaders = (csrfToken = '') => {
	let headers = {
		'Content-Type': 'application/json',
	};
	
	if (csrfToken) {
		headers = {...headers, 'X-CSRFToken': csrfToken};
	}
	return headers;
};

_http_post = (postData) => {
	// Request options
	const options = {
	  hostname: 'localhost',
	  port: 8000,
	  path: '/elements',
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		//'X-CSRFToken': 'asdf',
		//'Cookie': `csrftoken='asdf'`
	  }
	};

	// Make the request
	const req = http.request(options, (res) => {
	  console.log(`Status: ${res.statusCode}`);
	  res.setEncoding('utf8');
	  res.on('data', (chunk) => {
		console.log(`Response: ${chunk}`);
	  });
	});

	// Handle errors
	req.on('error', (e) => {
	  console.error(`Problem with request: ${e.message}`, e);
	});

	// Write data to request body
	postData = JSON.stringify(postData);
	req.write(postData);
	req.end();
};

_convertNumberToRunnableCommand = (commandString) => {
	const commandNumber = parseInt(commandString);
	
	if (commandNumber >= 0) {
		return COMMAND_DICT[commandNumber] ?? commandString;
	}
	
	return commandString;
};

_receiveTargetIDfromCommand = (commandString) => {
	const [commadn, elementId_str] = commandString.split('-');
	const elementId = parseInt(elementId_str);
	return !Number.isNaN(elementId) ? elementId : null;
};

_getAllElements = () => {
  axios.get(`${BASE_URL}/elements`)
	.then(response => console.log("Elements:", response.data))
	.catch(error => console.error("Error fetching elements:", error.response?.data || error.message));
};

_insertNewElement = () => {
  const randomName = `Element_${Math.floor(Math.random() * 1000)}`;
  const randomDescription = `Random description ${Math.floor(Math.random() * 100)}`;
  const body = { 
	name: randomName, 
	description: randomDescription
  };
  
  axios.post(`${BASE_URL}/elements`, body, {
	  headers: this._setRequestHeaders(), 
	  withCredentials: false //Include cookies in requests, when use authorization headers, or TLS client
	})
    .then(response => console.log("New Element Created:", response.data))
    .catch(error => console.error("Error inserting element:", error.response?.data || error.message));
};

_updateElementByPut = (id) => {
  if (id === null) {
	console.log(ERROR_ID_NULL);
	return;
  }
  
  const body = {
    name: "updated-name",
    description: "updated-description"
  };

  axios.put(`${BASE_URL}/element/${id}`, body, {
    headers: this._setRequestHeaders(),
    withCredentials: false
  })
  .then(response => console.log("Element updated:", response.data))
  .catch(error => console.error("Error updating element:", error.response?.data || error.message));
};

_updateElementByPatch = (id) => {
  if (id === null) {
	console.log(ERROR_ID_NULL);
	return;
  }
  
  const updateData = {
	description: "updated by PATCH"
  };
  axios.patch(`${BASE_URL}/element/${id}`, updateData, {
    headers: this._setRequestHeaders(),
    withCredentials: false
  })
  .then(response => console.log("Element updated:", response.data))
  .catch(error => console.error("Error updating element:", error.response?.data || error.message));
};

_deleteElement = (id) => {
  if (id === null) {
	console.log(ERROR_ID_NULL);
	return;
  }
  
  axios.delete(`${BASE_URL}/element/${id}`, {
    headers: this._setRequestHeaders(),
    withCredentials: false
  })
  .then(() => console.log(`Element with ID ${id} deleted.`))
  .catch(error => console.error(`Error deleting element with ID ${id}:`, error.response?.data || error.message));
};

_showHelp = () => {
  console.log("\nIntro: You can execute the commands by typing the number in the bracket like 1 or with name as 'get all elements'.");
  console.log("\nAvailable Commands:");
  console.log("  (1) get all elements  - Fetch all elements from the server");
  console.log("  (2) insert new element  - Insert a randomly generated new element");
  console.log("  (3) update element by PUT  - give the element ID, example: 3 - [id]");
  console.log("  (4) update element by PATCH  - give the element ID, update 'description' field only, example: 4 - [id]");
  console.log("  (5) delete element  - Delete an element by ID, example: 5 - [id]");
  console.log("  (10) help  - Show this command list");
  console.log("  (0) exit  - Quit the application\n");
};

_processCommand = (command) => {
  const trimmedCommand = command.toLowerCase();
  const commandCase = this._convertNumberToRunnableCommand(trimmedCommand);
  const targetId = this._receiveTargetIDfromCommand(trimmedCommand)
  console.log("comamndCase = ", commandCase);
  switch (commandCase) {
    case "get all elements":
      this._getAllElements();
      break;
    case "insert new element":
      this._insertNewElement();
      break;
	case "update element by PUT":
      this._updateElementByPut(targetId);
      break;
    case "update element by PATCH":
      this._updateElementByPatch(targetId);
      break;
    case "delete element":
      this._deleteElement(targetId);
      break;
    case "help":
      this._showHelp();
      break;
    case "exit":
      console.log("Exiting client app...");
      this._readlineStream.close();
      return;
    default:
      console.log("Invalid command! Type 'help' for available commands.");
  }

  this._promptUser();
};

_promptUser = () => {
  this._readlineStream.question("> ", this._processCommand);
};

checkServerOnline = function() {
  console.log("Server: ", BASE_URL);
  const serverType = BASE_URL === serverDomainDict["django"] ? 'django': "nodejs";
  axios.head(`${BASE_URL}/elements`)
	.then(_ => console.log("Server is online! You will get data from server! Write 'help' keyword to get available commands!"))
	.catch(err => console.log(`%c ${serverType} SERVER IS OFFLINE!, you have to run it at first!`, 'color: red;'))
};

run = () => {
	this._promptUser();
};
	
} // end class

// Main scope:
	const readlineStream = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});

	console.log("Client App Started! Type 'help' for available commands.");
	const app = new CliApp(readlineStream);
	app.checkServerOnline();
	app.run();