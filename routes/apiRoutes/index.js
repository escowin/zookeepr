// ::route:: /api/
const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes'); // /animals/

router.use(animalRoutes); // ::route:: /api/animals/

module.exports = router;