const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const salt = 10;
const dotenv = require('dotenv');
dotenv.config();

const playerRouter = require('./playerrouter');
const multiRouter = require('./multiplayerrouter');
const { User } = require('./models');

const staticPath = path.join(__dirname, '../client/static/');
const viewPath = path.join(__dirname, '../client/views/');

//
//  General configuration
//

const port = process.env.PORT || 5000;

//
//  Database configuration
//

const dburl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/METRO';

try {
    mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Connected to database.');
    econ = require('./economy.js'); // Launches the economy
}
catch (e) { console.log('There was a problem connnecting to the database server.'); }


mongoose.set('useCreateIndex', true);

//
//  Application setup and middleware
//

const app = express();

app.set('view engine', 'ejs');  // For res.render
app.set('views', viewPath);

app.use(express.urlencoded({extended: true})); // For req.body

// Cookies!
app.use(session({
    name: 'METRO',
    secret: 'breakfast',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000*60*60*24*14
    }
}))


// Debugging
// app.use((req, res, next)=>{
//     console.log(req.originalUrl);
//     next();
// })

//
//  Routing
//

app.use(express.static(staticPath));

// Player-only sections
const authenticated = (req, res, next) => {
    if(req.session.isauthenticated) next();
    else res.redirect('/');
}

app.use('/home/', authenticated, playerRouter);
app.use('/cities/', authenticated, multiRouter);

//
//  Authentication routes
//


app.post('/login', (req, res)=>{
    User.findOne({username: req.body.username}, async (error, result) => {
            if(error) {
                console.log(error);
                res.send('There was an error logging in.');
            }
            else if(!result) {
                res.send('That username isn\'t registered!');
            }
            else {
                console.log(result);
                try {
                    let match = await bcrypt.compare(req.body.password, result.password);
                    if(match) {
                        req.session.isauthenticated="true";
                        req.session.userid = result._id;
                        req.session.username = result.username;
                        req.session.cityID = result.city;
                        res.redirect('/home/');
                    }
                    else res.send('Incorrect password!');
                }
                catch(e) {
                    res.status(500);
                }
            }
        })
    })

app.post('/register', async (req, res)=>{
    try {
        let hash = await bcrypt.hash(req.body.password, salt);
        let newUser = new User({username: req.body.username, password: hash})
        await newUser.save();
        req.session.isauthenticated=true;
        res.redirect('/home/');
    }
    catch(e) {
        console.log(e);
        switch(e.code) {
            case 11000:
                res.send('That username is already registered.');
                break;
            default: 
                res.send('There was an error processing your registration.')
                console.log(e)
                break;
        }
    }
})

app.listen(port);