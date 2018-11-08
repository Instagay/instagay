# Instagay

### Setup

Client-side: Owntracks on iOS / Android
Server-side: `https://github.com/LINKIWI/orion-docker`

#### Orion-docker installation:

- Install Docker & Docker-compose
- in `.env`
```
MAPBOX_API_TOKEN=<your Mapbox API token>
PORT=9999
```
- `sudo docker-compose up --build -d `
- Things should be working at port `9999`

Getting into Docker containers:

- Do `sudo docker ps` and list the containers. Find the one with nginx.
- `sudo docker exec -it {containerid} bash` will log you into the nginx container.
- also do `apt-get update` and `apt-get install -y vim`

Adding HTTP basic authentication:

- On a computer, craft a .htpasswd file by. Each line should be:
- `username:$apr1$3/abcxyc`
- Generate everything after the colon with `openssl passwd -apr1`
- Log into the nginx container
- This should go into `/etc/.htpasswd` in the docker image for nginx.
- Edit `/etc/nginx/nginx.conf` and add to all routes:
```
        auth_basic "Restricted Content";
        auth_basic_user_file /etc/nginx/.htpasswd;
```

### Repo Installation

- `npm install -d`

### Startup stuff

Install PM2:
`npm install pm2 -g`
