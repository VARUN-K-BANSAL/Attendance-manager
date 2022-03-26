const mongoose = require('mongoose')
const DATABASE_NAME = 'projectDataBase'
const CONNECTION_URL = `mongodb://localhost:27017/${DATABASE_NAME}`

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection Successful');
}).catch((e) => {
    console.log(e);
})