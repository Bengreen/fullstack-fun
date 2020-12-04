REGISTRY=dockerreg.k8s:5000

simple-build:
	cd simple; docker build -t simple .

simple-shell: simple-build
	docker run -it --env BASE_REF=/monkey/poo simple /bin/bash

simple-run: simple-build
	docker run -it --env BASE_REF=/monkey/poo -p 80:80 simple

simple-publish: simple-build
	docker tag simple ${REGISTRY}/simple
	docker push ${REGISTRY}/simple

install:
	helm upgrade -i simple helm/simple
