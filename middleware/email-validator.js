const validator = require("email-validator");

module.exports = (req, res, next) => {
    const email = req.body.email;

    if(validator.validate(email) === true){
        console.log("-->validator.validate");
        console.log(`email valide ${validator.validate(email)}`);
        next();
    } else {
        return res.status(400).json({error: `l'email ${email} n'est pas valide`})
    };
};