

// Error Handler
const errorMiddleware = (error, req, res, next) => {

    const errorStatus = error.status || 500;
    const errorMessage = error.message || 'Unknown Message';

    res.status(errorStatus).json({
        message : errorMessage,
        status : errorStatus,
        stack : error.stack
    })
}

export default errorMiddleware;