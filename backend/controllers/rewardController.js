const User = require("../models/User")

exports.getRewards = async (req,res)=>{

 try{

 const user = await User.findById(req.user.id)

 res.json({
   points:user.points,
   totalReports:user.totalReports
 })

 }
 catch(err){
   res.status(500).json(err)
 }

}