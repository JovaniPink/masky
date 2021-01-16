FROM python:3.7.8

ENV FLASK_APP manage.py

COPY manage.py unicorn.py requirements.txt runtime.txt .env ./
COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["gunicorn", "--config", "unicorn.py", "unicorn:app"]
