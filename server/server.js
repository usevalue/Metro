const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const {Logger} = require('mongodb');
const bcrypt = require('bcrypt');
const salt = 10;
const cron = require('node-cron');

const playerRouter = require('./playerrouter');
const guestRouter = require('./guestrouter');
const { User } = require('./models');

const staticPath = path.join(__dirname, '../client/static/');
const viewPath = path.join(__dirname, '../client/views/');
const dburl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/METRO';

try {
    mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Connected to database.');
}
catch (e) { console.log('There was a problem connnecting to the database server.'); }

Logger.setLevel('error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', viewPath);

app.use(express.urlencoded({extended: true}))

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

app.use(express.static(staticPath));

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

app.use('/home/', playerRouter);
app.use('/city/', guestRouter);

cron.schedule('1 5 10 15 * * * * *', ()=>{
    console.log('lol')
})

app.listen(5000);