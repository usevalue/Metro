const height = 3;
const width = 3;

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

}

module.exports = Simulator;