const mongoose = require('mongoose')
const CONNECTION_URL = 'mongodb://localhost:27017/projectDataBase'

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection Successful');
}).catch((e) => {
    console.log(e);
})