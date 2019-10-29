const express = require('express');
const cors = require('cors');
const db = require('./data/db');

const server = express();

server.use(cors());
server.use(express.json());

server.post('/api/posts', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        db.insert({
            title,
            contents
        })
        .then(post => {
            res.status(201).json(post.id);
        })
        .catch(() => {
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        });
    }
});

server.post('/api/posts/:id/comments', (req, res) => {

});

server.get('/api/posts', (req, res) => {

});

server.get('/api/posts/:id', (req, res) => {

});

server.get('/api/posts/:id/comments', (req, res) => {

});

server.delete('/api/posts:id', (req, res) => {

});

server.put('/api/posts:id', (req, res) => {

});

server.get('*', (req, res) => {
    res.status(200).json({
        message: 'API running'
    })
});

server.listen(process.env.PORT || 5000, () => {
    console.log('Server listening on ' + (process.env.PORT || 5000));
});