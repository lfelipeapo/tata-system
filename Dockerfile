# Usar uma imagem base Node.js
FROM node:16.19.0

# Definir o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Expor a porta 3000
EXPOSE 3000

# Comando para executar o aplicativo
CMD ["npm", "run", "dev"]