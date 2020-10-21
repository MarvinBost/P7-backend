const jwt = require('jsonwebtoken')
const {
    use
} = require('../routes/user-router')
const secretkey = 'Pv8Md2tFMr3MmsuQwrZ38JmJNrxCkpVj2AQwUA7pZmdGT5H6Rp'

module.exports = {
    generateToken: user => {
        return jwt.sign({
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secretkey, {
                expiresIn: '1h'
            }
        )
    },
    getid: req => {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, secretkey)
        const userId = decodedToken.userId
        if (userId > 0) {
            return userId
        }

    },
    isAdmin: req => {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, secretkey)
        let isAdmin = decodedToken.isAdmin
        if (isAdmin) {
            return true
        } else {
            return false
        }
    }
}