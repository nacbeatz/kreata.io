const jwt = require("jsonwebtoken");

const generateTokenAndSetCookies = (res, user ) =>{

    
    const token = jwt.sign(
        {id:user._id, role:user.role},
        process.env.JWT_SECRET,
        {expiresIn: "1h"});

        
    res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict", // Protect from csrf attack
        maxAge: 7 * 24 * 60 * 60 * 10000, // 7 days
    });
    res.cookie("userData", user, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict", // Protect from csrf attack
        maxAge: 7 * 24 * 60 * 60 * 10000, // 7 days
    });
return token;
}

module.exports =  generateTokenAndSetCookies;