import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true
    },
    surName : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    phone : {
        type : String,
        trim : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    photo : {
        type : String
    },
    isVerify : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
});

export default mongoose.model('User', userSchema);