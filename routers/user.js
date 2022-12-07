const express = require("express")

const User = require("../models/user")
const Post = require('../models/car')
const bcrypt = require('bcrypt')
const router = new express.Router()

const request = require('request')

router.post('/register', async (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let email  = req.body.email
    

    try {
        password = await bcrypt.hash(password,8)
        const user = new User({username,email,password})
        const u = await user.save()
        res.json({message:'Successful Registration'})
    
    
        
    } catch (e) {
        console.log(e)
        res.json({message:e})
    }
    
})

// router.post('/users/dummy',(req,res)=>{
//     createDummyData()
//     User.find({}).populate('posts').exec((error,result)=>{
//         if(error)
//             res.send({error:error})
//         else
//             res.send(result)
//     })
// })

// router.post('/users',(req,res)=>{
//     const u = new User(req.body)
//     u.save((error,response)=>{
//         if(error)
//                 res.send({error:error})
//                 else{
//                     console.log(response)
                   
//                     res.send(response)
//                 }
//     })
// })

router.get('/users/:id',(req,res)=>{
    
    User.findById(req.params.id).populate('cars').exec((error,user)=>{
        if(error)
            res.send({error:error})
        else{
            
            console.log(user)
            res.json({message:user})
        }
    })
})



router.get('/users',(req,res)=>{
    
    User.find({}).populate('cars').exec((error,users)=>{
        if(error)
            res.send({error:error})
        else{
            let allusers=[]
            for (let user of users){
                const u = user.toObject()
                u.cars = u.cars
                allusers.push(u)
            }
            res.send({users:allusers})
            
           

        }
    })
})

//getLocation('5271 Swan Creek Rd, Saginaw Mi,48609',onResult)

function getLocation(location_name,cb){
    const geoPrefix='https://api.mapbox.com/geocoding/v5/mapbox.places/'
    const address=location_name
    const 
geoKey='pk.eyJ1IjoiY2VwYXJrZXIiLCJhIjoiY2t6cHN2bnAyMnBsMTJ2czh2aDJ4bmVvdyJ9.0o93NQMYWFgCb5p0oSfn_g'
    const geoURL = geoPrefix+address+'.json?access_token='+geoKey
    request({url: geoURL},(error,response)=>{
        if(error){
            console.log(error)
            cb({error:error},undefined)
        }
        else{
            const data = JSON.parse(response.body)
            console.log(data)
            if(!data.features){
                console.log("Invalid Location.")
                cb({error:'Invalid Location'},undefined)
            }
            else{
                const lat=data.features[0].center[1]
                const lon=data.features[0].center[0]
                const name = data.features[0].place_name
                console.log('Place : '+ name+' Lat : '+ lat+' Long : '+lon)
                cb(undefined,{name:name,lat:lat,lon:lon})
            }
        }
    })
}

function onResult(error,result){
    if(error)
        console.log(error)
    else
        console.log(result)
}


module.exports=router