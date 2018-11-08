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
- `sudo docker-compose up -build -d `
- Things should be working at port `9999`

Adding HTTP basic authentication:

- On a computer, craft a .htpasswd file by. Each line should be:
- `username:$apr1$3/blahblahblah`
- Generate everything after the colon with `openssl passwd -apr1`
- This should go into `/etc/.htpasswd`
