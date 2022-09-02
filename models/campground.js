const mongoose = require('mongoose');
const Review = require('./review')

const campgroundSchema = new mongoose.Schema({
    title : String,
    price : Number,
    images: [
        {
            url : String,
            filename : String
        }
    ],
    description : String,
    location : String,
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
});

campgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({_id : {$in : doc.reviews}})
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);