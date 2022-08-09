const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'http://source.unsplash.com/collection/483251',

    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis suscipit blanditiis distinctio voluptatem a numquam architecto nisi veritatis repellat praesentium recusandae porro corrupti, officiis corporis magnam quo cum, possimus ipsam.",
    price: random1000
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})