const path = require('path');
const { readFile } = require('fs').promises;

async function listContacts() {
    try {
        const filePath = path.join(__dirname, '../data/contacts.json');
        const data = await readFile(filePath, 'utf-8');
        const json = JSON.parse(data);
        return json.contacts;
    } catch (error) {
        console.error("Error reading contacts:", error);
        return [];
    }
}

module.exports = listContacts;