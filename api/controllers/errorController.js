
// Error Controlling
const errorController = (status, msg) => {

    const error = new Error();
    error.status = status;
    error.message = msg;

    return error;
}

export default errorController;