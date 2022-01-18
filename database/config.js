const mongoose = require('mongoose');

const dbConnection = async () => {
    try{
       await mongoose.connect(process.env.DB_CNN);

         console.log('DB is connected');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de conectar con la base de datos');
    } 
}


module.exports = dbConnection;