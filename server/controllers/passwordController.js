const { ObjectId } = require('mongodb');
let collection;

const init = (db) => {
    collection = db.collection('Passwords');
};

const getPasswords = async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).send("Email parameter is required");

    const result = await collection.find({ name: email }).toArray();
    res.json(result);
};

const savePassword = async (req, res) => {
    const password = req.body;
    await collection.insertOne(password);
    res.send("Successful");
};

const deletePassword = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) return res.status(400).send("Missing _id");

        const result = await collection.deleteOne({ _id: new ObjectId(_id) });

        if (result.deletedCount === 0) return res.status(404).send("Item not found");

        res.send("Delete successful");
    } catch (error) {
        console.error("Error deleting password:", error);
        res.status(500).send("Error deleting password");
    }
};

const updatePassword = async (req, res) => {
    try {
        const { _id, passwordList } = req.body;
        if (!_id) return res.status(400).send("Missing _id");

        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: { passwordList } }
        );

        if (result.matchedCount === 0) return res.status(404).send("Item not found");

        res.send("Update successful");
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).send("Error updating password");
    }
};

module.exports = {
    init,
    getPasswords,
    savePassword,
    deletePassword,
    updatePassword,
};
