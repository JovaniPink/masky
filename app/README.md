# Application package

This directory contains the Flask application for the historical Masky
prototype.

## Structure

- `__init__.py` creates the application, initializes Marshmallow and CSRF
  protection, registers page routes, and retains the legacy image-capture route.
- `templates/` and `static/` contain the server-rendered interface and browser
  assets.
- `model/` contains the historical model and OpenCV cascade artifacts.
- `predictor.py` preserves the original inference sketch as commented reference
  code; the running application does not load or execute the model.
- `settings.py` and `local_settings.py` contain the prototype configuration.

The files under `api/` are historical stubs rather than registered application
routes. There is no Celery worker or active model-serving pipeline in this
snapshot.

## Safety boundary

The `/photo_capture` endpoint accepts base64 image data and overwrites a local
capture file. It has no authentication, durable storage contract, retention
policy, or production privacy controls. Treat it as local prototype code and do
not expose it to untrusted traffic without a security and data-governance
redesign.
