import User from '../models/User.js';
import Token from '../models/Token.js';
import bcrypt from 'bcryptjs';
import errorController from './errorController.js';
import jwt from 'jsonwebtoken';
import { createToken } from '../utility/createToken.js';
import { sendEmail } from '../utility/sendEmail.js';
import { sendSms } from '../utility/sendSms.js';


/**
 * Get All Users
 * @param {*} req 
 * @param {*} res 
 */
export const getAll = async (req, res, next) => {
    
    try {
        
        const allUsers = await User.find();
        if(!allUsers) {
            return next(errorController(404, `Can't find any users`))
        }

        res.status(200).json(allUsers)

    } catch (error) {
        return next(error)
    }
}

/**
 * Get Single Users
 * @param {*} req 
 * @param {*} res 
 */
export const getSingle = async (req, res, next) => {
    
    try {
        
        
        if (!req.params.id) {
            return next(errorController(404, `Can't find the user`))
        }

        const getSingleUser = await User.findById(req.params.id)
        res.status(200).json(getSingleUser)

    } catch (error) {
        return next(error)
    }
}

/**
 * Create Users
 * @param {*} req 
 * @param {*} res 
 */
export const createUser = async (req, res, next) => {

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    
    try {
        
        const createNew = await User.create({
            ...req.body,
            password : hashPassword
        })

        res.status(200).json(createNew)

    } catch (error) {
        return next(error)
    }
}

/**
 * Update Users
 * @param {*} req 
 * @param {*} res 
 */
export const updateUser = async (req, res, next) => {
    
    try {
        
        await User.findByIdAndUpdate(req.params.id, req.body, { new : true})

        res.status(200).json({
            message : 'Successfully Updated'
        })

    } catch (error) {
        return next(error)
    }
}

/**
 * Delete Users
 * @param {*} req 
 * @param {*} res 
 */
export const deleteUser = async (req, res, next) => {
    
    try {
        
        await User.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message : 'Successfully Deleted'
        })

    } catch (error) {
        return next(error)
    }
}

/**
 *User Login
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const userLogin = async (req, res, next) => {

    try {
        
        const userAuth = await User.findOne({ email : req.body.email })
        if(!userAuth) {
            return next(errorController(404, 'The email cannot be found'))
        }

        // Manage Password
        const userPassword = await bcrypt.compare(req.body.password, userAuth.password)
        if(!userPassword) {
            return next(errorController(404, 'Wrong Password'))
        }

        const token = await jwt.sign({id : userAuth._id}, process.env.JWT_TOKEN)

        const {_id, password, ...user_info} = await userAuth._doc;

        res.cookie('access_token', token).status(200).json({
            token : token,
            user : user_info
        })

    } catch (error) {
        return next(error)
    }
}

/**
 * User Register
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const userRegister = async (req, res, next) => {

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const {email, phone} = await req.body;

    try {
        
        const users = await User.create({
            ...req.body,
            password : hashPassword
        })

        //Generate Number for verification

        if (email) {

            const token = createToken({ id : users._id})

            await Token.create({userId : users._id, token : token})

            const verifyLink = `http://localhost:3000/user/verifying/${users._id}/${token}`

            await sendEmail(users.email, 'Profile verification from Facebook', verifyLink)

            res.status(200).json({
                message : 'Successfully Created'
            })

        }

        if (phone) {

            let verifyGenNum =  Math.ceil(Math.random() * 98765);
            let stringNum = JSON.stringify(verifyGenNum)
            await Token.create({ userId : users._id, token : stringNum})

            await sendSms(users.phone, `Hi! ${users.firstName}. Please put the OTP ${stringNum}`)

            res.status(200).json({
                message : 'Successfully Created'
            })

        }
        

    } catch (error) {
        return next(error)
    }
}

/**
 * User Loged In Authentication
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const userLogedIn = async (req, res, next) => {
    try {

        const bearerToken = req.headers.authorization
        const token = bearerToken ? bearerToken.split(" ")[1] : null;
        
        if (!token) {
            next(errorController(404, 'Token is not found'))
        }
        if (token) {
            const verifyToken = jwt.verify(token, process.env.JWT_TOKEN)
            if (!verifyToken) {
                next(errorController(404, 'Invalid Token'))
                res.status(201).json({message : 'Invalid Token'})
            }
            if (verifyToken) {
                const user = await User.findById(verifyToken.id)
                res.status(200).json(user)
            }
        }

    } catch (error) {
        return next(error)
    }
}

/**
 * Register User Verify
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const isVerify = async (req, res, next) => {
    try {
        const {token} = await req.body;
        const verifying = await Token.findOne({token : token})

        if (!verifying) {
            next(errorController(404, 'Token cannot be found'))
        }
        if (verifying) {
            await User.findOneAndUpdate( token , {
                isVerify : true
            })
            res.status(200).json({ message : 'Verified'})
            await verifying.remove()
        }
    } catch (error) {
        return next(error)
    }
}

export const passwordRecoveryLink = async (req, res, next) => {
    try {
        
        const {email} = await req.body;
        const real_user = await User.findOne({email})

        if (!real_user) {
            next(errorController(404, 'Cannot be found'))
        }
        if (real_user) {
            const token = createToken({id : real_user._id}, '10m')
            const sendLink = `http://localhost:3000/user/set-new-password/${real_user._id}/${token}`
            await sendEmail(real_user.email, 'Set new password', sendLink)

            res.status(200).json({
                message : 'Successfully send email'
            })
        }
    } catch (error) {
        return next(error)
    }
}

export const setNewPassword = async (req, res, next) => {
    try {
        const {password, token} = req.body;
        const {id} = jwt.verify(token, process.env.JWT_TOKEN)
        if (id) {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            await User.findByIdAndUpdate(id, {
                password : hashPassword
            })

            res.status(200).json({message : 'Successfully Updated'})
        }
        if (!id) {
            next(errorController(404, 'Connot find user'))
            res.status(404).json({ message : 'Cannot find'})
        }
    } catch (error) {
        return next(error)
    }
}