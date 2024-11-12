const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const generateTokenAndSetCookies = require('../utils/generateTokenAndSetCookies')

const register = async (req, res) => {
    try {
        const { username, password, role, name, email } = req.body;

        if (!username || !password || !role  || !name || !email) {
            return res.status(400).json({ message: 'All fields are required' }); //throw new Error()
        }
const userAlreadyExists = await User.findOne({email});
if(userAlreadyExists){
    return res.status(400).json({success: false, essage: "User already exists"});
}
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(1000000 + Math.random() * 900000).toString();;
        const newUser = new User({
             username, 
             password: hashedPassword, 
             email,
             role,
             name, 
             verificationToken,
             verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
              });
        await newUser.save();
        generateTokenAndSetCookies(res, user._id);

        res.status(201).json({ 
            success: true, 
            message: `User ${username} is registered`, 
            user: {
                ...user._doc,  // sending all info we saved about the user
                password: undefined, //sending null for password just for security
            } 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `User ${req.body.username} can't be registered`, error: err.message });
    }
};



const login = async(req,res) => {

try{
    const { username, password } = req.body;
    const user = await User.findOne({username});
    
    if(!user){
    return res.status(404).json({message: 'User not Found'})
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: 'Wrong Password'});
    }
    
const token = jwt.sign(
    {id:user._id, role:user.role},
    process.env.JWT_SECRET,
    {expiresIn: "1h"}
)

res.status(200).json({token:token})

}catch(err){
    res.status(500).json({message:`Something went wrong`});
}
};

module.exports = {register, login};