const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000

app.listen(PORT, (req, res) => {
    console.log(`Server started at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});