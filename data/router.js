const express = require("express");
const db = require("./db");

const router = express.Router();

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    db.insert({
      title,
      contents
    })
      .then(post => {
        res.status(201).json(post.id);
      })
      .catch(() => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

router.post("/:id/comments", (req, res) => {
  db.findById(req.params.id)
    .then(data => {
      if (data.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (!req.body.text) {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      } else {
        return db.insertComment(req.body);
      }
    })
    .then(comment => {
      res.status(201).json(comment);
    })
    .catch(() =>
      res.status(500).json({
        error: "There was an error while saving the comment to the database"
      })
    );
});

router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  db.findPostComments(req.params.id)
    .then(comments => {
      if (comments.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(comments);
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  db.remove(req.params.id)
    .then(deleted => {
      if (deleted === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(deleted);
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const updatedPost = req.body;
  if (!updatedPost.title && !updatedPost.contents) {
    res
      .status(400)
      .json({ errorMessage: "Please provide title or contents for the post." });
  } else {
    db.update(req.params.id, req.body)
      .then(post => {
        if (!post) {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        } else {
          res.status(200).json(post);
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  }
});

module.exports = router;
