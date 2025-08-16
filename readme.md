# Creating REST full apis by genAI

Generating the rest api by the genAI (leo-Llama3.1) and covering them by unit test cases.
Fixing issues, bugs which can come during development. They will be sent to Microsoft Copilot to get hints and solved issues.

## Versions
	- nodejs: 22.16.0
	- ptyhon: 3.9.23
	- django framework: 4.2.23 
		-  step tutorial: https://docs.djangoproject.com/en/5.2/intro/tutorial01/
	- django-cors-headers: 4.5.0
	

## Tasks
	1. add put, path delete request both sides (done)
	2. extend nodejs client with missing methods: put, patch, delete (done)
	3. add unit test cased for django based on prev generated in supertest(done)
	--- 
	update http2 version
	thread working
	update to django and python to the latest version
	create python server with fastapi

## Goal

Working with the genAI how it can assist for the developer to generate basic methods and code snippet with test cases. Therefore the developers can only focuos on the special evetns or the business features.

## Experience using genAI for generating codes
### Disadvantaes, weak points
	- Unwanted code: It adds unwanted import in generated codes
	- Attached some codes: which was collected from somewhere, it doesn't know until when you send errors that part of code make.
	- Refering issues: It refers some object or method which are not existed, it suppose you will have.
	- Code transforming: Not effective, re-writing codes to another one, e.g: javascript to python, vice-versa.
	
### Great working
	- Hints: stronger, give good advices what will be the focus point, left notes.
	- Explaining: The introduction and code explain are well enough.
	- Continue code snippet: If it has good promtp with well programmed pattern in code, It is able to carry on.
	- Error, bug finding: It great with suggestion, but not well complex issues, developer has to make chunks from the errors. Copy-paste not work for complex issues.
	- Recognise the code patters, it can carry on with staightforward intorductions
	- It remembers previous code prompt, not alway need to copy-paste it.

## CLI apps
Generating CLI app that will communcite to the server by sending rest (GET, POST, PUT, DELETE) requests.
Two sort of CLI apps which are written:
	1. by nodejs
	2. by python (not created by genAI)

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
		1. Look at your python env: `conda list env`
		2. select "crud-py39" env: `conda activate crud-py39`, 
			- if you don't have create new environment with python 3.9 version
		3. Check you are in current env by python version `python --version`
		4. command: `python manage.py runserver`

## Run CLI clients
	- In nodejs: you can find running script in express-server/package.json
		- run: `node ./path/client-cli.js,`
		
	- In python: (not yet done)
	
## Run Unit tests
	- In nodejs: the script in the express-server/package.json
		- run: `npm run test` or `npm run test-verbose`
		
	- In python-django
		- optional: select current env by conda where django is.
		- run: `ptyhon manage.py test`
	