const server = require('./src/app')
const {PORT} = require('./src/config');

server.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
