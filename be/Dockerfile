FROM python:3 as BUILDENV

WORKDIR /home/work
COPY setup.py ./

RUN pip install .

FROM BUILDENV as BUILD
RUN pip install -e .[dev]


FROM BUILDENV as PUBLISH
COPY app/ app/

EXPOSE 8080

CMD [ "python", "app/myfile.py" ]
