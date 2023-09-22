const mongoose = require('mongoose')

const constDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URL)
        console.log("Connect to MongoDB successfully")
    } catch(error) {
        console.log("Connect failed" + error.message)
    }
}

module.exports = connectDB