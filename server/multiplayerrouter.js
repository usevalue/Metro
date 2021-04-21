const express = require('express');
const { City } = require('./models');

const router = express.Router();

// Diplomacy options only become available once you set up your city.

const noScrubs = (req, res, next) => {
    if(req.session.cityID) next();
    else res.redirect('/home/');
}

router.use(noScrubs);

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
    catch(e){
        console.log(e);
    }
})

// Post said message

router.post('/writeto/:name/sendmessage',  (req, res) => {
    console.log(req.body);
    res.redirect('/cities/')
})


// Read messages

router.get('/mailbox/', (req, res)=>{
    res.render('diplomacy/mailbox');
})

router.get('/inbox', (req,res)=>{
    res.send('TODO: get inbox contents');
})

router.get('/sent', (req,res)=>{
    res.send('TODO: get sent messages');
})

module.exports = router;