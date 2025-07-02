FROM golang:1.22

# Enable CGO and install required C dependencies
ENV CGO_ENABLED=1
RUN apt-get update && apt-get install -y gcc libc6-dev

WORKDIR /app

# Copy only the backend folder
COPY backend ./backend

# Build your Go app
RUN cd backend && go build -o server .

EXPOSE 8080

CMD ["./backend/server"]
