const express = require('express');
const cors = require('cors');

const server = express();

server.use(cors());
server.use(express.json());

server.get('*', (req, res) => {
    res.status(200).json({
        message: 'API running'
    })
});

server.listen(process.env.PORT || 5000, () => {
    console.log('Server listening on ' + (process.env.PORT || 5000));
});