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
            author : "630b0f13d0b5ec89997f7919",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images : [
                {
                  url: 'https://res.cloudinary.com/dzrnsjvgk/image/upload/v1662118942/CampingWorld/uytsur5rp92nh9u8yskt.jpg',
                  filename: 'CampingWorld/uytsur5rp92nh9u8yskt',
                },
                {
                  url: 'https://res.cloudinary.com/dzrnsjvgk/image/upload/v1662118943/CampingWorld/l06apszi0hdwokbpef85.jpg',
                  filename: 'CampingWorld/l06apszi0hdwokbpef85',
                },
                {
                  url: 'https://res.cloudinary.com/dzrnsjvgk/image/upload/v1662118950/CampingWorld/wvuh8mekpg18zlrpyyyk.jpg',
                  filename: 'CampingWorld/wvuh8mekpg18zlrpyyyk',
                }
              ],
            geometry : {
              type : "Point",
              coordinates : [-113.1331, 47.0202]
            },
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis suscipit blanditiis distinctio voluptatem a numquam architecto nisi veritatis repellat praesentium recusandae porro corrupti, officiis corporis magnam quo cum, possimus ipsam.",
    price: random1000
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})