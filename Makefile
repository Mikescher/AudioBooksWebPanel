DOCKER_REPO := registry.blackforestbytes.com
DOCKER_NAME := mikescher/audiobookswebpanel

RAW_NAMESPACE := $(shell git rev-parse --abbrev-ref HEAD)
NAMESPACE := $(subst /,__,$(RAW_NAMESPACE))
HASH=$(shell git rev-parse HEAD)

.PHONY: docker docker-push

# --pull: the base image is a floating tag, a locally cached copy would keep an old PHP version.
docker:
	docker build --pull \
		--build-arg "COMMIT_ID=$(HASH)" \
		-t "$(DOCKER_NAME):$(HASH)" \
		-t "$(DOCKER_NAME):$(NAMESPACE)-latest" \
		-t "$(DOCKER_NAME):latest" \
		-t "$(DOCKER_REPO)/$(DOCKER_NAME):$(HASH)" \
		-t "$(DOCKER_REPO)/$(DOCKER_NAME):$(NAMESPACE)-latest" \
		-t "$(DOCKER_REPO)/$(DOCKER_NAME):latest" \
		.

docker-push:
	docker image push "$(DOCKER_REPO)/$(DOCKER_NAME):$(HASH)"
	docker image push "$(DOCKER_REPO)/$(DOCKER_NAME):$(NAMESPACE)-latest"
	docker image push "$(DOCKER_REPO)/$(DOCKER_NAME):latest"
