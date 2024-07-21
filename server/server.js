const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(validateKey);

// MongoDB Atlas connection
const mongoURI = 'mongodb+srv://student:password123$@cluster0.t5qoish.mongodb.net/academichainbooks?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

// Book Schema
const bookSchema = new mongoose.Schema({
    title: String,
    type: String,
    price: Number,
    description: String,
    username: String,
    wallet: String,
    sold: Boolean,
    buyer: String,
    buyerusername: String,
});

const Book = mongoose.model('Book', bookSchema, 'books');

// Routes
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book == null) {
            return res.status(404).json({ message: 'Cannot find book' });
        }
        res.json(book);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.post('/books', async (req, res) => {
    const book = new Book(req.body);
    try {
        book.sold = false;
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body
        const updatedBook = await Book.findByIdAndUpdate(id, body, { new: true });
        if(updatedBook){
            res.status(200).json(updatedBook);
        }else{
            res.status(404).send();
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


function validateKey(req, res, next) {
    const api_key = process.env.API_KEY;  // import your secret API key from server environment or a secure place.
    const userKey = req.get('x-api-key');

    console.log("Checking for auth header")
    console.log("Api Key: ", api_key)

    if (!userKey || userKey !== api_key) {
        res.status(403).send({ error: 'Unauthorized.' });
    } else {
        next();
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
