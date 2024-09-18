
const Router = require('express').Router;
const passport = require('passport');

const router = Router();

router.get('/google', passport.authenticate('google'), (req, res) =>
    res.send(200)
);
router.get('/google/redirect', passport.authenticate('google'), (req, res) =>
    res.send(200)
);
 module.exports = router;
