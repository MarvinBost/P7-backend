const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, 'Pv8Md2tFMr3MmsuQwrZ38JmJNrxCkpVj2AQwUA7pZmdGT5H6Rp')
        const userId = decodedToken.userId
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !'
        } else {
            next()
        }
    } catch (error) {
        res.status(401).json({
            error: 'Requête non authentifiée !'
        })
    }
}