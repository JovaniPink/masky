# __init__.py is a special Python file that allows a directory to become
# a Python package so it can be accessed using the 'import' statement.

from datetime import datetime
import json, os, re, base64
import connexion
from flask_marshmallow import Marshmallow
from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    make_response,
    send_from_directory,
)
from flask_wtf.csrf import CSRFProtect
from werkzeug.utils import secure_filename

# import app.predictor

basedir = os.path.abspath(os.path.dirname(__file__))


# Instantiate Flask extensions
ma = Marshmallow()
csrf = CSRFProtect()


# https://flask.palletsprojects.com/en/0.12.x/patterns/appfactories/
def create_app(extra_config_settings={}):
    """Create a Flask application."""

    # Create the connexion application instance
    app = connexion.FlaskApp(__name__, specification_dir=basedir)

    # Read the openapi.yaml file to configure the endpoints
    app.add_api("openapi.yaml")

    application = app.app

    # Load App Config settings
    # Load common settings from 'app/settings.py' file
    application.config.from_object("app.settings")
    # Load local settings from 'app/local_settings.py'
    application.config.from_object("app.local_settings")
    # Load extra config settings from 'extra_config_settings' param
    application.config.update(extra_config_settings)

    # Setup Flask-Extensions -- do this _after_ app config has been loaded
    # We are doing this because our web application could have different
    # config files depending the server environment and context.

    # Setup Marshmallow
    ma.init_app(application)

    # Setup CSRF
    csrf.init_app(application)

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/about")
    def about():
        return render_template("about.html")

    @app.route("/features")
    def features():
        return render_template("features.html")

    @app.route("/<path:filename>")
    def locations_json(filename):
        return send_from_directory("static", filename)

    @app.route("/photo_capture", methods=["POST"])
    @csrf.exempt
    def process_capture():
        req = request.get_json()
        header, encoded = req["photo_cap"].split(",", 1)
        binary_data = base64.b64decode(encoded)
        image_name = "capture.jpeg"

        with open(
            os.path.join(application.config["IMAGE_UPLOADS"], image_name), "wb"
        ) as f:
            f.write(binary_data)
            # facial recognition operations
            response = {"msg": "success", "size": 20}

        return make_response(jsonify(response=response), 200)

    return application
