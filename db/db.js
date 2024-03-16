const mongoose = require('mongoose');

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true
        });
        console.log("Database connected successfully!")
    } catch (error) {
        console.log("**************************error ha bhai************************")
        console.log(error);
        console.log("**************************error ha bhai************************")
        process.exit(1);
    }
}

module.exports = connectDb;