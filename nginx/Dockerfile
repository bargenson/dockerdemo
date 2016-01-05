FROM            nginx:1.9
MAINTAINER      Brice Argenson <brice@clevertoday.com>

ENV             CONSUL_TEMPLATE_URL  https://releases.hashicorp.com/consul-template/0.12.0/consul-template_0.12.0_linux_amd64.zip

ADD             $CONSUL_TEMPLATE_URL  /tmp/consul.zip

RUN             apt-get update -y && \
                apt-get install -y unzip && \
                apt-get clean && \
                rm -rf /var/lib/apt/lists/* && \
                unzip /tmp/consul.zip -d /usr/local/bin && \
                rm -f /tmp/consul.zip

COPY            nginx.conf.ctmpl        /tmp/nginx.conf.ctmpl
COPY            html                    /usr/share/nginx/html
COPY            docker-entrypoint.sh    /entrypoint.sh

RUN             chmod +x /entrypoint.sh

ENTRYPOINT      [ "/entrypoint.sh" ]
CMD             [ "start" ]
