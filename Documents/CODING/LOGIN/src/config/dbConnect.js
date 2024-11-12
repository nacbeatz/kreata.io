const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const connect = await  mongoose.connect(process.env.CONNECTION_STRING);
        console.log(`Database Connected: ${connect.connection.host}`);
    }catch(error){
        console.log(`DB Connection Fail!: ${error}`);
        process.exit(1);
    };
    
   
};

module.exports = dbConnect;
