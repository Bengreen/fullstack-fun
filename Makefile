REGISTRY=dockerreg.k8s:5000

BEFFENAME=beffe
UINAME=ui
BENAME=be

BASE_HREF=/monkey/poo
BASE_PATH=/monkey/cho

${BENAME}-build:
	cd be; docker build -t ${BENAME} .

${BENAME}-shell: ${BENAME}-build
	docker run --rm -it --env BASE_PATH=${BASE_PATH} ${BENAME} /bin/bash

${BENAME}-devshell:
	cd be; docker build -t ${BENAME}-devshell --target BUILD .
	docker run --rm -it --env BASE_PATH=${BASE_PATH} --mount type=bind,source=${CURDIR}/be/be,target=/home/work/be --mount type=bind,source=${CURDIR}/be/tests,target=/home/work/tests --mount type=bind,source=${CURDIR}/be/static,target=/home/work/static -p 8081:8080 ${BENAME}-devshell /bin/bash

${BENAME}-run: ${BENAME}-build
	docker run --rm -it --env BASE_PATH=${BASE_PATH} -p 80:8080 ${BENAME}

${BENAME}-publish: ${BENAME}-build
	docker tag ${BENAME} ${REGISTRY}/${BENAME}
	docker push ${REGISTRY}/${BENAME}



${BEFFENAME}-build:
	cd beffe; docker build -t ${BEFFENAME} .

${BEFFENAME}-shell: ${BEFFENAME}-build
	docker run -it --env BASE_HREF=${BASE_HREF} ${BEFFENAME} /bin/bash

${BEFFENAME}-devshell:
	cd beffe; docker build -t ${BEFFENAME}-devshell --target BUILDENV .
	docker run --rm -it --env BASE_HREF=${BASE_HREF} --mount type=bind,source=${CURDIR}/beffe/package.json,target=/home/node/package.json --mount type=bind,source=${CURDIR}/beffe/src,target=/home/node/src -p 4000:4000 ${BEFFENAME}-devshell /bin/bash


${BEFFENAME}-run: ${BEFFENAME}-build
	docker run --rm -it --env BASE_HREF=${BASE_HREF} -p 80:4000 ${BEFFENAME}

${BEFFENAME}-publish: ${BEFFENAME}-build
	docker tag ${BEFFENAME} ${REGISTRY}/${BEFFENAME}
	docker push ${REGISTRY}/${BEFFENAME}


${UINAME}-build:
	cd ui; docker build -t ${UINAME} .

${UINAME}-shell: ${UINAME}-build
	docker run --rm -it --env BASE_HREF=${BASE_HREF} ${UINAME} /bin/bash

${UINAME}-devshell:
	cd ui; docker build -t ${UINAME}-devshell --target BUILDENV .
	docker run --rm -it --env BASE_HREF=${BASE_HREF} --mount type=bind,source=${CURDIR}/ui/package.json,target=/home/node/package.json --mount type=bind,source=${CURDIR}/ui/src,target=/home/node/src --mount type=bind,source=${CURDIR}/ui/e2e,target=/home/node/e2e -p 3200:3200 ${UINAME}-devshell /bin/bash

${UINAME}-run: ${UINAME}-build
	docker run --rm -it --env BASE_HREF=${BASE_HREF} -p 80:80 ${UINAME}

${UINAME}-publish: ${UINAME}-build
	docker tag ${UINAME} ${REGISTRY}/${UINAME}
	docker push ${REGISTRY}/${UINAME}

install:
	helm upgrade -i ${UINAME} helm/simple

helm-upgrade:
	cd helm; helm upgrade -i mybe be
	cd helm; helm upgrade -i mybeffe beffe
	cd helm; helm upgrade -i myui ui
	cd helm; helm upgrade -i ing ingress

