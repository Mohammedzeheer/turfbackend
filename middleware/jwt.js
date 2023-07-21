const JWT = require('jsonwebtoken')

const auth = (req, res, next) => {

    const data = JSON.parse(req.body.token)
    let token = data.token
    if (token) {
        let decode = JWT.verify(token, 'Key')
        console.log(decode);
        if (decode.exp > Date.now() / 1000) {
            console.log("success");
            next()
        } else {
            res.json({ status: 'failed' })
        }
    } else {
        res.json({ status: 'failed' })
    }

}

module.exports = auth

