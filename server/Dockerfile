FROM itzg/minecraft-server:2021.16.0-multiarch-latest

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN DEBIAN_FRONTEND=noninteractive apt-get install -qq -y nodejs
RUN npm install --global yarn

ENV EULA=TRUE

RUN mkdir /supervisor
COPY package.json /supervisor/
COPY yarn.lock /supervisor/

RUN cd /supervisor && yarn install --silent

COPY . /supervisor

RUN RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && apt-get update -y && apt-get install google-cloud-sdk -y

ENV UID=1000 GID=1000 \
  MEMORY="256M" \
  TYPE=BUKKIT VERSION=1.12.2 \
  ENABLE_RCON=true RCON_PORT=25575 RCON_PASSWORD=minecraft \
  SERVER_PORT=25565 ONLINE_MODE=TRUE SERVER_NAME="Minecraft Pack" \
  ENABLE_AUTOPAUSE=false AUTOPAUSE_TIMEOUT_EST=3600 AUTOPAUSE_TIMEOUT_KN=120 AUTOPAUSE_TIMEOUT_INIT=600 \
  AUTOPAUSE_PERIOD=10 AUTOPAUSE_KNOCK_INTERFACE=eth0 ONLINE_MODE=FALSE OPS=dev0x77

ENTRYPOINT ["/supervisor/node_modules/.bin/ts-node", "/supervisor/index.ts"]
