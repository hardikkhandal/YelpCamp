const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground')
const URI = "mongodb://localhost:27017"
const {places,descriptors} = require('./seedHelpers')
mongoose.connect(URI);

const db = mongoose.connection;
db.on('error',console.error.bind(console,"Connection Error"));
db.once('open',()=>{
    console.log("Database Cnected");
})

const sample = (array)=>{
    return array[Math.floor(Math.random() * array.length)];
}


const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i =0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const randomprice = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/11649432',
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi libero enim, magni quos ad magnam et voluptate hic rerum eos quo error soluta voluptatem vero nam. Soluta ipsa ad eligendi.",
            price:randomprice
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})