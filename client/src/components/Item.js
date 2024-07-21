import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BACKEND_URL =  process.env.REACT_APP_BACKEND_URL
const BACKEND_API_KEY =  process.env.REACT_APP_BACKEND_API_KEY
const BLOCKCHAIN_URL =  process.env.REACT_APP_BLOCKCHAIN_URL
const BLOCKCHAIN_API_KEY =  process.env.REACT_APP_BLOCKCHAIN_API_KEY

const Item = () => {

    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBuyerBoxDetails , setShowBuyerBoxDetails] = useState(false);
    const [showItemPurchased , setShowItemPurchased] = useState(false);

    const [username, setUsername] = useState('HappyBobbon');
    const [walletPublicKey, setWalletPublicKey] = useState('04186dc7da6f6b5505b8bb87d9ad4e86a03d3b61dba85613ae5cf51b7c59ffc4a236bc8797ba69f23134b2ef9aef9f6071e0fb33463307e03d0e8c30204938bfb3');
    const [walletPrivateKey, setWalletPrivateKey] = useState('dd618eb8598936ef77ed0256794c0905406d81d63e413b5dadb965d6097041cb');

    const [buyerWalletBalance, setBuyerWalletBalance] = useState([]);
    const [purchaseMessage, setPurchaseMessage] = useState('')


    useEffect(() => {
        // Fetch the book details from the server
        axios.get(`${BACKEND_URL}/books/${id}`, {
            headers: {
                'x-api-key': BACKEND_API_KEY
            }
        })
            .then(response => {
                setItem(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching book data:', error);
                setError('Error fetching book data');
                setLoading(false);
            });
    }, [id]);


    const handleBuyClick = () => {
        setShowBuyerBoxDetails(!showBuyerBoxDetails);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        axios.get(`${BLOCKCHAIN_URL}/wallet/balance/${walletPublicKey}`, {
            headers: {
                'x-api-key': BLOCKCHAIN_API_KEY
            }
        })
            .then(response => {
                setBuyerWalletBalance(response.data['balance'])
                if(response.data['balance'] < item.price) {
                    setPurchaseMessage('Not enough tokens to purchase item.')
                } else {
                    setPurchaseMessage(`Enough tokens to purchase item.`)
                    setShowBuyerBoxDetails(false)

                    // Execute transaction on Blockchain to transfer tokens between buyer and seller wallets
                    axios.post(`${BLOCKCHAIN_URL}/transaction`, {
                        sender_pub: walletPublicKey,
                        sender_priv: walletPrivateKey,
                        recipient: item.wallet,
                        amount: item.price
                    }, {
                        headers: {
                            'x-api-key': BLOCKCHAIN_API_KEY
                        }
                    })
                    .then(response => {
                        console.log('Transfer successful:', response.data);

                        if(response.data.message === 'Block mined.') {
                            // Update item data in MongoDB to set item as sold and assign buyer wallet to recognize new owner
                            item.sold = true;
                            item.buyer = walletPublicKey;
                            item.buyerusername = username;
                            axios.put(`${BACKEND_URL}/books/${item._id}`, item, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-api-key': BACKEND_API_KEY
                                },
                            });
                        }

                        setShowItemPurchased(!showItemPurchased)
                    })
                    .catch(error => console.error('Error transferring tokens:', error));
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        console.log("Buyer wallet balance: ", buyerWalletBalance);
    }, [buyerWalletBalance]);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-5">
                    <h4>{item.title}</h4>
                    <p className="text-muted">Type: {item.type}</p>
                    <p className="lead">Price: {item.price} Token[s]</p>
                    {!item.sold && (
                    <button className="btn btn-success" onClick={handleBuyClick}>I want to buy it</button>
                        )}
                    {item.sold && (
                        <div>
                        <p className="alert alert-danger">Item Sold</p>
                        <p>To wallet ending: ... {item.buyer.slice(-20)}</p>
                        <p>Buyer username: ... {item.buyerusername}</p>
                        </div>
                    )}

                </div>
                <div className="col-md-7">
                    <p>{item.description}</p>
                </div>
            </div>

            {showItemPurchased && (
                <div className="mt-3">
                    <p className="alert alert-success" >Item purchased !</p>
                </div>
            )}

            {showBuyerBoxDetails && (
                <div className="mt-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Buyer Information</h5>
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group">
                                    <label htmlFor="username">Your username</label>
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
                                    <label htmlFor="walletKey1">Your AcademiChain Blockchain Wallet Public Key</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="walletKey1"
                                        value={walletPublicKey}
                                        onChange={(e) => setWalletPublicKey(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="walletKey2">Your AcademiChain Blockchain Wallet Private Key</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="walletKey2"
                                        value={walletPrivateKey}
                                        onChange={(e) => setWalletPrivateKey(e.target.value)}
                                        required
                                    />
                                </div>
                                <p>{purchaseMessage}</p>
                                <button type="submit" className="btn btn-success">Purchase Item</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Item;
