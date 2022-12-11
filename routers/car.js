const express = require("express")
const Car = require("../models/car")
const User = require("../models/user")
const request = require('request')

const router = new express.Router()

// router.get('/posts',(req,res)=>{
//     Post.find({},(error,posts)=>{
//         if(error)
//             res.send({error:error})
//         else{
//             const summary = posts.map(post=> ({_id:post._id,title:post.title}))
//             res.send(summary)
//         }
//     })
// })

// router.get('/posts/search',(req,res)=>{
//     console.log(req.query.q)
//     const query = new RegExp(req.query.q,"i")
//     console.log(query)
//     Post.find( {$or:[{title:query },{description: query}]} ,(error,posts)=>{
//         if(error)
//             res.send({error:error})
//         else{
//             res.send(posts)
//         }
//     })
// })

//router that gets the car based off the id

router.get('/car/:id',(req,res)=>{
    let id = req.params.id
   
    Car.findById(id,(error,car)=>{
        if(error)
            res.send({message:error})
        else{
            res.send({message:car})
        }
    })
})

//router that gets all cars that match search criteria

router.post('/car',(req,res)=>{
    let make = req.body.make
    let model = req.body.model
    let maxMiles = req.body.maxMiles
    let minPrice = req.body.minPrice
    let maxPrice = req.body.maxPrice

    //if not provided then make it blank so it doesnt cause in error

    if(make == undefined){
        make = ""
    }
    if(model == undefined){
        model = ""
    }
    if(maxMiles == undefined){
        maxMiles = ""
    }
    if(minPrice == undefined){
        minPrice = ""
    }
    if(maxPrice == undefined){
        maxPrice = ""
    }
   //if it is blank then dont filter it of it is filled in then filter the array
    Car.find((error,cars)=>{
        let allCars=[] = cars
        if(error)
            res.send({message:error})
        else{
            if(make != "")
                allCars = allCars.filter(car =>car.make.equalsIgnoreCase(make))
            if(model != "")
                allCars = allCars.filter(car =>car.model.equalsIgnoreCase(model))
            if(maxMiles != "")
                allCars = allCars.filter(car =>car.miles <maxMiles)
            if(minPrice != "")
                allCars = allCars.filter(car =>car.price >minPrice)
            if(maxPrice != "")
                allCars = allCars.filter(car =>car.price <maxPrice)
            
            }
        res.send({cars:allCars})
    })
})

//router that edits car with new information provided

router.post('/editcar/:Userid/:Carid' ,authenticateUser, async (req, res) => {
    const re = /^([A-Z]|[a-z]|[0-9])/    
    let model = req.body.model
    let make = req.body.make
    let miles = req.body.miles
    let description = req.body.description
    let imageURL = req.body.imageURL
    let ownerAddress = req.body.ownerAddress
    let price = req.body.price
    if(re.test(ownerAddress)==false)
        res.send({error:"invalid location"})
    getGeo(ownerAddress,(error,resLoc)=>{
                if (resLoc.error){
                    res.send({error:'invalid location'})
                    return
                }
                else{
                    let ownerCoordinate = resLoc.message
                    Car.findByIdAndUpdate(req.params.Carid,{'make':make,'model':model,'miles':miles,'description':description,'imageURL':imageURL,'ownerAddress':ownerAddress,'ownerCoordinate':ownerCoordinate,'price':price},{ returnDocument: 'after' },(error,user)=>{
                        if(error)
                            res.send({error:error})
                        else{
                                res.send({message:user})
                            }
                    })
                }
            })
})

//rotuer that lists the car by finding coordinates. Address must start with number of letter

router.post('/listcar/:id', authenticateUser,async (req, res) => {
    const re = /^([A-Z]|[a-z]|[0-9])/    
    let model = req.body.model
    let make = req.body.make
    let miles = req.body.miles
    let description = req.body.description
    let imageURL = req.body.imageURL
    let ownerAddress = req.body.ownerAddress
    let owner = req.params.id
    let price = req.body.price
    if(re.test(ownerAddress)==true){
    //gets coords for map
    getGeo(ownerAddress,(error,resLoc)=>{
        if (error){
            res.send(err)
            return
        }
        else{
            if (resLoc.error){
                res.send({error:'invalid location'})
                return
            }
            else
            {
            let ownerCoordinate = resLoc.message
            if(model != "" && make != "" && miles != "" && description != "" && imageURL != "" && ownerAddress != "" && ownerCoordinate !=""&& owner!= ""&&price !=""){
                let c = new Car({make,model,miles,price,description,imageURL,ownerAddress,ownerCoordinate,owner})
            c.save((error,result)=>{
                if(error)
                res.json({error:error})
                else
                     res.json({message:result})
            
            })
         }
         else
            res.json({message:"Invalid Data"})
            return
        }
    }

    })
}
else
    res.json({message:'incorrect address'}) 
   
})

//router that deletes cars
router.delete('/cars/:id',authenticateUser2,(req,res)=>{
    Car.findByIdAndDelete(req.params.id,(error,response)=>{
        if(error)
            res.send({error:error})
        else{
            if(response)
                res.json({message:"Car "+req.params.id+" was succesfully deleted."})
            else
            res.json({message:"Car "+req.params.id+" could not be located."})
        }
    })
})


// router.put('/posts/:id',(req,res)=>{
//     console.log(req.query)

//     Post.findById(req.params.id,(error,post)=>{
//         if(error)
//             res.send({error:error})
//         else{
//             if(post){
                
//                 for (k in req.query)
//                     post[k] = req.query[k]
//                 post.save((error,response)=>{
//                     if(error)
//                         res.send({error:"Error updating post "+req.params.id})
//                     else
//                         res.send({msg:"Post "+req.params.id+" was succesfully updated."})
//                 })
//             }
//             else
//                 res.send({msg:"Post "+req.params.id+" could not be located."})
//         }
//     })

// })

function getGeo(name, cb){
    const geoPrefix='https://api.mapbox.com/geocoding/v5/mapbox.places/'
    const address=name
    const geoKey='pk.eyJ1IjoiY2VwYXJrZXIiLCJhIjoiY2t6cHN2bnAyMnBsMTJ2czh2aDJ4bmVvdyJ9.0o93NQMYWFgCb5p0oSfn_g'
    const geoURL = geoPrefix+address+'.json?access_token='+geoKey
    request({url: geoURL},(error,response)=>{
        let data1 = JSON.parse(response.body)
        if(data1.features.length == 0)
            cb(undefined,{error:'invalid location'})
        else{
        const data = JSON.parse(response.body)
        const lat=data.features[0].center[1]
        const lon=data.features[0].center[0]
        const name = data.features[0].place_name
        //console.log('Place : '+ name+' Lat : '+ lat+' Long : '+lon)
        cb(undefined,{message:lat + ',' + lon})
        }
    })
}

String.prototype.equalsIgnoreCase = function (compareString) { return this.toString().toUpperCase() === compareString.toString().toUpperCase(); 
}; 
async function authenticateUser(req,res,next){
    {
        try {
            const user = await User.findById(req.body.auth)
            req.user = user
            if(req.user != undefined)
            next()
            else{
            return res.send('Unauthorized User')}
        }
        catch(e){
            if(e.name =='CastError'){
                res.send('Unauthorized User')
            }
        }
        
    }
}

async function authenticateUser2(req,res,next){
    {
        try {
            const user = await User.findById(req.query.auth)
            req.user = user
            if(req.user != undefined)
            next()
            else{
            return res.send('Unauthorized User')}
        }
        catch(e){
            if(e.name =='CastError'){
                res.send('Unauthorized User')
            }
        }
        
    }
}

module.exports = router