class ExpressError extends Error{
    constructor(message,statusCode){
        super();
        this.message = message;
        thos.statusCode = statusCode;
    }
}

module.exports = ExpressError;