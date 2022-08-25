import express from 'express';
import { createUser, deleteUser, getAll, getSingle, isVerify, passwordRecoveryLink, setNewPassword, updateUser, userLogedIn, userLogin, userRegister } from '../controllers/User.js';
const router = express.Router();


// User Login and Register Routers
router.post('/login', userLogin)
router.post('/register', userRegister)
router.get('/me', userLogedIn)
router.post('/isverify', isVerify)
router.post('/passwordRecoveryLink', passwordRecoveryLink)
router.post('/setNewPassword', setNewPassword)
// Create Router
router.route('/').get(getAll).post(createUser)
router.route('/:id').get(getSingle).put(updateUser).patch(updateUser).delete(deleteUser)



// Export
export default router;