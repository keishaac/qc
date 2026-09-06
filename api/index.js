// Vercel serverless entry point.
// Wraps the existing Koa app (app.js) so it can run as a single
// Node.js Serverless Function instead of a long-running server.
require('dotenv').config()

const serverless = require('serverless-http')
const app = require('../app')

module.exports = serverless(app)
