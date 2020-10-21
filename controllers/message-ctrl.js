const models = require('../models/')
const jwt = require('../utils/jwt.utils')

exports.createMessage = (req, res) => {
    const {
        title,
        content,
        attachement
    } = req.body

    let id = jwt.getid(req)

    if (title == null || content == null) {
        return res.status(400).json({
            'error': 'missing required data'
        })
    }

    models.User.findOne({
            where: {
                id: id
            }
        })
        .then(user => {
            if (user) {
                console.log(req.body.attachement)
                models.Message.create({
                        title: title,
                        content: content,
                        attachment: req.body.attachement,
                        likes: 0,
                        dislikes: 0,
                        UserId: id
                    }).then(message => {
                        if (message) {
                            return res.status(201).json(message)
                        } else {
                            return res.status(500).json({
                                'error': 'cannot post message'
                            })
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({
                            message: `${err}`
                        })
                    })
            } else {
                res.status(404).json({
                    'error': 'user not found'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                'error': 'Error user'
            })
        })
}

exports.listMessages = (req, res) => {
    let fields = req.query.fields
    let order = req.query.order
    let limit = parseInt(req.query.limit)
    let offset = parseInt(req.query.offset)

    if (limit > 10) {
        limit = 10;
    }
    models.Message.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields != '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : 10,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: models.User,
                attributes: ['username']
            }]
        })
        .then(message => {
            if (message) {
                res.status(200).json(message)
            } else {
                res.status(404).json({
                    'error': 'no messages found'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                'error': `${err}`
            })
        })
}

exports.deleteMessage = (req, res) => {
    const isadmin = jwt.isAdmin(req)
    const messageId = parseInt(req.params.messageId)
    if (isadmin) {
        models.Like.destroy({
                where: {
                    messageId: messageId
                }
            })
            .then(likeDeleted => {

                models.Message.destroy({
                        where: {
                            id: messageId
                        }
                    })
                    .then(deleted => {
                        if (deleted) {
                            res.status(200).json({
                                response: 'Message deleted successfully !'
                            })
                        } else {
                            res.status(404).json({
                                message: 'Message not found !'
                            })
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: `${err}`
                        })
                    })
            })
            .catch(err => {
                res.status(500).json({
                    error: `${err}`
                })
            })
    } else {
        res.status(401).json({
            message: 'User unauthorized'
        })
    }
}