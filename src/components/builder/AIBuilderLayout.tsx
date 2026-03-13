import React from 'react';
import './AIBuilderLayout.css'; // Ensure to create this CSS file for styling.

const AIBuilderLayout = () => {
    return (
        <div className="ai-builder-layout">
            <div className="left-panel">
                <h2>Prompt</h2>
                <textarea placeholder="Enter your prompt here..." />
            </div>
            <div className="center-panel">
                <h2>Plan</h2>
                <div>
                    <p>Your generated plan will appear here.</p>
                </div>
            </div>
            <div className="right-panel">
                <h2>Preview</h2>
                <div>
                    <p>Your preview will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default AIBuilderLayout;
