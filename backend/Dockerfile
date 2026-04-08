FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o nexus-connector main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/nexus-connector .
EXPOSE 8021
CMD ["./nexus-connector"]
