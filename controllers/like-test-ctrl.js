const models = require('../models/')
const jwt = require('../utils/jwt.utils')

let liked = 1
let disliked = 0
exports.like = (req, res) => {
    let userid = jwt.getid(req)
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
    }).then(message => {
        models.User.findOne({
            where: {
                id: userid
            }
        }).then(user => {
            models.Like.findOne({
                    where: {
                        userId: userid,
                        messageId: messageId
                    }
                }).then(messageliked => {
                    if (!messageliked) { // if message is not liked
                        message.addUser(user, { // add like
                                through: {
                                    isLike: liked
                                }
                            })
                            .then(() => {
                                message.update({
                                        likes: message.likes + 1
                                    })
                                    .then(() => {
                                        if (message) {
                                            return res.status(201).json(message)
                                        } else {
                                            return res.status(500).json({
                                                'error': 'cannot update message 2'
                                            })
                                        }
                                    })
                            })
                            .catch(err => {
                                return res.status(500).json(err)
                            })
                    } else {
                        if (messageliked.isLike === disliked) { // if message is already disliked
                            messageliked.update({
                                    isLike: liked
                                })
                                .then(() => {
                                    if (messageliked) {
                                        message.update({
                                                likes: message.likes + 1,
                                                dislikes: message.dislikes - 1
                                            })
                                            .then(() => {
                                                if (message) {
                                                    return res.status(201).json(message)
                                                } else {
                                                    return res.status(500).json({
                                                        'error': 'cannot update message 2'
                                                    })
                                                }
                                            })
                                    } else {
                                        return res.status(500).json({
                                            'error': 'cannot update message'
                                        })
                                    }
                                })

                        } else {
                            return res.status(409).json({
                                'error': 'message already liked'
                            })
                        }
                    }
                })
                .catch(err => {
                    return res.status(500).json(err)
                })
        })
    }).catch(err => {
        return res.status(500).json(err)
    })
}

exports.dislike = (req, res) => {
    let userid = jwt.getid(req)
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
    }).then(message => {
        models.User.findOne({
            where: {
                id: userid
            }
        }).then(user => {
            models.Like.findOne({
                    where: {
                        userId: userid,
                        messageId: messageId
                    }
                }).then(messageliked => {
                    if (!messageliked) { // if message is not disliked or liked
                        message.addUser(user, {
                                through: {
                                    isLike: disliked
                                }
                            })
                            .then(() => {
                                message.update({
                                        likes: message.likes - 1
                                    })
                                    .then(() => {
                                        if (message) {
                                            return res.status(201).json(message)
                                        } else {
                                            return res.status(500).json({
                                                'error': 'cannot update message 2'
                                            })
                                        }
                                    })
                            })
                            .catch(err => {
                                return res.status(500).json(`${err}`)
                            })
                    } else {
                        if (messageliked.isLike === liked) {
                            messageliked.update({
                                    isLike: disliked
                                })
                                .then(() => {
                                    if (messageliked) {
                                        message.update({
                                                likes: message.likes - 1,
                                                dislikes: message.dislikes + 1
                                            })
                                            .then(() => {
                                                if (message) {
                                                    return res.status(201).json(message)
                                                } else {
                                                    return res.status(500).json({
                                                        'error': 'cannot update message 2'
                                                    })
                                                }
                                            })
                                    } else {
                                        return res.status(500).json({
                                            'error': 'cannot update message'
                                        })
                                    }
                                })
                        } else {
                            return res.status(409).json({
                                'error': 'message already disliked'
                            })
                        }
                    }
                })
                .catch(err => {
                    return res.status(500).json(`${err}`)
                })
        })
    }).catch(err => {
        return res.status(500).json(`${err}`)
    })
}