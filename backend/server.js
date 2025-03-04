const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const app = express();
const PORT = 3000 || process.env.port
dotenv.config();
app.use(cors())
app.use(bodyParser.json())



// Connection URL
const url = 'mongodb+srv://woafi:gP4Dx6e4ZekH3Nf@cluster0.re6ax.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

// Database Name
const dbName = 'passfort';

async function main() {
    try {
        // Use connect method to connect to the server
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection('Passwords');
        //get all the password
        app.get('/', async (req, res) => {
            const findResult = await collection.find({}).toArray();
            res.json(findResult);
        });
        //Save a password
        app.post('/', async (req, res) => {
            const password = req.body;
            const findResult = await collection.insertOne(password);
            res.send("Successful");
        });



        // Delete a password
        app.delete('/', async (req, res) => {
            try {
                const { _id } = req.body; // Extract _id from request body
                if (!_id) return res.status(400).send("Missing _id");
        
                const findResult = await collection.deleteOne({ _id: new ObjectId(_id) });
        
                if (findResult.deletedCount === 0) {
                    return res.status(404).send("Item not found");
                }
        
                res.send("Delete successful");
            } catch (error) {
                console.error("Error deleting password:", error);
                res.status(500).send("Error deleting password");
            }
        });

        //update a password
        app.put('/', async (req, res) => {
            try {
                const { _id, site, username, password } = req.body; // Extract fields from request body
                if (!_id) return res.status(400).send("Missing _id");
        
                const updateResult = await collection.updateOne(
                    { _id: new ObjectId(_id) }, // Find by _id
                    { $set: { site, username, password } } // Update fields
                );
        
                if (updateResult.matchedCount === 0) {
                    return res.status(404).send("Item not found");
                }
        
                res.send("Update successful");
            } catch (error) {
                console.error("Error updating password:", error);
                res.status(500).send("Error updating password");
            }
        });


        app.listen(PORT, () => {
            console.log(`Example app listening on port http://localhost:3000/`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

main();