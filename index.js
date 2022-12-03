require('dotenv').config()
const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const carRouter = require("./routers/car")
const userRouter = require("./routers/user")
const bcrypt = require('bcrypt')
const User = require('./models/user')


const app = express()
const port = process.env.PORT
app.listen(port)

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(express.json())
app.use(carRouter)
app.use(userRouter)

//copy the connection string for your mongodb cluster. The sample_training database contains the Zips collection
const url = process.env.MONGO_URL

//mongodb+srv://amukher1:test1234@cluster0.ynwgm.mongodb.net/travel-app-db?retryWrites=true&w=majority'

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true

},()=>console.log("Connected to DB"))

// app.get('/dashboard', authenticateUser,async (req, res) => {

  
//     res.render('dashboard.ejs',{username:req.user.username})

// })

// async function authenticateUser(req,res,next){
//     if(!req.session.user_id){
//         console.log("Unauthorized user")
//         return res.json({message})
//     }
//     else{
//         try {
//             const user = await User.findById(req.session.user_id)
//             req.user = user
//             next()
//         }
//         catch(e){
//             res.json({message:e})
//         }
        
//     }
// }

app.post('/login', async (req, res) => {

    let username = req.body.username
    let password = req.body.password
    
    if(username!="" || password != ""){
    //step 1
    const user = await User.findOne({username: username})
    if (!user) {
        res.json({message:'User not found. Incorrect Username'})
    }
    //step 2
    const isMatch = await bcrypt.compare(password,user.password)

    //step 3
    console.log(isMatch)
    if (isMatch){
        //req.session.user_id = user._id
        res.send(user)
    }
    else
        res.json({message:'Error Incorrect Password'})
}
else{
    res.json({message:'Invalid Username or Password'})
}


})

