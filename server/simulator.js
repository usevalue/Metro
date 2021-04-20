const height = 7;
const width = 7;
const {City} = require('./models.js')

class Simulator {

    constructor() {
    }

    setUpCity(city) {
        let spatial = []
        for(var lat=0; lat<height; lat++) {
            let row = []
            for(var lng=0; lng<width; lng++) {
                let place = {
                    name: 'Vacant parcel',
                    latitude: lat,
                    longitude: lng,
                }
                row.push(place);
            }
            spatial.push(row);
        }

        let midlat = Math.floor(height/2);
        let midlong = Math.floor(width/2);

        spatial[midlat][midlong].name="City Hall";
        spatial[midlat][midlong].use="Governmental";
        city.spatial = spatial;
    }

    income() {
        City.find({},(error, result)=>{
            if(error) console.log(error);
            console.log(result);
        })
    }
}

module.exports = Simulator;