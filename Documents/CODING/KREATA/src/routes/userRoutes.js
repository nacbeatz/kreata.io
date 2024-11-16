const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const router = express.Router();

router.get('/admin', verifyToken, authorizeRoles("admin"), (req,res) =>{
res.json({message:"Welcome Admin"});
})

router.get('/creator',verifyToken, authorizeRoles("admin", "creator"), (req,res) =>{
    res.json({message:"Welcome Creator"});
    })


router.get('/test', (req,res) =>{
            res.json({message:"Welcome Tester"});
            })
    

        module.exports = router;
