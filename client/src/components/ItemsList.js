import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';


const BACKEND_URL =  process.env.REACT_APP_BACKEND_URL
const BLOCKCHAIN_URL =  process.env.REACT_APP_BLOCKCHAIN_URL


const ItemsList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/books`)
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="container mt-5">
            <div className="jumbotron text-center">
                <h1 className="display-4">Exchange Items for Tokens</h1>
                <p className="lead">Running on AcademiChain Blockchain</p>
                <hr className="my-4"/>
                <p>Browse all items available for exchange</p>
            </div>

            <div className="row">
                {items.map(item => (
                    <div className="col-md-4" key={item._id}>
                        <div className="card mb-4 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text">Type: {item.type}</p>
                                <p className="card-text"><strong>{item.price}</strong> Token[s]</p>
                                <p className="card-text">User: {item.username}</p>
                                <Link to={`/item/${item._id}`} className="btn btn-success" >View item</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemsList;
