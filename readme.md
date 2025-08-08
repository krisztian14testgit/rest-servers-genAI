# Creating REST full apis by genAI

Generating the rest api by genAI (leo-Llama3.1) and covering them by unit test cases.
Fixing issues, bugs which can come during development. They will be sent to Microsoft Copilot to get hints.


## Goal

Working with  genAI how it can assist for the developer to generate basic methods and code snippet with test cases. Therefore the developers can only focuos on the special evetns or the business features.

## CLI apps
Generating CLI app that will communcite to the server by sending rest (GET, POST, PUT, DELETE) requests.
Two sort of CLI apps which are written:
	1. by nodejs
	2. by python

## Performance calculation tasks
	- nodeJS: heavy calculation jobs by web-worker, clusters
	- python: 
		- multi threading, processing (CPU-bound taks)
		- speed with numberical task e.g.: numPy
	- webassembly, perhap it will be tested

# Run servers
	- In nodejs: 
		1. run: npm install
		2. you can find running script in express-server/package.json
		3. npm command: `npm run server`
	
	- In python:
		- django first step tutorial: https://docs.djangoproject.com/en/5.2/intro/tutorial01/
		- you can find running script in django-server/package.json
		1. Look at your python env: `conda list env`
		2. select "crud-py39" env: `conda activate crud-py39`
		3. Check you are in current env by python version `python --version`
		4. command: `python manage.py runserver`

## Run CLI clients
	- In nodejs: you can find running script in express-server/package.json
		- run: `node ./path/client-cli.js,`
		
	- In python: ??? (not done yet)
	