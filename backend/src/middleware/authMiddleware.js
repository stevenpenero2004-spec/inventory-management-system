const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const header = req.headers.authorization || ''
  const [, token] = header.split(' ')
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

