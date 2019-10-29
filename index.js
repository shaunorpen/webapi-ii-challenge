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
    const post = db.findById(req.params.id);
    const comment = req.body;
    if (!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else if (!comment.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    } else {
        db.insertComment(comment)
        .then(comment_id => {
            res.status(201).json(comment_id);
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the comment to the database" });
        })
    }
});

server.get('/api/posts', (req, res) => {
    db.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    });
});

server.get('/api/posts/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if (post.length !== 0) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(() => {
        res.status(500).json({ error: "The post information could not be retrieved." });
    })
});

server.get('/api/posts/:id/comments', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if (post.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            db.findPostComments(req.params.id)
            .then(comments => {
                res.status(200).json(comments);
            })
            .catch(() => {
                res.status(500).json({ error: "The comments information could not be retrieved." });
            });
        }
    })
    .catch(() => {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    });
});

server.delete('/api/posts/:id', (req, res) => {
    db.remove(req.params.id)
    .then(deleted => {
        if (deleted === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        } else {
            res.status(200).json(deleted);
        }
    })
    .catch(() => {
        res.status(500).json({ error: "The post could not be removed" });
    })
});

server.put('/api/posts/:id', (req, res) => {
    const updatedPost = req.body;
    if ((!updatedPost.title && !updatedPost.contents)) {
        res.status(400).json({ errorMessage: "Please provide title or contents for the post." });
    } else {
        db.update(req.params.id, req.body)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                res.status(200).json(post);
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The post information could not be modified." });
        });
    }
});

server.get('*', (req, res) => {
    res.status(200).json({
        message: 'API running'
    })
});

server.listen(process.env.PORT || 5000, () => {
    console.log('Server listening on ' + (process.env.PORT || 5000));
});