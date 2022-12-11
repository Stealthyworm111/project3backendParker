//simple schema for the car.js
const mongoose = require('mongoose')
const carSchema  = new mongoose.Schema({
    make:{type:String, required:true},
    model:{type:String, required:true},
    miles:{type:Number, required:true},
    price:{type:Number, required:true},
    description: {type:String,required:true},
    imageURL:{type:String,required:true},
    ownerAddress:{type:String, required:true},
    ownerCoordinate:{type:String},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})

const Car = mongoose.model('Car',carSchema,'cars')
module.exports = Car