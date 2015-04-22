# docker-logio

Forward all your logs to [Log-Io](http://logio.org/)
and see it to http://localhost:28778

## Usage as a Container

### Docker Compose

```
cat >docker-compose.yml <<EOF
logs:
  image: gerchardon/docker-logio
  links:
   - logio:logio
  volumes:
   - /var/run/docker.sock:/var/run/docker.sock
  command: -h logio -n docker
logio:
  image: temal/logio-server
  ports:
   - 28777:28777
   - 28778:28778
EOF
docker-compose up
```

### Manualy

```
docker run -d --name logio -p 28777:28777 -p 28778:28778 temal/logio-server
docker run -d --link logio:logio -v /var/run/docker.sock:/var/run/docker.sock gerchardon/docker-logio -n `uname -n` -h logio
```

## Usage as CLI

1. ```npm install -g log.io --user "ubuntu"```
2. ```npm install docker-logio -g```
3. ```docker-logio -n docker```

## How it works

This module wraps four [Docker APIs](https://docs.docker.com/reference/api/docker_remote_api_v1.17/):

* `POST /containers/{id}/attach`, to fetch the logs
* `GET /containers/json`, to detect the containers that are running when
  this module starts
* `GET /events`, to detect new containers that will start after the
  module has started

## Roadmap

* Handle stream close
* Handle better container start/stop (fix LogIo server event)

## Inspire by

https://github.com/nearform/docker-logentries


## License

MIT
