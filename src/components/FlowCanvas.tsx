'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  NodeTypes,
  ReactFlowInstance,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import WebsiteConnector from './WebsiteConnector';
import CustomInstructionsConnector from './CustomInstructionsConnector';
import GroupNode from './GroupNode';
import { NodeData } from '@/types';

const nodeTypes: NodeTypes = {
  website: (props: { data: NodeData; id: string }) => <WebsiteConnector {...props} onDelete={props.data.onDelete} />,
  custom: (props: { data: NodeData; id: string }) => <CustomInstructionsConnector {...props} onDelete={props.data.onDelete} />,
  group: (props: { data: NodeData; id: string }) => <GroupNode {...props} onDelete={props.data.onDelete} />,
};

interface FlowCanvasProps {
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
}

export default function FlowCanvas({ onNodesChange, onEdgesChange }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([]);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      onEdgesChange(newEdges);
    },
    [edges, setEdges, onEdgesChange]
  );

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      const updatedNodes = nodes.filter(node => node.id !== nodeId);
      const updatedEdges = edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      onNodesChange(updatedNodes);
      onEdgesChange(updatedEdges);
    },
    [nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }) || { x: 0, y: 0 };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: `${type} connector`,
          ...(type === 'group' && { groupName: 'background' }),
          onDelete: onDeleteNode,
        },
      };

      const updatedNodes = [...nodes, newNode];
      setNodes(updatedNodes);
      onNodesChange(updatedNodes);
    },
    [reactFlowInstance, nodes, setNodes, onNodesChange]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChangeInternal(changes);
      // Get the latest nodes after the internal change
      setTimeout(() => {
        const currentNodes = nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onDelete: onDeleteNode,
          },
        }));
        onNodesChange(currentNodes);
      }, 0);
    },
    [onNodesChangeInternal, onNodesChange, nodes, onDeleteNode]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChangeInternal(changes);
      onEdgesChange(edges);
    },
    [onEdgesChangeInternal, onEdgesChange, edges]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        style={{ width: '100%', height: '100%' }}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}