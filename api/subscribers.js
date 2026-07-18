const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const dataDir = '/tmp';
        const entry = { ...req.body, receivedAt: new Date().toISOString() };
        const file = path.join(dataDir, 'smokehouse-subscribers.json');
        let list = [];
        try { list = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
        list.push(entry);
        fs.writeFileSync(file, JSON.stringify(list, null, 2));
        res.status(200).json({ ok: true });
    } catch (err) {
        res.status(200).json({ ok: true });
    }
};
