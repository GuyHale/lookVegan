const mongoose = require("mongoose") //require mongoose
const path = require("path"); //requiring path
const Place = require("../models/places");
const Review = require("../models/review");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
// const mapboxToken = process.env.mapbox_token;
const geoCoder = mbxGeocoding({ accessToken: "pk.eyJ1IjoiZ3V5aGFsZTk5IiwiYSI6ImNsNHR0NWFhNzBwNHczbW1sZHRhcXN1M2gifQ.pwchynun4tghC4ACwXLwtw" });
const dbUrl = "mongodb+srv://guyHale99:HayoEW6uCS8LTqoD@cluster0.zyd6t8h.mongodb.net/?retryWrites=true&w=majority";

const getGeo = async () => {

}

getGeo();

//connecting mongoose to specific database
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

//setting up db/mongoose
const db = mongoose.connection; //connecting mongoose to db
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected", dbUrl);
})

//creating an async function to create some seed data
//also delete everything in datastore each time it's run

cities = ["Aldershot", "Aldridge", "Alford", "Alfreton", "Ashington", "Ashton-in-Makerfield", "Ashton-under-Lyne", "Askern", "Aspatria", "Atherstone", "Attleborough", "Axbridge", "Axminster", "Aylesbury", "Aylsham",
    "Bacup", "Bakewell", "Baldock", "Banbury", "Barking", "Barnard Castle", "Barnet", "Barnoldswick", "Barnsley", "Barnstaple", "Barnt Green", "Barrow-in-Furness", "Barton-upon-Humber", "Barton-le-Clay", "Basildon", "Basingstoke", "Bath", "Batley", "Battle", "Bishop's Castle",
    "Caistor", "Calne", "Camberley", "Camborne", "Cambridge", "Camelford", "Cannock", "Canterbury", "Carlisle", "Carnforth", "Carterton", "Castle Cary", "Castleford", "Chadderton", "Chagford", "Chard", "Charlbury", "Chatham", "Chatteris", "Chelmsford", "Cheltenham", "Chesham", "Cheshunt",
    "Darley Dale", "Darlington", "Dartford", "Dartmouth", "Darwen, Daventry", "Dawlish", "Deal", "Denholme", "Denton", "Derby", "Dereham", "Desborough", "Devizes", "Dewsbury", "Didcot", "Dinnington", "Diss", "Doncaster", "Dorchester", "Dorking", "Dover", "Downham Market", "Driffield", "Dronfield", "Ealing", "Earley", "Easingwold", "Eastbourne",
    "Failsworth", "Fairford", "Fakenham", "Falmouth", "Fareham", "Faringdon", "Farnborough", "Farnham", "Farnworth", "Faversham", "Featherstone", "Felixstowe", "Fenny Stratford", "Ferndown", "Ferryhill", "Filey", "Filton", "Fleet", "Fleetwood", "Flitwick", "Folkestone",
    "Grays", "Great Dunmow", "Great Torrington", "Great Yarmouth", "Grimsby", "Guildford", "Guisborough", "Hackney", "Hadleigh", "Hailsham", "Halesworth", "Halewood", "Halifax", "Halstead", "Haltwhistle", "Harlow", "Harpenden", "Harrogate", "Harrow",
    "Heywood", "Hexham", "Higham Ferrers", "Highworth", "High Wycombe", "Hinckley", "Hitchin", "Hoddesdon", "Holmfirth", "Holsworthy", "Honiton", "Horley", "Horncastle", "Hornsea", "Horsham", "Horwich", "Houghton-le-Spring", "Hounslow",
    "Keighley", "Kempston", "Kendal", "Kenilworth", "Kesgrave", "Keswick", "Kettering", "Keynsham", "Kidderminster", "Kidsgrove", "Killingworth", "Kimberley", "Kingsbridge", "King's Lynn", "Kingston-upon-Hull", "Kingston upon Thames", "Kington", "Kirkby", "Kirkby-in-Ashfield",
    "Liskeard", "Littlehampton", "Liverpool", "Lizard", "London", "London", "Mablethorpe", "Macclesfield", "Maghull", "Maidenhead", "Maidstone", "Maldon", "Malmesbury", "Maltby", "Malton", "Malvern", "Manchester", "Manningtree", "Mansfield", "March", "Margate", "Market Deeping",
    "Oakham", "Okehampton", "Oldbury", "Oldham", "Ollerton", "Olney", "Paddock Wood", "Padstow", "Paignton", "Painswick", "Peacehaven", "Penistone", "Penrith", "Penryn", "Penzance",
]
restaurants = ["a", "KFC", "Burger King", "Dominos", "Wildwood", "Zizzis", "Brewdog", "Hubbox", "Pizza express", "VeggieBox", "Yo Sushi", "Wagamamas", "Giggling squid"];


const seedDB = async () => {
    await Place.deleteMany({});
    // await Review.deleteMany({});

    for (let city of cities) {
        const geoData = await geoCoder.forwardGeocode({
            query: `${city}, England`,
            limit: 5
        }).send()
        const coords = geoData.body.features;

        for (let c of coords) {
            num = Math.floor((Math.random() * restaurants.length));
            // console.log(c.place_name, c.geometry.coordinates);
            const place = new Place({
                title: restaurants[num],
                location: c.text,
                geometry: {
                    type: "Point",
                    coordinates: c.geometry.coordinates
                },
                options: ["Beyond meat burger", "Seitan chick'n burger", "Cauliflower wings"],
                optionPrices: [12, 13, 8],
                description: "Beautiful restaurant!",
                images: [{
                    url: "https://res.cloudinary.com/di1utlwnn/image/upload/w_900,h_750/v1656080089/LookVegan/seeds/adam-bartoszewicz-lNFfYtrbkRM-unsplash_c1h4b1.jpg",
                    filename: "LookVegan/seeds/adam-bartoszewicz-lNFfYtrbkRM-unsplash_c1h4b1.jpg"
                },
                {
                    url: "https://res.cloudinary.com/di1utlwnn/image/upload/w_900,h_750/v1656080087/LookVegan/seeds/micheile-dot-com-WhcNJfhGiOk-unsplash_xdtfkv.jpg",
                    filename: "LookVegan/seeds/micheile-dot-com-WhcNJfhGiOk-unsplash_xdtfkv.jpg"
                },
                {
                    url: "https://res.cloudinary.com/di1utlwnn/image/upload/w_900,h_750/v1656080080/LookVegan/seeds/toa-heftiba-bniHpvYzckU-unsplash_llmlys.jpg",
                    filename: "LookVegan/seeds/toa-heftiba-bniHpvYzckU-unsplash_llmlys.jpg"
                }],
                author: "62c06753f10e50ce78fcdfeb"

            })
            await place.save()
        }



    }
}



seedDB();