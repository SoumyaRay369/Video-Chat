import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT || 3000;

const app = express()
const server = createServer(app)
const io = new Server(server)

app.get('/', (req, res) => {
    res.send('Hello World')
})

io.on('connection', (socket) => {
    console.log(socket.id)
    console.log('a user connected');
});

server.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});

