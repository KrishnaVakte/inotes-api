import User from '../models/User.js'

const fetchuser = async (req,res,next)=>{
    let token = req.header('authtoken');
    if(!token){
        return res.status(400).json({error : "Login required first"})
    }
    try{
        let user = await User.findById(token);
        if(!user){
           return res.status(400).send("User does not exist")
        }
        req.user = user;
        next();
    }
    catch(error){
        res.status(500).send("Internal Server error.")
    }
}

export default fetchuser;