# https://flask.palletsprojects.com/en/1.1.x/config/

import os

# *****************************
# Environment specific settings
# *****************************

# DO NOT use "DEBUG = True" in production environments
DEBUG = False

# DO NOT use Unsecured Secrets in production environments
# Generate a safe one with:
#     python -c "from __future__ import print_function; import string; import random; print(''.join([random.choice(string.ascii_letters + string.digits + string.punctuation) for x in range(24)]));"
SECRET_KEY = "This is an UNSECURED Secret. CHANGE THIS for production environments."

# MongoDB
# update with every project
DB_NAME = "masky"
MONGODB_URL = "mongodb://localhost:27017/"

# mongodb connection string
# flask_pymongo to set up mongo connection
MONGO_URI = f"{MONGODB_URL}{DB_NAME}"

# Celery
CELERY_BROKER_URL = "mongodb://localhost:27017/masky"
CELERY_RESULT_BACKEND = "mongodb://localhost:27017/masky"
