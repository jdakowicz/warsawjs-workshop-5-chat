const socketIo = require('socket.io')
const constans = require('./constans')

module.exports = server => {
  const io = socketIo(server)

  // TODO Przeniesc dane do bazy danych
  const users = {}
  const connected = {}
  let connections = 0

  io.on('connection', socket => {
    console.log('io.on.connection')
    connections++
    const user = {
      id: socket.id,
      name: `${constans.DEFAULT_USERNAME}${connections}`,
      room: constans.DEFAULT_ROOM
    }

    // TODO jak dwoch uzytkownikow bedzie mialo to samo imie to sie nadpisza
    users[user.name] = user
    connected[socket.id] = users[user.name]

    const joinMessage = `Uzytkownik ${user.name} dolaczyl do pokoju ${user.room}`
    // socket.broadcast.emit('message', joinMessage)
    socket.join(user.room, () => {
      console.log('socket.join', user.room)
      socket.broadcast.emit('message', joinMessage)
    })

    socket.on('message', ({ message }) => {
      console.log('socket.on.message', message)
      // TODO dodaj filtrowanie slownictwa
      io.local.emit('message', `${user.name}: ${message}`)
    })

    const disconnectMessage = `Uzytkownik ${user.name} rozlaczyl sie`
    socket.on('disconnect', socket => {
      io.local.emit('message', disconnectMessage)
      delete users[user.name]
      delete connected[socket.id]

      console.log('socket.on.disconnect')
    })
  })
}

// io.local - wyswietla do wszystkich
// io.broadcact - wyswietla do wszystkich oprocz emitujacego
