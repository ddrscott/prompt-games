run-brains:
	docker run -it --rm -d   \
		--name brains          \
		-u $(id -u):$(id -g)   \
		-v ${PWD}:/www         \
		ddrscott/brains ping 1.1.1.1
