const net = require("net");

const server = net.createServer();

// an array of client objects
const clients = [];
server.on("connection", (socket) => {
    console.log("A new connection to server");

    const clientId = clients.length + 1;
    // notify every user that 1 new user join
    clients.map((client) => {
        client.socket.write(`User ${client?.id} joined!!!`)
    })
    // send ID back to client to save
    socket.write(`id-${clientId}`);
    clients.push({ id: clientId.toString(), socket });

    socket.on("data", data => {
        const dataString = data.toString('utf-8');
        const id = dataString.substring(0, dataString.indexOf("-"));
        const message = dataString.substring(dataString.indexOf("-message-") + 9);

        clients.map(client => {
            client.socket.write(`> User ${id}: ${message}`)
        })
    });

    socket.on("end", () => {
        // notify every user that 1 new user leave
        clients.map((client) => {
            client.socket.write(`User ${client?.id} Left!!!`)
        })
    })
})

server.listen(3008, '127.0.0.1', () => {
    console.log("Open port server on ", server.address());
})