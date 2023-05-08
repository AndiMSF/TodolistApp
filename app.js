const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')
dotenv.config()

// Connect Database
mongoose.set('strictQuery',false)
mongoose.connect('mongodb+srv://'+process.env.DB_USERNAME+':'+process.env.DB_PASSWORD+'@cluster0.vqcsdra.mongodb.net/30Days',{useNewUrlParser:true,useUnifiedTopology:true}, function(err){
  if(err){
    console.log(err);
  } else {
    console.log("Database terhubung");
  }
})

// ====

// Buat Collection Database

const itemSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model('Item', itemSchema)

const item1 = new Item({
    name:"Welcome to, ToDo List!"
})

const item2 = new Item({
    name:"Hit + To Add Item"
})

const defaultItem = [item1,item2]

// ===

// Home Route
app.get('/', function(req,res){

    Item.find({}, function(err,foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItem,function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Default Item Berhasil Ditambahkan!");
                }
            }) 
            res.redirect('/')
        } else {
            res.render('list', {kindOfDay: "Today",todolist:foundItems})
        }
    })
})

app.post('/', function(req,res){
    let itemName = req.body.newItem
    
    const item = new Item({
        name: itemName
    })

    item.save()

    res.redirect('/')
})

app.post('/delete',function(req,res){
    let checkedItem = req.body.checkbox

    Item.findByIdAndRemove(checkedItem,function(err){
        if(!err){
            console.log('Berhasil Delete Item!');
            res.redirect('/')
        }
    })
   
})

app.listen(3000, function(req,res){
    console.log('Server berjalan di port 3000');
})