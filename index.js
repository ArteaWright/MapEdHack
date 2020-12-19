const express = require('express');
const fs = require('fs')
const bodyParser = require('body-parser');
const app = express();
const data = require('./database.json');
const mapboxgl = require('mapbox-gl/dist/mapbox-gl');


var urlencodedParser = bodyParser.urlencoded({extended: true});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static('public'));


function jsonReader(filePath, cb) {  
    fs.readFile(filePath, (err, fileData) => {
        if (err) { 
            return cb && cb(err)        
        } try { 
            const object = JSON.parse(fileData)            
            return cb && cb(null, object)        
        } catch(err) {            
            return cb && cb(err)        
        }    
})};


// To render page in browser
app.get('/', (req, res, next) => {
    res.render('index');
    next();
});

// push info from contact form to JSON file
app.post("/", urlencodedParser, (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;

    let formData = {
        name: name,
        email: email,
        message: message
    }
    

    jsonReader('./database.json', (err, info) => {
        if (err) {
            console.log("Error", err)
            return;
        }
    info.push(formData)
    const jsonBody = JSON.stringify(info, null, 2);

        fs.writeFile("./database.json", jsonBody, (err)=>{
            if (err) {
                console.log("Error", err)
                return;
            }
        })
    })
    res.redirect("/");
});


// server
const port = process.env.PORT || 3000
app.listen(port, console.log(`Server on ${port}`));