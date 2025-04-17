const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const app = express();
const server = http.createServer(app);
const socket = require('socket.io'); 

const corsOptions ={
    origin:process.env.cors_origin || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (after middlewares)
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messagesRoutes');
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in the .env file');
    process.exit(1);
}
mongoose.connect(`${MONGODB_URI}`,{ dbName: 'ChatApp' })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Basic route 
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const io = socket(server, {
    cors: {
        origin: process.env.cors_origin || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        optionSuccessStatus:200
    },
});
global.onlineUsers = new Map();

  
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
  
    // Handle user joining their room
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
      // Emit confirmation back to the client
      socket.emit('joined', userId);
    });
  
    // Handle sending messages
    socket.on('send-msg', ({ to, from, message, messageId }) => {
      console.log('Received send-msg:', { to, from, message, messageId });
      // Emit to the recipient's room
      io.to(to).emit('msg-receive', { message, from, messageId });
      console.log(`Emitted msg-receive to room ${to}`);
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
