const event = require('../models/Events')
const organizer = require('../models/Organizer')
const people = require('../models/People')
const student = require('../models/Students')
const uuid = require('uuid');
var crypto = require('crypto');



exports.validate = function(req,res){
	try{
		const id = req.query.id.toString();
	    const passwd = req.query.passwd.toString();
	    
	    people.findOne({'id':id},function(err,peoples){
			if(err){
				console.log(err)
				return res.send(false)
			}
			if(!people){
				return res.send(false)
			}
			if(passwd == Decrypt(peoples.password,id)){
				return res.send(true)
			}else{
				return res.send(false)
			}
		})
	}
	catch(err){
		 res.send(false)
	}
}



exports.getDestinationPage = function(req,res){
	 
	try{
		const id = req.query.id.toString();

		people.findOne({'id':id}, function(err,peoples) {
		 	if(err){
		 		return res.send(false)
		 	}
		 	if(!peoples){
		 		return res.send(false)
		 	}
		 	return res.send({
		 		name: peoples.name,
		 		Designation: peoples.Designation
		 	})
		})
	}
	catch(err){
		res.send(false)
	}
}



exports.addStudent = function(req,res){

	try{
		people.find({'id':req.body.data.id.toString()},function(err,data){
	    	if(err){
	    		console.log(err)
	    		return res.send(false);
	    	}
	    	if(!data.length){
	    		let stud = new student({
					id : req.body.data.id.toString(),
			        name : req.body.data.name.toString(),
			        notifications: [],
			    	bookedEvents: []
			    })

			    let peo = new people({
			    	id : req.body.data.id.toString(),
			    	name: req.body.data.name.toString(),
			        password: getHash(req.body.data.password.toString(),req.body.data.id.toString()),
			        Designation: 1,
			    })

				stud.save(function(err){
					if(err){
						console.log(err)
						return res.send(false)
					}
					console.log('new student added')
				})

				peo.save(function(err){
					if(err){
						console.log(err)
						return res.send(false)
					}
					console.log('new people added')
				})
				return res.send(true)
	    	}
	    	else{
	    		return res.send(false)
	    	}
	    })
    }
	catch(err){
		res.send(false)
	}
}



exports.showEvents = function(req,res){

	try{
		event.find({},function(err,data){
			if(err){
				console.log(err)
				return res.send(false)
			}
			return res.send(data)
		})
	}
	catch(err){
		res.send(false)
	}
}



exports.getMyBookings = function(req,res){

	try{
		var id = req.query.id.toString();

		people.findOne({'id':id},function(err,data){
			if(err){
				console.log(err)
				return res.send(false)
			}
			else if(!data){
				return res.send(false)
			}
			else if(data.Designation == 1){
				student.findOne({'id':id},function(err,doc){
					if(err){
						console.log(err)
						return res.send(false)
					}
					event.find({'evid':{$in:doc.bookedEvents}},function(err,docc){
						if(err){
							console.log(err)
							return res.send(false)
						}
						if(!docc){
							return res.send([])
						}
						return res.send(docc)
					})
				})
			}
			else if(data.Designation == 2){
				organizer.findOne({'id':id},function(err,doc){
					if(err){
						console.log(err)
						return res.send(false)
					}
					event.find({'evid':{$in:doc.bookedEvents}},function(err,docc){
						if(err){
							console.log(err)
							return res.send(false)
						}
						if(!docc){
							return res.send([])
						}
						return res.send(docc)
					})
				})
			}
		})
	}
	catch(err){
		res.send(false)
	}
}



exports.deleteBooking = function(req,res){

	try{
	var id = req.body.data.id.toString();
    var evid = req.body.data.evid.toString();

    people.findOne({'id':id},function(err,data){
 		if(err){
 			console.log(err)
 			return res.send(false)
 		}

 		event.findOneAndUpdate({'evid':evid},{$pull:{'participants':{'id':id}}},function(err,data){
 			if(err) console.log(err)

 		})

 		if(!data){
 			return res.send(false)
 		}
 		else if(data.Designation == 1){
 			student.findOneAndUpdate({'id':id},{$pull:{'bookedEvents':evid}},{$push:{'notifications':uuid.v4(),'message':'your booking cancel'}},function(err,doc){
 				if(err){ 
 					console.log(err)
 					return res.send(false)
 				}
 				return res.send(true)
 			})
 			
 		}
 		else if(data.Designation == 2){
 			organizer.findOneAndUpdate({'id':id},{$pull:{'bookedEvents':evid}},{$push:{'notifications':uuid.v4(),'message':'your booking cancel'}},function(err,doc){
 				if(err){ 
 					console.log(err)
 					return res.send(false)
 				}
 				return res.send(true)
 			})
 		}
 	})
 	}
    catch(err){
		res.send(false)
	}	
}



