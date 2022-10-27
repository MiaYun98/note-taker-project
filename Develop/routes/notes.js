const express = require("express"); 
const router = express.Router();
const path = require('path')
const fs = require('fs');
const uuid = require("../public/assets/uuid.js");

// this is for posting a api
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// when the user click the buttion it should direct to the /notes which is notes.html file 
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'))
})

router.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', "utf-8", (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json({
                msg: "It is not working",
                err: err
            })
        } else {
            const dataArr = JSON.parse(data); 
            res.json(dataArr)
        }
    })
})

router.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', "utf-8", (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json({
                msg: "It is not working",
                err: err
            })
        } else {
            const dataArr = JSON.parse(data); 
            const {title, text} = req.body;
            const addArr = {
                title,
                text,
                id: uuid()
            }
            dataArr.push(addArr);
            fs.writeFile('./db/db.json', JSON.stringify(dataArr, null, 4), (err, data) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({
                        msg:"it is not saved",
                        err:err
                    })
                } else {
                    res.json({
                        msg:"it is saved!"
                    })
                }
            })
        }
    })
})

// we need this to have an id for the each one
router.get('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', "utf-8", (err, data) => {
        if(err) {
            console.log(err) 
            res.status(500).json({
                msg:"note id is not defined",
                err: err
            })
        } else {
            const dataArr = JSON.parse(data);
            for(let i = 0; i < dataArr.length; i++) {
                const currentNote = dataArr[i];
                if(currentNote.id == req.params.id) {
                    return res.json(currentNote);
                }
            }
            res.status(404).json({
                msg:"unable to find the id"
            })
        }
    })
})

router.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        const dataArr = JSON.parse(data);
        const note = dataArr.find( c => c.id === (req.params.id))
        if(!note) {
            return res.status(404).send("the note is deleted properly");
        }
        const index = dataArr.indexOf(note) 
        dataArr.splice(index,1);

        fs.writeFile('./db/db.json', JSON.stringify(dataArr, null, 4), (err, data) => {
            if(err) {
                console.log(err);
                res.status(500).json({
                    msg:"it is not not deleted",
                    err:err
                })
            } else {
                res.json({
                    msg:"it is deleted"
                })
            }
        })
    })
})

module.exports = router;