const mongoose = require('mongoose');  

const dbConecction = async() => { 
    try {
        await mongoose.connect(process.env.MONGODB_CNN_LOCAL);  
        console.log('Base de datos levantada en local'); 
    } catch (error) {
        console.error("Error al levantar la base de datos:", error);
        throw error;
    }
};

module.exports = { 
    dbConecction
}