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





























//all the below request goes controller/product.controller file..........................................

/*
router.get('/test',product_controller.test);

router.post('/create',product_controller.create);

router.get('/:id',product_controller.ls);

router.put('/:id/update',product_controller.update);

router.delete('/:id/delete',product_controller.delete);

router.post('/signup',product_controller.signup)

router.post('/login',product_controller.login)

router.get('/',product_controller.index)

*/



module.exports = router 