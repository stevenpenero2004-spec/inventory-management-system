const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Activity = require('../models/Activity')

function signToken(user) {
  const payload = { sub: user._id.toString(), name: user.name, role: user.role }
  const expiresIn = process.env.JWT_EXPIRES || '1h'
  const secret = process.env.JWT_SECRET || 'dev_secret'
  return jwt.sign(payload, secret, { expiresIn })
}

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.validatedBody
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'Email already registered' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hash, role: role || 'user' })
    await Activity.create({ type: 'auth.register', entityType: 'User', entityId: user._id, message: `User registered: ${user.email}`, user: user.email })
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.validatedBody
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid credentials' })
    const token = signToken(user)
    await Activity.create({ type: 'auth.login', entityType: 'User', entityId: user._id, message: `User logged in: ${user.email}`, user: user.email })
    res.json({ token })
  } catch (err) {
    next(err)
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.sub).select('name email role')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

async function logout(req, res, next) {
  try {
    await Activity.create({ type: 'auth.logout', entityType: 'User', entityId: req.user?.sub, message: `User logged out`, user: req.user?.name })
    res.json({ message: 'Logged out' })
  } catch (err) { next(err) }
}

module.exports = { register, login, me, logout }
