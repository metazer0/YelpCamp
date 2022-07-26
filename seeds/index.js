const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser:true, useUnifiedTopology:true})

const db =  mongoose.connection
db.on("error", console.error.bind(console,"connection error"))
db.once("open", () => {
    console.log("database connected")
})

const sample = array => array[Math.floor(Math.random()* array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i=0 ; i < 50 ; i++){
        const randomThousand = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20) + 10
        const camp = new Campground({
            // author:'62cfaa84735f40042d2ad176',
            author: '62d86bb458e087f9953ec8e4',
            location: `${cities[randomThousand].city}, ${cities[randomThousand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dvaf8kqps/image/upload/v1658785807/YelpCamp/rivhbdrhl1zqxxozalxl.jpg',
                    filename: 'YelpCamp/rivhbdrhl1zqxxozalxl',
                  },
                  {
                    url: 'https://res.cloudinary.com/dvaf8kqps/image/upload/v1658785807/YelpCamp/xfi2a4cwbysekd0p8of3.jpg',
                    filename: 'YelpCamp/xfi2a4cwbysekd0p8of3',
                  },
                  {
                    url: 'https://res.cloudinary.com/dvaf8kqps/image/upload/v1658785807/YelpCamp/uvzwvvoebdojahhgfbs8.jpg',
                    filename: 'YelpCamp/uvzwvvoebdojahhgfbs8',
                  }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo autem quaerat natus quo aspernatur ipsam minus debitis itaque accusantium iure nam, fugiat voluptas iusto officiis nobis repellendus perferendis temporibus deleniti.',
            price: price
        })
        await camp.save()
    }
}

seedDB()
.then(() => {
    mongoose.connection.close()
})