const path = require('path');
const { readFile } = require('fs').promises;

async function searchContact(query) {
    try {
        const filePath = path.join(__dirname, '../data/contacts.json');
        const data = await readFile(filePath, 'utf-8');
        const json = JSON.parse(data);
        return json.contacts.filter(c => c.name.includes(query) || c.email.includes(query) || c.phone.includes(query));
    } catch (error) {
        console.error("Error searching contacts:", error);
        return [];
    }
}

module.exports = searchContact;
