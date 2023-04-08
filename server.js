const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Assuming your HTML, CSS, and JS files are in the 'public' folder

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

app.get("/data", (req, res) => {
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading data.json");
    } else {
      res.json(JSON.parse(data));
    }
  });
});


app.post('/data', (req, res) => {
  const data = JSON.stringify(req.body, null, 2);
  fs.writeFile('data.json', data, 'utf8', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data file');
    } else {
      res.status(200).send('Data saved');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});