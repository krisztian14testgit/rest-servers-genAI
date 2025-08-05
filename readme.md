# Creating CRUD-request with client CLI

Generating the CRUD api request by genAI (leo-Llama3.2) and covering them by unit tests.
Searching and fixing issues by Microsoft Copilot


## Goal

Working with  genAI how it can help for the developer to generate basic CRUD methods with test cases.
Furthermore: Generating CLI app that will communcite to the server by sending ( GET, POST, PUT, DELETE) requests.

## Performance calculation tasks
	- nodeJS: heavy calculation jobs by web-worker, clusters
	- python: 
		- multi threading, processing (CPU-bound taks)
		- speed with numberical task e.g.: numPy
	- webassembly??

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
	