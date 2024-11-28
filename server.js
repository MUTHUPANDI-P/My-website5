const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

const defaultDirectory = __dirname;

app.post('/write', (req, res) => {
    const { fileName, content } = req.body;
    const filePath = path.join(defaultDirectory, fileName);
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            res.status(500).send('Error writing to file');
        } else {
            res.send(`File '${fileName}' written successfully`);
        }
    });
});

app.get('/read', (req, res) => {
    const { fileName } = req.query;
    const filePath = path.join(defaultDirectory, fileName);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file or file not found');
        } else {
            res.send(data);
        }
    });
});

app.post('/append', (req, res) => {
    const { fileName, content } = req.body;
    const filePath = path.join(defaultDirectory, fileName);
    fs.appendFile(filePath, `\n${content}`, (err) => {
        if (err) {
            res.status(500).send('Error appending to file');
        } else {
            res.send(`Content appended to '${fileName}' successfully`);
        }
    });
});

app.delete('/delete', (req, res) => {
    const { fileName } = req.body;
    const filePath = path.join(defaultDirectory, fileName);
    fs.unlink(filePath, (err) => {
        if (err) {
            res.status(500).send('Error deleting file or file not found');
        } else {
            res.send(`File '${fileName}' deleted successfully`);
        }
    });
});

app.post('/rename', (req, res) => {
    const { fileName, newFileName } = req.body;
    const oldFilePath = path.join(defaultDirectory, fileName);
    const newFilePath = path.join(defaultDirectory, newFileName);
    fs.rename(oldFilePath, newFilePath, (err) => {
        if (err) {
            res.status(500).send('Error renaming file or file not found');
        } else {
            res.send(`File renamed from '${fileName}' to '${newFileName}' successfully`);
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

