FROM node:18-alpine

WORKDIR /app

COPY task-manager-api-24IT087/package*.json ./
RUN npm ci --omit=dev

COPY task-manager-api-24IT087/ ./

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
