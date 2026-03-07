FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o cuberbox-connector main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/cuberbox-connector .
EXPOSE 8021
CMD ["./cuberbox-connector"]
