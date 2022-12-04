// ::route:: /api/
const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes'); // /animals/
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes'); // /zookeepers

router.use(animalRoutes); // ::route:: /api/animals/
router.use(zookeeperRoutes); // ::route:: /api/zookeepers

module.exports = router;