const cron = require('node-cron');
const {City} = require('../models/city.js')

class Economy {

    constructor() {
        // Execute every hour

        //  The following line of code schedules hourly income for all cities,
        //  but does not function on heroku.
        //  cron.schedule('0 * * * *', ()=>{this.income();});
    }

    income() {
        City.find({}, async (error, result)=>{
            if(error) console.log(error);
            for(let i=0; i<result.length; i++) {
                try {
                    result[i].cash+=10;
                    await result[i].save();
                } catch (e) {
                    console.log(e);
                }
            }
        });
        console.log('Income allocated.');
    }



}

const econ = new Economy();

module.exports = econ;
