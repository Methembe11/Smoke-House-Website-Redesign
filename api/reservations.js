const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const dataDir = process.env.VERCEL
        ? '/tmp/smokehouse-data'
        : path.join(__dirname, '..', 'data');

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const entry = { ...req.body, receivedAt: new Date().toISOString() };
    const file = path.join(dataDir, 'reservations.json');
    let list = [];
    try { list = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
    list.push(entry);
    fs.writeFileSync(file, JSON.stringify(list, null, 2));
    res.json({ ok: true });
};
