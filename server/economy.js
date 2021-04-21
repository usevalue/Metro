const cron = require('node-cron');
const {City} = require('./models.js')

class Economy {

    constructor() {
        // Execute every half hour
        cron.schedule('0,30 * * * *', ()=>{this.income();});
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
