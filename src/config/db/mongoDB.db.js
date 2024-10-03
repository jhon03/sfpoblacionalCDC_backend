const mongoose = require('mongoose');

const dbConecction = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Base de datos levantada en remoto');
    } catch (error) {
        console.error("Error al levantar la base de datos:", error);
        throw error;
    }
};

module.exports = {
    dbConecction
}