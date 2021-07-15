# Minecraft Pack Server

I don't wanna pay for multiplayer with friends and don't wanna fuck around with Mesh VPN, port forwarding, NAT, tunnels and etc...

So we use Heroku as a hosting, but it is no TCP connections possibility, but we have HTTP and WS!
Also it is no persistent storage so we have world snapshot on Google Cloud Storage

## Architecture
```text
  Custom launcher with WS to TCP bridge
                    │
        Cold start on connection
                    │
                    ▼
             Heroku Container
                    │
                    ▼
            TCP to WS bridge
                    │
                    ▼
          World restore from GCS
                    │
                    ▼
            Minecraft Server
```
