# MASKY

> OpenAPI Flask app that serves data to masky model for predictions.

## Features

Its not just Flask but an ecosystem to properly create a RESTful API service:

- [Celery](https://docs.celeryproject.org/en/latest/index.html) is a simple, flexible, and reliable distributed system to process vast amounts of messages, while providing operations with the tools required to maintain such a system. It’s a task queue with focus on real-time processing, while also supporting task scheduling.
- [Connexion](https://connexion.readthedocs.io/en/latest/index.html) is a framework on top of Flask that automagically handles HTTP requests defined using OpenAPI (formerly known as Swagger), supporting both v2.0 and v3.0 of the specification.
- [Flask](https://flask.palletsprojects.com/en/1.1.x/) is a lightweight WSGI web application framework in Python. It is designed to make getting started very quickly and very easily.
- [marshmallow](https://marshmallow.readthedocs.io/en/stable/) is an ORM/ODM/framework-agnostic library for converting complex datatypes, such as objects, to and from native Python datatypes.
- [Flask-Marshmallow](https://flask-marshmallow.readthedocs.io/en/latest/) is a thin integration layer for Flask and marshmallow that adds additional features to marshmallow.
- [PyMongo](https://pymongo.readthedocs.io/en/stable/index.html) is a Python distribution containing tools for working with MongoDB, and is the recommended way to work with MongoDB from Python.
- [Flask-PyMongo](https://flask-pymongo.readthedocs.io/en/latest/)
- [Flask-Script](https://flask-script.readthedocs.io/)

### Code characteristics

- Tested on Python 3.7.9 and greater
- Well organized directories with lots of comments in READMEs.
  - app
    - api
    - celery
    - mask-model
    - static
    - templates

## Installation & Usage

### Get the code

    git clone
    cd masky

### Install requirements

    pip install -r requirements.txt

### Run Side Running services

```powershell
PS ~/masky/> mongod
```

```powershell
PS ~/masky/> celery -A app.celery worker --pool=solo -l info
```

### Running the app in Development

- Use "python manage.py" for a list of available commands.
- Use "python manage.py runserver" to start the development web server on localhost:5000.
- Use "python manage.py runserver --help" for additional runserver options.

#### Running the app (production)

To run the application in production mode, gunicorn3 is used (and included in requirements.txt)

    # Run the application in production mode
    ./runserver.sh

#### Running the automated tests

    # Start the Flask development web server
    py.test tests/

## Example

### Data Routes

.route('/') # index html file
etc
Application Errors https://flask.palletsprojects.com/en/1.1.x/errorhandling/

### Model Routes

.route('/api/predict/', methods=['POST']) # Takes in JSON, and returns a result in JSON.

## Data Powering the Web app

## Todo Checklist

A helpful checklist to gauge how your README is coming on what I would like to finish:

- [ ] Lots of items! :)
- [ ] Need to add Celery

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
