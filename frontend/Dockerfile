FROM node:alpine as frontend
WORKDIR /app
COPY ./src ./src
COPY ./public ./public
COPY ./index.html .
COPY ./package.json .
COPY ./tsconfig.app.json .
COPY ./tsconfig.json .
COPY ./tsconfig.node.json .
COPY ./vite.config.ts .
RUN npm install --include=dev && npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
