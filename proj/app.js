const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 5000
const {MONGOURL} = require('./keys')
require("./models/user")

app.use(express.json())
app.use(require("./routes/auth"))

mongoose.connect(MONGOURL,{
    useNewUrlParser: true ,
    useUnifiedTopology : true
})

mongoose.connection.on('connected',()=>{
    console.log("connect to mongoooo")
})

mongoose.connection.on('error',(err)=>{
    console.log("errror",err)
})

app.listen(PORT,()=>
{
    console.log("server is running",PORT)
})