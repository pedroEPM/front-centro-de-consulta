FROM node:14
ENV HOST 0.0.0.0

RUN mkdir -p /usr/src/front-centroconsulta

WORKDIR  /usr/src/front-centroconsulta

 

COPY . .


RUN npm install
RUN npm i vue-html2pdf
RUN npm run build
EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

#ENTRYPOINT npm run dev
CMD [ "npm", "start" ]
