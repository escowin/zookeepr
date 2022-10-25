const router = require("express").Router();
const animalRoutes = require("../apiRoutes/animalRoutes");
const zookepperRoutes = require("../apiRoutes/zookeeperRoutes");

router.use(animalRoutes);
router.use(zookepperRoutes);

module.exports = router;