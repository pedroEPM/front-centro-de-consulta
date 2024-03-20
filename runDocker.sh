#!/bin/bash
echo deteniendo y eliminando la contenedor anterior
sleep 1
docker stop front-centroconsulta
docker rm front-centroconsulta
sleep 1
echo eliminando imagen anterior 
sleep 1
docker rmi front-centroconsulta
sleep 1
echo creando nueva imagen de front-centroconsulta
sleep 1
docker build -t front-centroconsulta .
echo ejecutando el contenedor front-centroconsulta

docker run --name front-centroconsulta -p 3000:3000 -v /home/public/front-centroconsulta:/usr/src/front-centroconsulta/public -v /home/public/front-centroconsulta:/usr/src/front-centroconsulta/files-to-upload -d front-centroconsulta
echo listo.
