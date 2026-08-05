FROM python:3.14.7

ENV FLASK_APP=manage.py \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY manage.py gunicorn_config.py requirements.txt runtime.txt ./
COPY . /app
WORKDIR /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "gunicorn_config:app"]
