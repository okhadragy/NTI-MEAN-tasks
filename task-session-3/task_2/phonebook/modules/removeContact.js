const path = require('path');
const { writeFile, readFile } = require('fs').promises;

async function removeContact(contactId) {
    try {
        const filePath = path.join(__dirname, '../data/contacts.json');
        const data = await readFile(filePath, 'utf-8');
        const json = JSON.parse(data);
        json.contacts = json.contacts.filter(c => c.id !== contactId);
        await writeFile(filePath, JSON.stringify(json, null, 2));
    } catch (error) {
        console.error("Error removing contact:", error);
    }
}

module.exports = removeContact;