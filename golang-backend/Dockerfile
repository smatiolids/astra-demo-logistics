FROM golang:1.18-alpine
RUN apk add build-base
WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY *.go ./
COPY producer/*.go ./producer/
RUN mkdir -p /app/tmp
RUN ls -l producer
RUN go build -o /golang-backend
EXPOSE 4000

CMD [ "/golang-backend" ]