exports.bookEvent = function(req,res){

	try{
	 	const id = req.body.data.id.toString();
	 	const evid = req.body.data.evid.toString();

	 	people.findOne({'id':id},function(err,data){
	 		if(err){
	 			console.log(err)
	 			return res.send(false)
	 		}
	 		else if(!data){
	 			return res.send(false)
	 		}
	 		else if(data.Designation == 1){

	 			event.findOneAndUpdate({'evid':evid},{$push: {participants:{id}}},function(err,doc){
	 				if(err){
	 					console.log(err);
	 					return res.send(false)
	 				}
	 				student.findOneAndUpdate({'id':id},{$push:{'notifications':{'nid':uuid.v4(),'message':`Thank you for participating in our event:${doc.eventTitle}. We look forward to your presence!`},'bookedEvents':evid}},function(err,resu){
	 					if(err){
	 						console.log(err)
	 						return res.send(false)
	 					}
	 				})
	 				return res.send(true)
	 			})
	 		}
	 		else if(data.Designation == 2){

	 			event.findOneAndUpdate({'evid':evid},{$push: {participants:{id}}},function(err,doc){
	 				if(err){
	 					console.log(err);
	 					return res.send(false)
	 				}
	 				organizer.findOneAndUpdate({'id':id},{$push:{'notifications':{'nid':uuid.v4(),'message':`Thank you for participating in our event:${doc.eventTitle}. We look forward to your presence!`},'bookedEvents':evid}},function(err,resu){
	 					if(err){
	 						console.log(err)
	 						return res.send(false)
	 					}
	 				})
	 				return res.send(true)
	 			})
	 		}
	 	})
 	}
 	catch(err){	
		res.send(false)
	}	
}



exports.fetchNotifications = function(req,res){
	
	try{
		var id = req.query.id.toString();
		people.findOne({'id':id},function(err,data){
			if(err){
				console.log(err)
				return res.send(false)
			}
			if(!data){
				return res.send(false)
			}
			if(data.Designation == 1){
				student.findOne({'id':id},function(err,docc){
					if(err){
						console.log(err)
						res.send(false)
					}
					if(!docc){
						return res.send(false)
					}
					return res.send(docc.notifications)
				})
			}
			if(data.Designation == 2){
				organizer.findOne({'id':id},function(err,doccc){
					if(err){
						console.log(err)
						return res.send(false)
					}
					if(!doccc){
						return res.send(false)
					}
					return res.send(doccc.notifications)
				})
			}
		})
	}
	catch(err){
		res.send(false)
	}
}



exports.deleteNotification = function(req,res){
	
	try{
        var id = req.body.data.id.toString();
        var nid = req.body.data.nid.toString();

        people.findOne({'id':id},function(err,data){
			if(err){
				console.log(err)
				return res.send(false)
			}
			else if(!data){
				return res.send(false)
			}
			else if(data.Designation == 1){
				student.findOneAndUpdate({'id':id},{$pull:{'notifications':{'nid':nid}}},function(err,docc){
					if(err){
						console.log(err)
						res.send(false)
					}
					var isElement = docc.notifications.find( nidValue => nidValue.nid == nid )
					if(isElement){
						return res.send(true)
					}
					else{
						return res.send(false)
					}
				})

			}
			else if(data.Designation == 2){
				organizer.findOneAndUpdate({'id':id},{$pull:{'notifications':{'nid':nid}}},function(err,docc){
					if(err){
						console.log(err)
						return res.send(false)
					}
					var isElement = docc.notifications.find( nidValue => nidValue.nid == nid )
					if(isElement){
						return res.send(true)
					}else
					{
						return res.send(false)
					}
				})
			}
		})
    }
    catch(err){
    	res.send(false)
    }
}



