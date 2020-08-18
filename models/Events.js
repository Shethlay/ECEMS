const mongoose = require('mongoose')
const Schema = mongoose.Schema;


//schema is definded here................................................................................
let eventSchema = new Schema({
		evid: String,
		eventTitle: String,
            eventDescription: String,
            eventType: String,
            eventTypeData: String,
            eventDate:String ,
            eventTime: String,
            organizerId: String,
            organizerName: String,
            participants: [],

})


module.exports = mongoose.model('event',eventSchema)