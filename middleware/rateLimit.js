const limiter = require('express-rate-limit');

module.exports = (limiter({ 
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        code: 429,
        message: 'Too many requests from this IP! Please try again in 1h.'
    }
}))