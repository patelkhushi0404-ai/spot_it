const Query = require("../models/Query")

exports.createQuery = async (req,res)=>{

 try{

 const {subject,message} = req.body

 const query = await Query.create({
   userId:req.user.id,
   subject,
   message
 })

 res.json(query)

 }
 catch(err){
   res.status(500).json(err)
 }

}

exports.getUserQueries = async (req,res)=>{

 try{

 const queries = await Query.find({userId:req.user.id})
 .sort({createdAt:-1})

 res.json(queries)

 }
 catch(err){
   res.status(500).json(err)
 }

}