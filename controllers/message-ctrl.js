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
            order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
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
    const id = jwt.getid(req)
    const messageId = parseInt(req.params.messageId)
    if (isadmin) {
        models.Message.destroy({
                where: {
                    id: messageId
                }
            })
            .then(deleted => {
                if (deleted) {
                    return res.status(200).json({
                        response: 'Message deleted successfully !'
                    })
                } else {
                    return res.status(404).json({
                        message: 'Message not found !'
                    })
                }
            })
            .catch(err => {
                return res.status(500).json({
                    error: `${err}`
                })
            })
    } else {
        models.Message.findOne({ // Try to find a message on DataBase
                where: {
                    userId: id, // with your id in the token 
                    id: messageId // and with the message id in the request parameter
                }
            })
            .then(message => {
                if (message) {
                    models.Message.destroy({
                            where: {
                                id: messageId
                            }
                        })
                        .then(deleted => {
                            if (deleted) {
                                return res.status(200).json({
                                    response: 'Message deleted successfully !'
                                })
                            } else {
                                return res.status(404).json({
                                    message: 'Message not found !'
                                })
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                error: `${err}`
                            })
                        })
                } else {
                    return res.status(401).json({
                        message: 'is not your own message'
                    })
                }
            })
            .catch(err => {
                return res.status(404).json({
                    message: 'is not your message'
                })
            })
    }
}