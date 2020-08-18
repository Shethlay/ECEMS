const mongoose = require('mongoose')
const Schema = mongoose.Schema;


//schema is definded here................................................................................
let peopleSchema = new Schema({
	id: String,
	name: String,
	password: String,
	Designation: String
	
})


module.exports = mongoose.model('people',peopleSchema)