# Usa una imagen oficial de Node.js
FROM node:18

# Crea y usa el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto que usa tu app
EXPOSE 8000

# Comando para ejecutar la app
CMD ["node", "server.js"]