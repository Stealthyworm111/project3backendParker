const mongoose = require('mongoose')

const userSchema = new  mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, unique:true}
})

userSchema.virtual('posts',{
    ref:'Post',
    localField:'_id',
    foreignField:'author'
})

userSchema.set('toObject',{virtuals:true})
userSchema.set('toJSON',{virtuals:true})

userSchema.pre('save',function(next){
    console.log(" A new user is beng created in just a moment!")
    next()
})

userSchema.pre('deleteOne',{document: true},function(next){
    console.log("Pre hook is being fired")
    console.log("user is",this)
    next()
})

const User = mongoose.model('User',userSchema,'users')

const u1  = new User({name:"john",email:"j@j.com"})
const u2  = new User({name:"peter",email:"p@p.com"})
const u3  = new User({name:"mary",email:"m@m.com"})

u1.save()
u2.save()
u3.save()


const postSchema  = new mongoose.Schema({
    title:{type:String, required:true},
    description: String,
    imageURL:{type:String, required:true},
    rating:{type:Number,min:0,max:10,default:5},
    lat:{type:Number,min: -90,max:90,required:true},
    lon:{type:Number,min: -180,max:180,required:true},
    dateVisited:{type:Date,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})

const Post = mongoose.model('Post',postSchema,'posts')


//copy the connection string for your mongodb cluster. The sample_training database contains the Zips collection
const url = 'mongodb+srv://amukher1:test1234@cluster0.ynwgm.mongodb.net/travel-app-db?retryWrites=true&w=majority'

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true

},()=>console.log("Connected to DB"))


const p1 = new Post({
    title:"Weekend Trip to the Big Apple",
    description:"Visited the Empire State Building",
    rating:8,
    lat:40.74861116670957,
    lon: -73.98537472313336,
    dateVisited: new Date("05/01/2022"),
    imageURL:"https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
    author:u1.id
})

p1.save()

const p2 = new Post({
    title:"Summer Trip to Las Vegas",
    description:"Fountains of Bellagio",
    rating:7,
    lat:36.113153496516844, 
    lon: -115.17599171768819,
    dateVisited: new Date("07/01/2022"),
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Night_mode_2_Bellagio.jpg",
    author:u2.id


})

p2.save()

const p3 = new Post({
    title:"Hiking in Arizona",
    description:"Grand Canyon National Park",
    rating:10,
    lat:36.06199880326642, 
    lon: -112.10778594184717,
    dateVisited: new Date("06/13/2022"),
    imageURL:"https://upload.wikimedia.org/wikipedia/commons/a/aa/Dawn_on_the_S_rim_of_the_Grand_Canyon_%288645178272%29.jpg",
    author:u3.id

})

p3.save()
