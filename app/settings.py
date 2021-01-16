# Settings common to all environments (development|staging|production)
# Place environment specific settings in env_settings.py
# An example file (env_settings_example.py) can be used as a starting point
# https://flask.palletsprojects.com/en/1.1.x/config/

import os

basedir = os.path.abspath(os.path.dirname(__file__))

# Application settings
APP_NAME = "MASKYAPI"
APP_SYSTEM_ERROR_SUBJECT_LINE = APP_NAME + " system error"

# Flask settings
CSRF_ENABLED = True

# Image upload settings
# This matches our frontend 'validTypes'
ALLOWED_IMAGE_EXTENSIONS = {"x-icon", "gif", "png", "jpg", "jpeg"}
MAX_IMAGE_FILESIZE = 16 * 1024 * 1024
IMAGE_UPLOADS = f"{basedir}/static/img/captures"

# Celery
CELERY_BROKER_URL = "mongodb://localhost:27017/masky"
CELERY_RESULT_BACKEND = "mongodb://localhost:27017/masky"
