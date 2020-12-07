REGISTRY=dockerreg.k8s:5000

BEFFENAME=beffe
UINAME=ui
BENAME=be

BASE_HREF=/monkey/poo

${BENAME}-build:
	cd be; docker build -t ${BENAME} .

${BENAME}-shell: ${BENAME}-build
	docker run -it --env BASE_HREF=${BASE_HREF} ${BENAME} /bin/bash


${BEFFENAME}-build:
	cd beffe; docker build -t ${BEFFENAME} .

${BEFFENAME}-shell: ${BEFFENAME}-build
	docker run -it --env BASE_HREF=${BASE_HREF} ${BEFFENAME} /bin/bash

${BEFFENAME}-devshell:
	cd beffe; docker build -t ${BEFFENAME}-devshell --target BUILD .
	docker run -it --env BASE_HREF=${BASE_HREF} ${BEFFENAME}-devshell /bin/bash


${BEFFENAME}-run: ${BEFFENAME}-build
	docker run -it --env BASE_HREF=${BASE_HREF} -p 80:4000 ${BEFFENAME}

${BEFFENAME}-publish: ${BEFFENAME}-build
	docker tag ${BEFFENAME} ${REGISTRY}/${BEFFENAME}
	docker push ${REGISTRY}/${BEFFENAME}


${UINAME}-build:
	cd ui; docker build -t ${UINAME} .

${UINAME}-shell: ${UINAME}-build
	docker run -it --env BASE_HREF=${BASE_HREF} ${UINAME} /bin/bash

${UINAME}-devshell:
	cd ui; docker build -t ${UINAME}-devshell --target BUILD .
	docker run -it --env BASE_HREF=${BASE_HREF} ${UINAME}-devshell /bin/bash

${UINAME}-run: ${UINAME}-build
	docker run -it --env BASE_HREF=${BASE_HREF} -p 80:80 ${UINAME}

${UINAME}-publish: ${UINAME}-build
	docker tag ${UINAME} ${REGISTRY}/${UINAME}
	docker push ${REGISTRY}/${UINAME}

install:
	helm upgrade -i ${UINAME} helm/simple