exports.getMyEvents = function(req,res){

	try{
	 	var id = req.query.id.toString();

	 	organizer.findOne({'id':id},function(err,data){
	 		if(err){
	 			console.log(err)
	 			return res.send(false)
	 		}
	 		if(!data){
	 			return res.send(false)
	 		}
	 		event.find({'evid':{$in:data.myevent}},function(err,docc){
	 			if(err){
	 				console.log(err)
	 				return res.send(false)
	 			}
	 			if(!docc.length){
	 				return res.send([])
	 			}
	 			return res.send(docc)
	 		})
	 	})
	}
	catch(err){
		res.send(false)
	}
}



exports.deleteEvent = function(req,res){

	try{
        var id = req.body.data.id.toString();
        var evid = req.body.data.evid.toString();
    
        organizer.findOneAndUpdate({'id':id},{$pull:{'myevent':evid}},function(err,data){
        	if(err){
        		console.log(err)
        		return res.send(false)
        	}
        	if(!data){
        		return res.send(false)
        	}
        		
        	event.findOneAndRemove({'evid':evid},function(err,docc){
        		if(err){
        			console.log(err)
        			return res.send(false)
        		}
        		if(!docc){
        			return res.send(false)
        		}
        		for(var i = docc.participants.length-1;i>=0;i--){
		        	(async () =>{
		        		
		        		var pep = await people.find({'id':docc.participants[i].id})
		        		console.log(pep)
		        		if(pep[0].Designation == 1){
		        			await student.findOneAndUpdate({'id':pep[0].id},{$push:{'notifications':{'nid':uuid.v4(),'message':`event cancelled ${docc.eventTitle}`}}});
		        			await student.findOneAndUpdate({'id':pep[0].id},{$pull:{'bookedEvents':evid}})	;
		        		}
		        		if(pep[0].Designation == 2){
		        			await organizer.findOneAndUpdate({'id':pep[0].id},{$push:{'notifications':{'nid':uuid.v4(),'message':`event cancelled ${docc.eventTitle}`}}});
		        			await organizer.findOneAndUpdate({'id':pep[0].id},{$pull:{'bookedEvents':evid}});
		        		}
		        	})();	
	        	}
	        	
        		return res.send(true)
        	})
        })

    }
    catch(err){
    	res.send(false)
    }
	
}



exports.addEvent = function(req,res){

	try{
		const organizerId= req.query.id.toString();
        const organizerName= req.query.name.toString();
        const eventType = req.query.eType.toString();
        const data= req.body.data;
        const evid = uuid.v4().toString()
        let ev = new event({
			evid: evid,
			eventTitle: data.eventTitle,
            eventDescription:data.eventDesc,
            eventType:eventType,
            eventTypeData:data.eventTypeData,
            eventDate:data.eventDate,
            eventTime:data.eventTime,
            organizerId:organizerId,
            organizerName:organizerName,
            participants: []
		    })

       	organizer.findOneAndUpdate({'id':organizerId},{$push:{'myevent':evid}},function(err,data){
        	if(err){
        		console.log(err)
        		return res.send(false)
        	}
        	if(!data){
        		return res.send(false)
        	}
        	
        	ev.save(function(err){
        		if(err){
        			console.log(err)
        			return res.send(false)
        		}
        		return res.send(true)
        	})
        })
    }
    catch(err){
		res.send(false)
	}
}



exports.promoteStudent = async function(req,res){
	
	try{
		var id = req.body.data.id;

		const data =  await student.findOneAndRemove({'id':id})
		if(data == null){
			return res.send(false)
		}

		let or = new organizer({
			id: data.id,
	    	name : data.name,
	    	myevent : [],
	    	notifications: data.notifications,
	    	bookedEvents: data.bookedEvents
		})

		or.save(function(err){
			if(err){
				console.log(err)
				return res.send(false)
			}	
			
			people.findOneAndUpdate({'id':id},{'Designation':2},function(err,doc){
	 			if(err){
	 				console.log(err);
	 				return res.send(false)
	 			}
	 			organizer.findOneAndUpdate({'id':id},{$push:{'notifications':{'nid':uuid.v4(),'message':'congratulation you are promoted to organizer'}}},function(err,resu){
	 				if(err){
	 					console.log(err)
	 					return res.send(false)
	 				}
	 				return res.send(true)
	 			})
			})	
		})	
	}
	catch(err){
		res.send(false)
	}
}



