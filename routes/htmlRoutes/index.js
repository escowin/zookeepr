// ::route:: frontend html
const path = require("path");
const router = require("express").Router();

// html get routes | res.sendFile responds with the frontend index.html to display in browser; path.join finds the correct location for browser html to ensure app works in any server environment.

// - loads frontend index.html to browser.
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

// - loads frontend animals.html
router.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/animals.html"));
});

// - loads frontend zookeepers.html
router.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/zookeepers.html"));
});

// - redirects to index.html for clients making requests to non-existant wild card routes. must be placed last.
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

module.exports = router;