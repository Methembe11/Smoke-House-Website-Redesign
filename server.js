const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

app.post('/api/reservations', (req, res) => {
    const entry = { ...req.body, receivedAt: new Date().toISOString() };
    const file = path.join(dataDir, 'reservations.json');
    let list = [];
    try { list = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
    list.push(entry);
    fs.writeFileSync(file, JSON.stringify(list, null, 2));
    res.json({ ok: true });
});

app.post('/api/subscribers', (req, res) => {
    const entry = { ...req.body, receivedAt: new Date().toISOString() };
    const file = path.join(dataDir, 'subscribers.json');
    let list = [];
    try { list = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
    list.push(entry);
    fs.writeFileSync(file, JSON.stringify(list, null, 2));
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Smokehouse server running at http://localhost:${PORT}`);
});
