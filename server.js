const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require("fs");
const bodyParser = require('body-parser');
let dataJson = require('./data.json')
const jwt = require('jsonwebtoken');

const app = express();
const port = 80;

app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'menuEditor')));



app.get('/data', (req, res) => {
    // const dataJson = require('./data.json')
    res.send(dataJson);
});

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (username === 'admin' && password === "admin") {
        const signedToken = jwt.sign({ username: req.body.username }, process.env.SECRET);
        res.send({ signedToken });
    } else {
        res.status(401).send('Wrong');
    }
});



app.post('/data', (req, res) => {
    let signedToken = req.header("Authorization");
    const decoded = jwt.verify(signedToken, process.env.SECRET);
    let data = JSON.stringify(req.body.data, null, 2);
    const filePath = './data.json';
    dataJson = data;
    fs.writeFile(filePath, data, 'utf8', (err) => {
        if (err) {
            res.status(400).send({ msg: 'wrong' })
        } else {
            res.status(200).send({ msg: 'done' })
        }
    });

});

app.get('/menuEdit', (req, res) => {
    res.sendFile(path.join(__dirname, 'menuEditor', 'index.html'));
});

app.get('/images/:path', (req, res) => {
    let imgPath = req.params.path
    const img = path.join(__dirname, 'images', imgPath);

    if (fs.existsSync(img)) {
        res.sendFile(img);
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
