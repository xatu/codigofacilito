const socket = io()

socket.on('new image', (data) => {
    data = JSON.parse({"data" : data})

    console.log(data)
})