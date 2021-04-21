const express = require('express');
const exampleCity = require('./example.js').sampleCity;
const {User, City} = require('./models.js');
const Simulator = require('./simulator.js');


const playerRouter = express.Router();

const sim = new Simulator();


const checkCity = (req, res, next) => {
    if(req.session.cityID && req.session.cityID!="") next();
    else res.render('city/welcome');
}

playerRouter.get('/', checkCity, (req,res)=>{
    City.findById(req.session.cityID, (error, result)=>{
        if(error) {
            res.send('There was an error loading your city.  Please contact site administrators.')
        }
        else if(!result) {
            User.findById(req.session.userid, async (error,result)=>{
                if(error||!result) {
                    req.session.destroy();
                    res.redirect('/');
                }
                else {
                    try {
                        result.city = "";
                        await result.save();
                        res.redirect('/');
                    }
                    catch(e) {
                        res.status(500).send('Unexplained error.');
                    }
                }
            })
        }
        else res.render('city/city', {city: result});
    })
});

playerRouter.post('/foundation', async (req,res) => {
    console.log(req.session)
    try {
        let c = new City(req.body);
        sim.setUpCity(c);
        if(!c.mayor) c.mayor = req.session.username;
        await c.save();
        req.session.cityID = c._id;
        User.findById(req.session.userid, (error, result)=>{
            if(error) {
                console.log(error);
                res.send('Error founding city.')
            }
            else if(!result) {
                console.log("user not found");
                res.send('Are you sure you are logged in?');
            }
            else {
                result.city = c._id
                result.save();
                res.redirect('/home/')
            }
        });
    }
    catch(e) {
        res.send('That name\'s taken!');
        console.log(e);
    }
});

playerRouter.get('/examinedistrict/:coords', checkCity, (req, res)=>{
    City.findById(req.session.cityID, (error, result)=>{
        if(error || !result) res.send('No data.');
        else {
            let coords = req.params.coords.split('_');
            let dist = result.spatial[coords[0]][coords[1]];
            res.render('city/district_detail', {district: dist});
        }
    })
})




module.exports = playerRouter;