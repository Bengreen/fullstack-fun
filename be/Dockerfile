FROM python:3 as BUILD

WORKDIR /home/work
COPY setup.py ./

RUN pip install .

COPY app/ app/



FROM BUILD as PUBLISH

EXPOSE 8080

CMD [ "python", "app/myfile.py" ]