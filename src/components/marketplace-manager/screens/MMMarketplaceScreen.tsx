import React from 'react';
import { useState, useEffect } from 'react';
import './MMMarketplaceScreen.css'; // Assuming you have some styles

const placeholderProducts = [
    { id: 1, name: 'Demo Product 1', price: '$10', image: 'path/to/image1.jpg' },
    { id: 2, name: 'Demo Product 2', price: '$15', image: 'path/to/image2.jpg' },
    // Add more mock data as needed
];

export const MMMarketplaceScreen = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://api.example.com/products'); // Replace with your API endpoint
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Fetch error:', error);
                // Fallback to the mock data
                setProducts(placeholderProducts);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className='marketplace'>
            <h1>Marketplace</h1>
            <div className='product-grid'>
                {products.map(product => (
                    <div key={product.id} className='product-card'>
                        <img src={product.image} alt={product.name} />
                        <h2>{product.name}</h2>
                        <p>{product.price}</p>
                        <button onClick={() => alert('Demo clicked for ' + product.name)}>Demo</button>
                        <button onClick={() => alert('Buy clicked for ' + product.name)}>Buy</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
