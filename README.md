# Masky (2020 team project)

Masky is a deployment-oriented snapshot of a 2020 team project that explored
public-health information and an experimental face-mask detection interface.
It is preserved as a historical portfolio artifact, not as a current medical
product or a production-ready service.

The canonical team repository is
[`FranciscoSerrano/Final-Project`](https://github.com/FranciscoSerrano/Final-Project).
Jovani Pink contributed to that four-person project; this repository contains
the Flask and container packaging used for a separate deployment experiment.

## Current status

- The Flask pages and API smoke routes run on Python 3.14.
- The checked-in model artifact is retained for historical context, but model
  loading and inference are disabled in the current application code.
- The image-capture route is an unauthenticated prototype that writes a single
  local file. Do not expose it to untrusted traffic without redesigning its
  authentication, validation, storage, retention, and privacy controls.
- [`masky.app`](https://www.masky.app/) currently serves a separate coming-soon
  property. It is not built or deployed from this repository.

CI verifies application smoke tests, the Gunicorn entry point, and a container
build. Those checks do not establish model accuracy, fairness, medical
effectiveness, privacy compliance, or production readiness.

## Run locally

Python 3.14 is the tested runtime.

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python manage.py
```

Then open <http://127.0.0.1:5000/>.

Run the maintained checks with:

```bash
python -m unittest discover -s tests -v
gunicorn --check-config gunicorn_config:app
docker build --tag masky:local .
```

## Repository map

- `app/__init__.py` creates the Flask application and registers routes.
- `app/templates/` and `app/static/` contain the historical interface and
  browser assets.
- `app/model/` retains the experimental model and OpenCV cascade artifacts.
- `tests/` contains the current smoke-test contract.
- `Dockerfile` and `gunicorn_config.py` define the reproducible service entry
  point used by CI.

See [`app/README.md`](app/README.md) for the application-package boundary.

## Attribution and license

The original project has multiple contributors. Preserve the canonical team
repository link and its history when discussing or reusing this work. This
snapshot includes an [MIT license](LICENSE) for Jovani Pink's contributions;
review the original repository's licensing and attribution before redistributing
the broader team project.
