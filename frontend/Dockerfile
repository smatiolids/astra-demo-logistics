# FROM golang:1.17 AS golang
# WORKDIR /app
# COPY golang-producer/ ./
# RUN go build -o downloader ./cmd/downloader

FROM node:16.14.2-alpine
# COPY --from=golang /app/golang /usr/local/bin/

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]