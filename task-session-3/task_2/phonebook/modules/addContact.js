const path = require('path');
const { writeFile, readFile } = require('fs').promises;

async function addContact(contact) {
    try {
        const filePath = path.join(__dirname, '../data/contacts.json');
        const data = await readFile(filePath, 'utf-8');
        const json = JSON.parse(data);
        if (!contact || !contact.name || !contact.phone) {
            console.error("Invalid contact data");
            return;
        }

        if (json.contacts.some(c => c.id === contact.id)) {
            json.contacts[json.contacts.findIndex(c => c.id === contact.id)] = contact;
        } else {
            json.contacts.push(contact);
        }

        await writeFile(filePath, JSON.stringify(json, null, 2));
    } catch (error) {
        console.error("Error saving contacts:", error);
    }
}

module.exports = addContact;