exports.demoteStudent = async function(req,res){

	try{
		var id = req.body.data.id.toString();

		var data =  await organizer.findOneAndRemove({'id':id})
		if(data == null){
			return res.send(false)
		}

		for(var j = data.myevent.length-1;j>=0;j--){

			event.findOneAndRemove({'evid':data.myevent[j]},function(err,docc){
        		if(err){
        			console.log(err)
        			return res.send(false)
        		}
        		if(!docc){
        			return res.send(false)
        		}
        		for(var i = docc.participants.length-1;i>=0;i--){
		        	(async () =>{
		        		var pep = await people.find({'id':docc.participants[i].id})
		        		if(pep[0].Designation == 1){
		        			await student.findOneAndUpdate({'id':pep[0].id},{$push:{'notifications':{'nid':uuid.v4(),'message':`event cancelled ${docc.eventTitle}`}}});
		        		}
		        		if(pep[0].Designation == 2){
		        			await organizer.findOneAndUpdate({'id':pep[0].id},{$push:{'notifications':{'nid':uuid.v4(),'message':`event cancelled ${docc.eventTitle}`}}});
		        		}
		        	})();	
	        	}
        	})
		}

		var st = new student({
			id: data.id,
	    	name : data.name,
	    	notifications: data.notifications,
	    	bookedEvents: data.bookedEvents
		})

		st.save(function(err){
			if(err){
				console.log(err)
				return res.send(false)
			}	
			people.findOneAndUpdate({'id':id},{'Designation':1},function(err,doc){
	 			if(err){
	 				console.log(err);
	 				return res.send(false)
	 			}
	 			student.findOneAndUpdate({'id':id},{$push:{'notifications':{'nid':uuid.v4(),'message':'you are demoted'}}},function(err,resu){
	 				if(err)
	 				{
	 					console.log(err)
	 					return res.send(false)
	 				}
	 			})
			})	
		})
		return res.send(true)
	}
	catch(err){
		res.send(false)
	}	
}



exports.sendNotification = function(req,res){

	try{
		var id = req.body.data.id.toString();
    	var msg = req.body.data.msg.toString();

    	 people.findOneAndUpdate({'id':id},{'Designation':1},function(err,data){
    	 	if(err){
				console.log(err)
				return res.send(false)
			}
			if(!data){
				return res.send(false)
			}
			if(data.Designation==1){
				student.findOneAndUpdate({'id':id},{$push:{'notifications':{'nid':uuid.v4(),'message':msg}}},function(err,resu)
	 				{
	 					if(err)
	 					{
	 						console.log(err)
	 						return res.send(false)
	 					}
	 					return res.send(true)
	 				})

			}
			if(data.Designation==2){
				organizer.findOneAndUpdate({'id':id},{$push:{'notifications':{'nid':uuid.v4(),'message':msg}}},function(err,resu)
	 				{
	 					if(err)
	 					{
	 						console.log(err)
	 						return res.send(false)
	 					}
	 					return res.send(true)
	 				})

			}
    	 })
	}catch(err){
		console.log(err)
		res.send(false)
	}
}



exports.changePassword = function(req,res){
	
	try{
		var id = req.query.id.toString();
	    var currPasswd = req.body.data.currPasswd.toString();
	    var newPasswd = getHash(req.body.data.newPasswd.toString(),id);

	    people.findOne({'id':id},function(err,data){
	    	if(err){
	    		console.log(err)
	    		return res.send(false)
	    	}
	    	if(!data){
	    		return res.send(false)
	    	}
	    	if(Decrypt(data.password,id) == currPasswd)
	    	{
	    		people.findOneAndUpdate({'id':id},{$set:{'password':newPasswd}},function(err,data){
	    			if(err){
	    				consolo.log(err)
	    				res.send(false)
	    			}
	    			return res.send(true)
	    		})
	    	}else{
	    		return res.send(false)
	    	}
	    })
	}
	catch(err){
		res.send(false)
	}
}



//encrypt
var getHash = ( pass , id ) => {
					
    var cipher = crypto.createCipher('aes-256-ctr',id)
    var crypted = cipher.update(pass,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}



//decrypt
var Decrypt = (pass, id)=>{
	
	var decipher = crypto.createDecipher('aes-256-ctr',id)
   	var dec = decipher.update(pass,'hex','utf8')
   	dec += decipher.final('utf8');
   	return dec;
}
