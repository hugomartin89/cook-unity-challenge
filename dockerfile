FROM node:18-alpine AS build

WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine as deploy
WORKDIR /app
COPY --from=build /src/prisma/ ./prisma
COPY --from=build /src/dist/ .
RUN ls -la .
RUN npm install
RUN npm install --global prisma
RUN npx prisma generate
CMD ["npm", "run", "start"]
