const limiter = require('express-rate-limit');

module.exports = (limiter({ 
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        code: 429,
        message: 'Trop de requêtes provenant de cette IP ! Veuillez réessayer dans 1h.'
    }
}))