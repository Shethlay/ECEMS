const express = require('express')
const router = express.Router();

const pc = require('../controllers/ECEMS.controller')


router.get("/validateUser",pc.validate);

router.get("/getDestinationPage",pc.getDestinationPage);

router.post("/addStudent",pc.addStudent);

router.get("/showEvents",pc.showEvents);;

router.post("/bookEvent",pc.bookEvent);

router.get("/getMyBookings",pc.getMyBookings);

router.delete("/deleteBooking",pc.deleteBooking);

router.get("/fetchNotifications",pc.fetchNotifications);

router.delete("/deleteNotification",pc.deleteNotification);

router.get("/getMyEvents",pc.getMyEvents);

router.delete("/deleteEvent",pc.deleteEvent);

router.post("/addEvent",pc.addEvent);

router.post("/promoteStudent",pc.promoteStudent);

router.post("/demoteStudent",pc.demoteStudent);

router.post("/sendNotification",pc.sendNotification);

router.post("/changePassword",pc.changePassword);


module.exports = router 
