import jwt from 'jsonwebtoken';

export const createToken = (data, expire = '3d') => {
    return jwt.sign(data, process.env.JWT_TOKEN, {
        expiresIn : expire
    })
}