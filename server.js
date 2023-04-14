const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

dataMap = require('./data/dataMap.json')

const refreshDataMap = () => {
  fs.readFile('./data/dataMap.json', "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      dataMap = JSON.parse(data);
    }
  });
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
  fs.readFile(dataFile, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      res.json(JSON.parse(data));
    }
  });
});


app.post('/data/:id', (req, res) => {
  refreshDataMap();
  const id = req.params.id;
  const dataFile = `data/${dataMap[id].filename}`;
  const data = JSON.stringify(req.body, null, 2);
  fs.writeFile(dataFile, data, 'utf8', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data file');
    } else {
      res.status(200).send('Data saved');
    }
  });
});

app.post("/dataMap", (req, res) => {
  const newDataMap = req.body;
  // write new data files
  // dataMap format is {id: {filename: "filename", name: "name"}}
  for (const id in newDataMap) {
    const dataFile = `data/${newDataMap[id].filename}`;
    if (!fs.existsSync(dataFile)) {
      fs.writeFile(dataFile, "{}", 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error creating data file');
        }
      });
    }
  }
  fs.writeFile('./data/dataMap.json', JSON.stringify(newDataMap), 'utf8', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data map');
    } else {
      res.status(200).send('Data map saved');
    }
  });
});

app.get("/dataMap", (req, res) => {
  refreshDataMap();
  res.json(dataMap);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});