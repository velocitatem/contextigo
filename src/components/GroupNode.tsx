'use client';

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeData } from '@/types';

interface GroupNodeProps {
  data: NodeData;
  id: string;
}

export default function GroupNode({ data }: GroupNodeProps) {
  const [groupName, setGroupName] = useState(data.groupName || 'background');

  const handleGroupNameChange = (value: string) => {
    setGroupName(value);
    data.groupName = value;
  };

  return (
    <div className="bg-white border-2 border-purple-500 rounded-lg p-4 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          XML Group Name
        </label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => handleGroupNameChange(e.target.value)}
          placeholder="background"
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>
      
      <div className="text-xs text-gray-600">
        Groups connected inputs into XML tags: &lt;{groupName}&gt;...&lt;/{groupName}&gt;
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}