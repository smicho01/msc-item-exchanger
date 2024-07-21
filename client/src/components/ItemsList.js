import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL =  process.env.REACT_APP_BACKEND_URL
const BACKEND_API_KEY =  process.env.REACT_APP_BACKEND_API_KEY
const ItemsList = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [showFiltered, setShowFiltered] = useState(false);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/books`, {
            headers: {
                'x-api-key': BACKEND_API_KEY
            }
        })
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const toggleUnsoldItems = () => {
        if (!showFiltered) { // if showFiltered it's false
            const unsoldItems = items.filter( item => !item.sold );
            setFilteredItems(unsoldItems);
        }
        setShowFiltered(!showFiltered); // switch the value of showFiltered
    }

    return (
        <div className="container mt-5">
            <div className="jumbotron text-center">
                <h1 className="display-4">Exchange Items for Tokens</h1>
                <p className="lead">Running on AcademiChain Blockchain</p>
                <hr className="my-4"/>
                <p>Browse all items available for exchange</p>
                <button onClick={toggleUnsoldItems} className="btn btn-primary">
                    {showFiltered ? "Show All Items" : "Show Unsold Items"}
                </button>
            </div>
            <div className="row">
                {(showFiltered ? filteredItems : items).map(item => (
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