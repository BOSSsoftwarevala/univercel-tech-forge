import React from 'react';

const AIBuilderPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Builder</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">Prompt</h2>
            <textarea 
              className="w-full h-48 p-3 border border-border rounded-md bg-background text-foreground resize-none"
              placeholder="Enter your prompt here..." 
            />
          </div>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">Plan</h2>
            <p className="text-muted-foreground">Your generated plan will appear here.</p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <p className="text-muted-foreground">Your preview will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBuilderPage;
