FROM python:3 as BUILDENV

WORKDIR /home/work
COPY setup.py ./
RUN pip install .

COPY entrypoint-dev.sh .

FROM BUILDENV as BUILD
RUN pip install -e .[dev]


FROM BUILDENV as PUBLISH
COPY static/ static/
COPY be/ be/

EXPOSE 8080

CMD [ "python", "-m", "be" ]
