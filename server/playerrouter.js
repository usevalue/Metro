const express = require('express');
const exampleCity = require('./example.js').sampleCity;
const {User, City} = require('./models.js');
const Simulator = require('./simulator.js');


const playerRouter = express.Router();

const sim = new Simulator();

sim.income();


// Debugging
playerRouter.use((req, res, next)=>{
    console.log(req.originalUrl);
    next();
})

// Authentication
const authenticated = (req, res, next) => {
    if(req.session.isauthenticated) next();
    else res.redirect('/');
}

playerRouter.use(authenticated);

const getCity = (req, res, next)=>{
    if(req.session.city) next();
    else if(req.session.cityID) {
        City.findById(req.session.cityID, (error, result) => {
            if(error || !result) {
                res.render('welcome');
            }
            else {
                req.session.city = result;
                next();
            }
        })
    }
    else {
        res.render('welcome');
    }
}

playerRouter.get('/', getCity, (req,res)=>{
    res.render('city', {city: req.session.city});
});

playerRouter.post('/foundation', async (req,res) => {
    try {
        let c = new City({name: req.body.cityname});
        sim.setUpCity(c);
        await c.save();
        User.findById(req.session.userid, (error, result)=>{
            if(error) {
                console.log(error);
                res.send('There was a problem creating your city.');
            }
            else if(result) {
                result.city = c._id;
                result.save();
                req.session.city = c;
                res.redirect('/home');
            }
            else(res.redirect('/'));
        })
    }
    catch(e) {
        res.send('That name\'s taken!');
        console.log(e);
    }
});

playerRouter.get('/examinedistrict/:coords', (req, res)=>{
    let coords = req.params.coords.split('_');
    let dist = req.session.city.spatial[coords[0]][coords[1]];
    res.render('district_detail', {district: dist});
})




module.exports = playerRouter;