'use client';

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeData } from '@/types';

interface WebsiteConnectorProps {
  data: NodeData;
  id: string;
}

export default function WebsiteConnector({ data }: WebsiteConnectorProps) {
  const [url, setUrl] = useState(data.url || '');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleFetch = async () => {
    if (!url) return;
    
    setIsExecuting(true);
    try {
      const response = await fetch(`/api/fetch-website?url=${encodeURIComponent(url)}`);
      const result = await response.json();
      
      if (response.ok) {
        data.result = result.content;
        data.url = url;
      } else {
        data.result = `Error: ${result.error || 'Failed to fetch content'}`;
      }
    } catch (error) {
      data.result = `Error fetching URL: ${error}`;
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-white border-2 border-blue-500 rounded-lg p-4 min-w-[200px]">
      <Handle type="target" position={Position.Left} />
      
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>
      
      <button
        onClick={handleFetch}
        disabled={!url || isExecuting}
        className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
      >
        {isExecuting ? 'Fetching...' : 'Fetch Content'}
      </button>
      
      {data.result && (
        <div className="mt-2 text-xs text-gray-600">
          Content fetched ({data.result.length} chars)
        </div>
      )}
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
}