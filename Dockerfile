FROM balenalib/raspberrypi3-node:8-latest
RUN [ "cross-build-start" ]



RUN apt-get update && \
apt-get install -yqq --no-install-recommends curl g++ gcc make  supervisor wiringpi && rm -rf /var/lib/apt/lists/*



 
RUN mkdir /433Utils
COPY  433Utils /433Utils/

RUN cd /433Utils/RPi_utils \
&& make

RUN mkdir /App/


COPY App/package.json  /App/package.json

RUN cd /App/ \
&& npm  install 


COPY App /App



RUN [ "cross-build-end" ]  



ENTRYPOINT ["node","/App/app.js"]

