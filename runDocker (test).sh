#!/bin/bash
echo deteniendo y eliminando la contenedor anterior
sleep 1
docker stop front-centroconsulta2
docker rm front-centroconsulta2
sleep 1
echo eliminando imagen anterior 
sleep 1
docker rmi front-centroconsulta2
sleep 1
echo creando nueva imagen de front-centroconsulta2
sleep 1
docker build -t front-centroconsulta2 .
echo ejecutando el contenedor front-centroconsulta2

docker run --name front-centroconsulta2 -p 3004:3004 -v /home/public/front-centroconsulta2:/usr/src/front-centroconsulta2/public -v /home/public/front-centroconsulta2:/usr/src/front-centroconsulta2/files-to-upload -d front-centroconsulta2
echo listo.
