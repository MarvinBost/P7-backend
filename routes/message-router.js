const msgCtrl = require('../controllers/message-ctrl')
const likeCtrl = require('../controllers/like-ctrl')
const router = require('express').Router()
const auth = require('../middleware/auth');

router.post('/messages/new', [

], auth, msgCtrl.createMessage)

router.get('/messages', auth, msgCtrl.listMessages)
router.delete('/messages/:messageId', auth, msgCtrl.deleteMessage)

router.post('/messages/:messageId/like', auth, likeCtrl.like)
router.post('/messages/:messageId/dislike', auth, likeCtrl.dislike)

module.exports = router