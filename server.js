const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

dataMap = require('./data/dataMap.json')

const refreshDataMap = () => {
  const data = fs.readFileSync('./data/dataMap.json', "utf-8");
  dataMap = JSON.parse(data);
}


app.use(bodyParser.json());
app.use(express.static('public')); // Assuming your HTML, CSS, and JS files are in the 'public' folder

app.get('/', (req, res) => {
  refreshDataMap();
  res.sendFile(__dirname + '/public/main.html');
});

app.get("/data/:id", (req, res) => {
  refreshDataMap();
  const id = req.params.id;
  const dataFile = `data/${dataMap[id].filename}`;
  const data = fs.readFileSync(dataFile, {"encoding": "utf-8"});
  if (data) {
    res.json(JSON.parse(data));
  }
  else {
    res.status(500).send("Error reading data file");
  }
});


app.post('/data/:id', (req, res) => {
  refreshDataMap();
  const id = req.params.id;
  const dataFile = `data/${dataMap[id].filename}`;
  const data = JSON.stringify(req.body, null, 2);
  fs.writeFileSync(dataFile, data, {encoding: 'utf-8'});
  res.status(200).send('Data saved');
});

app.post("/dataMap", (req, res) => {
  const newDataMap = req.body;
  // write new data files
  // dataMap format is {id: {filename: "filename", name: "name"}}
  for (const id in newDataMap) {
    const dataFile = `data/${newDataMap[id].filename}`;
    fs.writeFileSync(dataFile, "[]", {encoding: 'utf-8'});
  }
  fs.writeFileSync('./data/dataMap.json', JSON.stringify(newDataMap), {encoding: 'utf-8'});
  res.status(200).send('Data map saved');
  refreshDataMap();
});

app.get("/dataMap", (req, res) => {
  refreshDataMap();
  res.json(dataMap);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});