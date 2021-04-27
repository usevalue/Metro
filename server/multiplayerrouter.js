const express = require('express');
const City = require('./models/city');
const {Message} = require('./models/economymodels.js')

const router = express.Router();

// Diplomacy options only become available once you set up your city.

router.use((req, res, next) => {
    if(req.session.cityID) next();
    else res.redirect('/home/');
})

//  List the cities in the world.

router.get('/', (req, res) => {
    City.find({}, (error, result)=>{
        if(error) res.redirect('/');
        else res.render('diplomacy/world', {world: result});
    })
});

//  View the embassy of a specific city

router.get('/embassy/:name/', (req, res)=>{
    City.findOne({name: req.params.name}, (error, result)=>{
        if(error) res.status(500).send("Uh oh.");
        else if(!result) res.status(404).send("No such city.");
        else {
            console.log(result);
            res.render('diplomacy/embassy', {city: result});
        }
    });
})

// Compose a message to a city

router.get('/writeto/:name/', async (req, res)=>{
    try {
        let s = await City.findById(req.session.cityID)
        let r = await City.findOne({name: req.params.name});
        console.log(s.name + " is writing to " +r.name);
        res.render('diplomacy/messagewriter', {sender: s, recipient: r});
    }
    catch(e) {
        console.log(e);
    }
})

// Send said message

router.post('/writeto/:name/sendmessage',  async (req, res) => {
    let m = new Message(req.body);
    try {
        await m.save();
        res.redirect('/cities/mailbox/');
    }
    catch(e) {
        res.send('Error sending mail.');
        console.log(e);
    }
})


// Read messages

router.get('/mailbox/', (req, res)=>{
    res.render('diplomacy/mailbox');
})

router.get('/mailbox/inbox', (req, res)=>{
    Message.find({to: req.session.cityID}, (error, result)=>{
        if(error) {
            console.log("Error getting inbox for this player:");
            console.log(req.session);
            res.status(500).send('Error fetching mailbox.');
        }
        else res.send(result);
    })
})

router.get('/mailbox/sentmail', (req,res)=>{
    Message.find({from: req.session.cityID}, (error, result)=>{
        if(error) {
            console.log("Error getting outbox for this player:");
            console.log(req.session);
            res.status(500).send('Error fetching mailbox.');
        }
        else res.send(result);
    })
})

router.get('/mailbox/m/:id/', (req, res)=>{
    Message.findById(req.params.id, (error, result)=>{
        if(error) {
            res.send('Could not retrieve your email.')
        }
        else if (!result) {
            res.send('That email is missing!  Did it get deleted?  Did it ever even exist...?');
        }
        else {
            let parsed = result.message.replace(/\r\n|\r|\n/g,"<br />");
            result.parsedbody = parsed;
            res.render('diplomacy/messagereader', {message: result})
        }
    });
})


//  Trade functions

router.get('/goods/:name', async (req, res) => {
    try {
        let cityname=req.params.name;
        let city = await City.findOne({name: cityname});
        let response = {
            cash: city.cash,
            goods: city.reserves
        }
        res.send(response)
    }
    catch(e) {
        res.status(500).send("There was an error.")
    }
})

module.exports = router;