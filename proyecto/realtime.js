module.exports = (server,redis_session) => {
    const io = require('socket.io')(server),
    redis = require('redis'),
    client = redis.createClient()

    client.subscribe('images')

    io.use((socket, next) =>{
        redis_session(socket.request, socket.request.res, next)
    })

    client.on('message', (channel, message) => {
        if(channel == 'images') {
            io.emit('new image', message)
        }
    })

    io.sockets.on('connection', (socket) => {
        console.log(socket.request.session.user_id)
    })
}