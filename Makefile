REGISTRY=dockerreg.k8s:5000

UINAME=ui

${UINAME}-build:
	cd ui; docker build -t ${UINAME} .

${UINAME}-shell: ${UINAME}-build
	docker run -it --env BASE_REF=/monkey/poo ${UINAME} /bin/bash

${UINAME}-run: ${UINAME}-build
	docker run -it --env BASE_REF=/monkey/poo -p 80:80 ${UINAME}

${UINAME}-publish: ${UINAME}-build
	docker tag ${UINAME} ${REGISTRY}/${UINAME}
	docker push ${REGISTRY}/${UINAME}

install:
	helm upgrade -i ${UINAME} helm/simple
