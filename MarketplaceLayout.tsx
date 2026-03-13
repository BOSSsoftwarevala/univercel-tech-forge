import React from 'react';

const MarketplaceLayout = ({ children }) => {
    return (
        <div className="marketplace-layout">
            <header>
                <h1>Marketplace</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>Footer Content</p>
            </footer>
        </div>
    );
};

export default MarketplaceLayout;