const mongoose = require('mongoose');

const MONGO_URL = "mongodb+srv://nasa-api:IoBOENKdAFKbbH8P@nasacluster.ttq0mdv.mongodb.net/?retryWrites=true&w=majority"

mongoose.set('strictQuery', false);

mongoose.connection.once('open', ()=>{
    console.log('MongoDB connection ready')
});

mongoose.connection.on('error', (err)=>{
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}
module.exports = {
    mongoConnect,
    mongoDisconnect
};