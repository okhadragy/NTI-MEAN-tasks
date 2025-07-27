const addContact = require('./modules/addContact');
const listContacts = require('./modules/listContacts');
const removeContact = require('./modules/removeContact');
const searchContact = require('./modules/searchContact');

async function main() {
    const contact = {
        id: "2",
        name: "John Doe",
        phone: "123-456-7890",
        email: "john.doe@example.com"
    };
    await addContact(contact);
    console.log("Contact added successfully.");
    const contacts = await listContacts();
    console.log("Contacts:", contacts);
    await removeContact(contact.id);
    console.log("Contact removed successfully.");
    const searchResults = await searchContact("Alice");
    console.log("Search results:", searchResults);
}

main();
