# Use the official Golang image with Linux and build tools
FROM golang:1.21

# Enable CGO and install required C dependencies
ENV CGO_ENABLED=1
RUN apt-get update && apt-get install -y gcc libc6-dev

# Set the working directory
WORKDIR /app

# Copy only the backend folder
COPY backend ./backend

# Change directory and build the Go app
RUN cd backend && go build -o server .

# Expose the port your server runs on (adjust if not 8080)
EXPOSE 8080

# Run the compiled Go binary
CMD ["./backend/server"]
