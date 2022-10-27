const express = require('express');
const path = require('path'); 
const app = express();

const PORT = process.env.PORT || 3000;

// html directory
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'))
})

// all the routes related t othe /notes
const noteRouter = require('./routes/notes');
app.use(noteRouter);

//catching all the other non routed sites to the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

// display at the gitbash
app.listen(PORT, () => console.log(`Serving static asset routes on port ${PORT}!`));