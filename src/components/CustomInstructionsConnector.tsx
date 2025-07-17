'use client';

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeData } from '@/types';

interface CustomInstructionsConnectorProps {
  data: NodeData;
  id: string;
}

export default function CustomInstructionsConnector({ data }: CustomInstructionsConnectorProps) {
  const [content, setContent] = useState(data.content || '');

  const handleContentChange = (value: string) => {
    setContent(value);
    data.content = value;
    data.result = value;
  };

  return (
    <div className="bg-white border-2 border-green-500 rounded-lg p-4 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Custom Instructions
        </label>
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Enter your custom text here..."
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none"
          rows={4}
        />
      </div>
      
      {content && (
        <div className="mt-2 text-xs text-gray-600">
          Content ready ({content.length} chars)
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}