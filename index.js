//Sample for Assignment 3
const express = require('express');

//Import a body parser module to be able to access the request body as json
const bodyParser = require('body-parser');

//Use cors to avoid issues with testing on localhost
const cors = require('cors');

const app = express();

//Port environment variable already set up to run on Heroku
let port = process.env.PORT || 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());  

//Set Cors-related headers to prevent blocking of local requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//The following is an example of an array of two tunes.  Compared to assignment 2, I have shortened the content to make it readable
var tunes = [
    { id: '0', name: "Für Elise", genreId: '1', content: [{note: "E5", duration: "8n", timing: 0},{ note: "D#5", duration: "8n", timing: 0.25},{ note: "E5", duration: "8n", timing: 0.5},{ note: "D#5", duration: "8n", timing: 0.75},
    { note: "E5", duration: "8n", timing: 1}, { note: "B4", duration: "8n", timing: 1.25}, { note: "D5", duration: "8n", timing: 1.5}, { note: "C5", duration: "8n", timing: 1.75},
    { note: "A4", duration: "4n", timing: 2}] },

    { id: '3', name: "Seven Nation Army", genreId: '0', 
    content: [{note: "E5", duration: "4n", timing: 0}, {note: "E5", duration: "8n", timing: 0.5}, {note: "G5", duration: "4n", timing: 0.75}, {note: "E5", duration: "8n", timing: 1.25}, {note: "E5", duration: "8n", timing: 1.75}, {note: "G5", duration: "4n", timing: 1.75}, {note: "F#5", duration: "4n", timing: 2.25}] }
];

let genres = [
    { id: '0', genreName: "Rock"},
    { id: '1', genreName: "Classic"}
];

let nextTuneId = 4

//Your endpoints go here
//tunes
app.get('/api/v1/tunes', (req, res) => {
    res.status(200).send('Hello World!');
});

app.get('/api/v1/genres/:genreID/tunes/:tuneID/',(req,res) =>{
    for (let i=0; i<genres.length;i++) {
        if (genres[i].id == req.params.genreID) {
            for (let k=0;k<tunes.length;k++) {
                if (tunes[k].id == req.params.tuneID) {
                    res.status(200).json(tunes[k]);
                    return;
                }
            }
            res.status(404).json({'message': "Tune with id " + req.params.tuneID + " does not exist for genre with id " + req.params.genreID})
        }
    }
    res.status(404).json({'message': "Genre with id " + req.params.genreID + " does not exist"})
});

app.post('/api/v1/genres/:genreID/tunes/',(req,res) =>{
    if (req.body === undefined || req.body.name === undefined || req.body.content === undefined) {
        return res.status(400).json({'message': "Name and content fields are required in the request body."});
    } else {
        if (isNaN(Number(req.params.genreID))) { // genre doesn't exist
            return res.status(400).json({'message': "Genre with id " + req.params.genreID + " does not exist"});
        }
        // if content is empty return error
        if (req.body.content.length < 1) {
            return res.status(400).json({'message': "The content attribute must be a non-empty array"});
        }
        // iterate through content
        // if any value is invalid return error message
        for (let i=0;i<req.body.content.length;i++) {
            if (req.body.content[i].note === undefined || req.body.content[i].timing === undefined || req.body.content[i].duration === undefined ) {
                return res.status(400).json({'message': "The objects of the content attribute must have the note, timing, and duration attributes"});
            }
        }
        let newTune = {id: nextTuneId, name: req.body.name, genreId: req.params.genreID, content: req.body.content};
        tunes.push(newTune);
        nextTuneId++;
        res.status(201).json(newTune);
    }
});
// req.body.name req.body.genreId req.body.content
app.patch('/api/v1/genres/:genreID/tunes/:tuneID/',(req,res) =>{
    if (req.body === undefined || (req.body.name === undefined && req.body.genreId === undefined && req.body.content === undefined )) {
        return res.status(400).json({'message': "Name, genreId and content fields are required in the request body."});
    }
    if (req.body.id !== undefined) {
        return res.status(400).json({'message': "The id attribute cannot be updated"});
    }
    // check if tune exists
    for (let i=0; i<genres.length;i++) {
        if (genres[i].id == req.params.genreID) {
            for (let k=0;k<tunes.length;k++) {
                if (tunes[k].id == req.params.tuneID) {
                    if (req.body.name !== undefined) {
                        tunes[k].name = req.body.name;
                    }
                    if (req.body.genreId !== undefined) {
                        tunes[k].genreId = req.body.genreId;
                    }
                    if (req.body.content !== undefined) {
                        tunes[k].content = req.body.content;
                    }
                    res.status(200).json(tunes[k]);
                    return;
                }
            }
            res.status(404).json({'message': "Tune with id " + req.params.tuneID + " does not exist for genre with id " + req.params.genreID})
        }
    }
    res.status(404).json({'message': "Genre with id " + req.params.genreID + " does not exist"})
});

app.get('/api/v1/genres/',(req,res) =>{
    res.status(200).send('Hello World!')
});
app.post('/api/v1/genres/',(req,res) =>{
    res.status(200).send('Hello World!')
});
app.delete('/api/v1/genres/:genreID',(req,res) =>{
    res.status(200).send('Hello World!')
});
app.use('*', (req, res) => {
    res.status(405).send('Operation not supported.');
});



//Start the server
app.listen(port, () => {
    console.log('Tune app listening on port + ' + port);
});