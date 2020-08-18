module.exports = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers',
        'Origin X-Request-with Content-Type Accept Authorization')

    if (req.method === 'OPTION') {
        res.header('Access-Control-Allow-methods', 'GET POST PUT PATCH DELETE')
        res.status(200).json({})
    }
    next()
}