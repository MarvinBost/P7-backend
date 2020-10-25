// imports
const usersCtrl = require('../controllers/user-ctrl')
const router = require('express').Router()
const {
    body,
    validationResult
} = require('express-validator');
const auth = require('../middleware/auth');

router.post('/users/signup', [ //route /signup
    body('email').isEmail(), // check if 'email' is a email
    body('password').isLength({ // check if password length is equal : min 5 letters and max 20 letters
        min: 5,
        max: 20
    }),
    body('username').isLength({
        min: 5,
        max: 15
    })
], usersCtrl.signup) // use controller user with signup
router.post('/users/login', [ //route /login
    body('email').isEmail(), // check if 'email' is a email
    body('password').isLength({ // check if password length is equal : min 5 letters and max 20 letters
        min: 5,
        max: 20
    })
], usersCtrl.login) // use controller user with login

router.get('/users/me', auth, usersCtrl.getuser)

router.get('/users/', auth, usersCtrl.listUsers)

router.delete('/users/:id', auth, usersCtrl.deluser)

router.put('/users/:id', auth, usersCtrl.upUser)

module.exports = router