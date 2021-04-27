const express = require('express');
const City = require('./models/city.js');
const User = require('./models/user.js')
const Simulator = require('./machines/simulator.js');


const playerRouter = express.Router();

const sim = new Simulator();


const checkCity = (req, res, next) => {
    console.log(req.session)
    if(req.session.cityID) {
        if(req.session.cityID=="") res.render('city/welcome')
        else next();
    }
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
                        res.render('city/welcome');
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
        User.findById(req.session.userid, async (error, result)=>{
            if(error) {
                console.log(error);
                res.send('Error founding city.')
            }
            else if(!result) {
                console.log("user not found");
                res.send('Are you sure you are logged in?');
            }
            else {
                await c.save();
                req.session.cityID = c._id;
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