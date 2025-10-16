FROM node:20-bookworm

RUN npx -y playwright@1.56.0 install --with-deps
RUN apt-get update && apt-get install -y xvfb
COPY ./run.sh /
RUN chmod +x /run.sh
ENTRYPOINT /run.sh