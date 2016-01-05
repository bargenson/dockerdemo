FROM          node:5.1
MAINTAINER    Brice Argenson <brice@clevertoday.com>
  
ENV           NODE_ENV    production

COPY          docker-entrypoint.sh    /entrypoint.sh
COPY          src                     /usr/local/app
COPY          package.json            /usr/local/app/package.json
  
WORKDIR       /usr/local/app
  
RUN           npm install
RUN           chmod +x /entrypoint.sh
  
EXPOSE        8080
  
ENTRYPOINT    [ "/entrypoint.sh" ]
CMD           [ "start" ]
