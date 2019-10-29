const express = require("express");
const cors = require("cors");
const router = require("./data/router");

const server = express();

server.use(cors());
server.use(express.json());
server.use("/api/posts", router);

server.get("*", (req, res) => {
  res.status(200).json({
    message: "API running"
  });
});

module.exports = server;
