const models = require('../models/')
const jwt = require('../utils/jwt.utils')

const DISLIKED = 0
const LIKED = 1

exports.like = (req, res) => {
    let id = jwt.getid(req)
    let messageId = parseInt(req.params.messageId)

    if (messageId <= 0) {
        return res.status(400).json({
            'error': 'missing request data query'
        })
    }

    models.Message.findOne({
            where: {
                id: messageId
            }
        })
        .then(message => {
            if (message) { // if message found
                models.User.findOne({ // search user by id with token
                        where: {
                            id: id
                        }
                    })
                    .then(user => {
                        if (user) { // if user found
                            models.Like.findOne({ //search in table like with id and message id
                                    where: {
                                        userId: id,
                                        messageId: messageId
                                    }
                                })
                                .then(userLiked => {
                                    if (!userLiked) { // if user already found
                                        message.addUser(user, {
                                                isLike: LIKED
                                            })
                                            .then(alreadyLike => {
                                                message.update({
                                                    likes: message.likes + 1,
                                                }).then(() => {
                                                    if (message) {
                                                        return res.status(201).json({
                                                            'message': `${message}`
                                                        })
                                                    } else {
                                                        return res.status(500).json({
                                                            'error': 'update message like counter'
                                                        })
                                                    }
                                                })
                                            })
                                            .catch(err => {
                                                return res.status(500).json({
                                                    'error': [{
                                                        'error': 'unable to set user reaction',
                                                        err
                                                    }]
                                                })
                                            })
                                    } else {
                                        if (userLiked.isLike === DISLIKED) {
                                            userLiked.update({
                                                    isLike: LIKED,
                                                })
                                                .then(() => {
                                                    message.update({
                                                            likes: message.likes + 1,
                                                        })
                                                        .then(() => {
                                                            if (message) {
                                                                return res.status(201).json({
                                                                    'message': `${message}`
                                                                })
                                                            } else {
                                                                return res.status(500).json({
                                                                    'error': 'update message like counter'
                                                                })
                                                            }
                                                        })
                                                })
                                                .catch(err => {
                                                    res.status(500).json({
                                                        'error': 'cannot update user reaction'
                                                    })
                                                })
                                        } else {
                                            res.status(409).json({
                                                'error': [{
                                                    'error': 'message already liked',
                                                    err
                                                }]
                                            })
                                        }
                                    }
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        'error': `${err}`
                                    })
                                })
                        } else {
                            res.status(404).json({
                                'error': 'user not found'
                            })
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            'error': `user not verify : ${err}`
                        })
                    })
            } else {
                res.status(404).json({
                    'error': 'post already liked'
                })
            }
        })
        .catch(err => {
            err => {
                res.status(500).json({
                    'error': `${err}`
                })
            }
        })
}

exports.dislike = (req, res) => {
    let id = jwt.getid(req)
    let messageId = parseInt(req.query.messageId)

    if (messageId <= 0) {
        return res.status(400).json({
            'error': 'missing request data query'
        })
    }

    models.Message.findOne({
            where: {
                id: messageId
            }
        })
        .then(message => {
            if (message) {
                models.User.findOne({
                        where: {
                            id: id
                        }
                    })
                    .then(user => {
                        if (user) {
                            models.Like.findOne({
                                    where: {
                                        userId: id,
                                        messageId: messageId
                                    }
                                })
                                .then(userLiked => {
                                    if (userLiked) {
                                        userLiked.destroy()
                                            .then(() => {
                                                message.update({
                                                        likes: message.likes - 1
                                                    })
                                                    .then(() => {
                                                        if (message) {
                                                            return res.status(201).json(message)
                                                        } else {
                                                            return res.status(500).json({
                                                                'error': 'cannot update message'
                                                            })
                                                        }
                                                    })
                                                    .catch(err => {
                                                        res.status(500).json({
                                                            'error': 'cannot update message counter'
                                                        })
                                                    })
                                            })
                                            .catch(err => {
                                                return res.status(500).json({
                                                    'error': 'cannot remove already liked post'
                                                })
                                            })
                                    }
                                })
                                .catch(res.status(500).json({
                                    'error': `${err}`
                                }))
                        } else {
                            res.status(404).json({
                                'error': 'user not found'
                            })
                        }
                    })
                    .catch(res.status(500).json({
                        'error': `user not verify : ${err}`
                    }))
            } else {
                res.status(404).json({
                    'error': 'post already liked'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                'error': `${err}`
            })
        })
}