import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL =  process.env.REACT_APP_BACKEND_URL
const BACKEND_API_KEY =  process.env.REACT_APP_BACKEND_API_KEY
const BLOCKCHAIN_URL =  process.env.REACT_APP_BLOCKCHAIN_URL
const BLOCKCHAIN_API_KEY =  process.env.REACT_APP_BLOCKCHAIN_API_KEY

const ItemAdd = () => {

    const [title, setTitle] = useState('My cool item for sale');
    const [username, setUsername] = useState('NiftyMoth');
    const [wallet, setWallet] = useState('04fa71fa391fe21bb81b9a169f567cc8ee2f8b19bd74275854382b3b2a9c717c35d0c7888a71a5d3f54c9b6be63b8e54615e8b2b259df413ef93e170564e71653b');
    const [type, setType] = useState('BOOK');
    const [price, setPrice] = useState('10');
    const [description, setDescription] = useState('Lorem ipsum ...');
    const [sold, setSold] = useState(false)
    const [buyer, setBuyer] = useState(null)

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newBook = {
            title,
            username,
            type,
            wallet,
            price,
            description,
            sold,
            buyer,
        };

        try {
            const response = await axios.post(`${BACKEND_URL}/books`, newBook, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': BACKEND_API_KEY
                },
            });
            console.log('Book added:', response.data);
            // Reset the form fields
            setTitle('');
            setUsername('');
            setType('');
            setWallet('');
            setPrice('');
            setDescription('');
            setSold(false);
            setBuyer(null);
        } catch (error) {
            console.error('There was an error adding the book:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add Item</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="username">Your Username (can be AcademiChain username)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">Item Type (e.g. book, notes, 1:1 tutoring)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="wallet">Your AcademiChain blockchain wallet public key (to get Tokens)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="wallet"
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        required
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Add Book</button>
            </form>
        </div>
    );
};

export default ItemAdd;
