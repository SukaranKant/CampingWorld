const mongoose = require('mongoose');
const Review = require('./review')

const opts = { toJSON : { virtuals : true}}

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
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
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
}, opts);

campgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({_id : {$in : doc.reviews}})
    }
})

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this._id}>${this.title}</a>"`
})

module.exports = mongoose.model('Campground', campgroundSchema);