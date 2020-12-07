FROM python:3 as BUILD

WORKDIR /home/work
COPY setup.py ./

RUN pip install .

COPY app/ app/


EXPOSE 8080
