FROM node
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
