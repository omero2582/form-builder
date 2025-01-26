import mongoose from 'mongoose';

async function dbStart(){
  try {
    if(!process.env.DB_URL) {
      console.log(`!!! PLEASE Add a .env file with DB_URL='your_mongo_url' !!!`)
    }
    await mongoose.connect(process.env.DB_URL);
    mongoose.connection.on('error', () => {
      console.log('Mongoose error event')
    })
    console.log('Connected to Database')
  } catch (error) {
    console.log('Mongoose ERROR on intial connection')
  }
}

async function initialize(){
  await dbStart();
} 


await initialize();
export default mongoose.connection.getClient();