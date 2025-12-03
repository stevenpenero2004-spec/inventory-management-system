const { createLogger, format, transports } = require('winston')
const fs = require('fs')
const path = require('path')

const logsDir = path.join(process.cwd(), 'logs')
try {
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)
} catch {}

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.timestamp(), format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)),
    }),
    new transports.File({ filename: path.join(logsDir, 'app.log') }),
  ],
})

module.exports = logger
