const axios = require("axios");
const readline = require("readline");
const http = require('http');


const serverDomainDict = {
	nodejs: "http://localhost:3000",
	django: "http://localhost:8000"
};
const BASE_URL = `${serverDomainDict["django"]}`;

const COMMAND_DICT = {
	1: "get all elements",
	2: "insert new element",
	3: "help",
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

_getAllElements = () => {
  axios.get(`${BASE_URL}/elements`)
	.then(response => console.log("Elements:", response))
	.catch(error => console.error("Error fetching elements:", error.response?.data || error.message));
};

_insertNewElement = () => {
  const randomName = `Element_${Math.floor(Math.random() * 1000)}`;
  const randomDescription = `Random description ${Math.floor(Math.random() * 100)}`;
  const body = { 
	name: randomName, 
	description: randomDescription
  };
  
  //this._http_post(body);
  
  axios.post(`${BASE_URL}/elements`, body, {
	  headers: this._setRequestHeaders(), 
	  withCredentials: false //Include cookies in requests, when use authorization headers, or TLS client
	})
    .then(response => console.log("New Element Created:", response.data))
    .catch(error => console.error("Error inserting element:", error.response || error.message));
	
};

_showHelp = () => {
  console.log("\nAvailable Commands:");
  console.log("  (1) get all elements  - Fetch all elements from the server");
  console.log("  (2) insert new element  - Insert a randomly generated new element");
  console.log("  (3) help  - Show this command list");
  console.log("  (0) exit  - Quit the application\n");
};

_convertNumberToRunnableCommand = (commandString) => {
	const commandNumber = parseInt(commandString);
	
	if (commandNumber >= 0) {
		return COMMAND_DICT[commandNumber] ?? commandString;
	}
	
	return commandString;
};

_processCommand = (command) => {
  const commandCase = this._convertNumberToRunnableCommand(command.toLowerCase());
  console.log("comamndCase = ", commandCase);
  switch (commandCase) {
    case "get all elements":
      this._getAllElements();
      break;
    case "insert new element":
      this._insertNewElement();
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
  axios.head(`${BASE_URL}/elements`)
	.then(_ => console.log("Server is online! You will get data from server!"))
	.catch(err => console.log('%c SERVER IS OFFLINE!, you have to run it at first!', 'color: red;'))
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