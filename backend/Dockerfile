# Usar una imagen base de Node.js versión 18
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación escuchará
EXPOSE 5000

# Definir el comando para iniciar la aplicación
CMD ["node", "server.js"]