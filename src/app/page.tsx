'use client';

import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';
import Sidebar from '@/components/Sidebar';
import FlowCanvas from '@/components/FlowCanvas';
import OutputPreview from '@/components/OutputPreview';

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleNodesChange = useCallback((updatedNodes: Node[]) => {
    setNodes(updatedNodes);
  }, []);

  const handleEdgesChange = useCallback((updatedEdges: Edge[]) => {
    setEdges(updatedEdges);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-800">Contextigo</h1>
        <p className="text-sm text-gray-600">Visual Context Engineering for AI</p>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onDragStart={onDragStart} />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <FlowCanvas 
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
            />
          </div>
          
          <OutputPreview nodes={nodes} edges={edges} />
        </div>
      </div>
    </div>
  );
}
