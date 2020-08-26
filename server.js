// import all the require dependencies................................................................... 
const express = require('express')
const ECEMS = require('./routes/ECEMS.route')
const mongoose = require('mongoose')


//connect to the mongodb database........................................................................
mongoose.connect('mongodb://localhost:27017/mydbase',{useNewUrlParser: true, useUnifiedTopology: true })
var db = mongoose.connection
db.on('error',console.error.bind(console,'error'))


const app = express()


//to parse the incoming request or url body..............................................................
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 


//it's goes to routes/ECEMS.route folder...............................................................
app.use('/',ECEMS)


//port where our app listen..............................................................................
let port = 8081
app.listen(port,function(){
	console.log('server is running on port no:',port)
})

