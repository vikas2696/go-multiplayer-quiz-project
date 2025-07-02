FROM golang:1.21

# Set the working directory
WORKDIR /app

# Copy only the backend folder
COPY backend ./backend

# Build the Go app
RUN cd backend && go build -o server .

# Expose the desired port (adjust to your Go server)
EXPOSE 8080

# Run the server
CMD ["./backend/server"]
