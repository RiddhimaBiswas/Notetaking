const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const dirPath = path.join(__dirname, 'files');


if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}


app.get('/', (req, res) => {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        }
        res.render('index', { files });
    });
});


app.post('/create', (req, res) => {
    const title = req.body.title.replace(/[^a-zA-Z0-9 _]/g, '').replace(/\b\w/g, c => c.toUpperCase()).replace(/\s+/g, '');
    const content = req.body.details;
    const filePath = path.join(dirPath, `${title}.txt`);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send("File creation failed.");
        }
        res.redirect("/");
    });
});

app.get('/files/:fileName', function(req, res) {
    const filePath = `./files/${req.params.fileName}`;

    fs.readFile(filePath, "utf-8", function(err, filedata) {
        if (err) {
            return res.status(404).send("File not found.");
        }
        res.render('show', {
            fileName: req.params.fileName,
            fileBody: filedata
        });
    });
});
app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});
