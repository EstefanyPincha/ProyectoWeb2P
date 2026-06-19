# Publicacion de sitio en HTML

**Descripcion:**  
Despliegue del Portal de Emprendimientos de la Universidad de las Fuerzas Armadas – ESPE y subida a un repositorio en GitHub, dentro de un contenedor Docker usando Nginx.

La imagen fue publicada en Docker Hub para poder ejecutarla en cualquier entorno.

**Instrucciones:**   
***1. Construir la imagen***  
Antes de construir la imagen, debemos iniciar sesión en Docker Hub con el comando:  
`docker login`  

Posterior a eso si construimos la imagen con  
`docker build -t proyectoweb2p-nginx .`  

Donde: 
-  `docker build` permite construir una imagen a partir del Dockerfile
- `-t proyectoweb2p-nginx` asigna un tag a la imagen
- `.` indica que se utilizará el contenido de la carpeta actual.  


***2. Ejecución del contenedor***  
Para ejecutar el contenedor debemos ejecutar el siguiente comando  
`docker run -d -p 8080:80 proyectoweb2p-nginx`  

Donde: 
-  `-d` ejecuta el contenedor en segundo plano
- `-p 8080:80` asigna el puerto 80 del contenedor al puerto 8080 del equipo local (local host)
- `proyectoweb2p-nginx` indica el nombre de la imagen creada  

***3. Acceso al sitio web:***  
Con el contenedor ejecutándose en segundo plano, podemos acceder al sitio web desde el navegador mediante la siguiente dirección:  
<http://localhost:8080>  

***4. Descargar la imagen desde Docker Hub:***  
Primer para descargar la imagen debemos publicarla en Docker Hub, esto lo hacemos con el comando:   
`docker tag proyectoweb2p-nginx jonasdz2002/proyectoweb2p-nginx`  
El cual nos ayuda a darle un nombre en nuestro repositorio.  

Posterior a eso la publicamos con:  
`docker push jonasdz2002/proyectoweb2p-nginx`  

Para descargar la imagen desde Docker Hub utilizamos  
`docker pull jonasdz2002/proyectoweb2p-nginx`  

***5. Ejecutar la imagen descargada:***  
Una vez descargada la imagen, la ejecutaremos como si nosotros la hubiesemos creado, pero ahora nombrando el usuario y el nombre de la imagen  
`docker run -d -p 8080:80 jonasdz2002/proyectoweb2p-nginx`  

***
[Link a la imagen en Docker](https://hub.docker.com/repository/docker/jonasdz2002/proyectoweb2p/general)
***

