# Etapa 1: Construcción de la aplicación
FROM node:18 AS build

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar los archivos construidos al directorio de Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Exponer el puerto en el que Nginx servirá la aplicación
EXPOSE 80

# Definir el comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]