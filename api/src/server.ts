import http from 'http';
import app from './app';
import { Server } from 'socket.io';
import { handleMatchSocket } from './sockets/match.socket';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.io with CORS settings to allow connections from any origin
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Handle new Socket.io connections
io.on("connection", (socket) => {
  console.log('a user connected', socket.id);

  // Initialize match socket handlers
  handleMatchSocket(io, socket);

  socket.on("disconnect", () => {
    console.log('user disconnected', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API base: http://localhost:${PORT}/api`);
});

// Graceful shutdown function
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Closing server gracefully...`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

// Handle signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export { io };