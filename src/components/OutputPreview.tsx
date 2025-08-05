'use client';

import { Node, Edge } from 'reactflow';

interface OutputPreviewProps {
  nodes: Node[];
  edges: Edge[];
}

export default function OutputPreview({ nodes, edges }: OutputPreviewProps) {
  const generateXMLOutput = () => {
    if (!nodes.length) return '';
    
    // Find group nodes and their connected inputs
    const groupNodes = nodes.filter(node => node.type === 'group');
    const inputNodes = nodes.filter(node => node.type !== 'group');
    
    let output = '';
    
    // Process each group node
    groupNodes.forEach(groupNode => {
      const groupName = groupNode.data.groupName || 'background';
      const connectedInputs = findConnectedInputs(groupNode.id, edges, inputNodes);
      
      if (connectedInputs.length > 0) {
        output += `<${groupName}>\n`;
        connectedInputs.forEach(input => {
          const content = input.data.result || input.data.content || '';
          if (content) {
            const nodeTypeTag = input.type === 'website' ? 'website' : 'custom_text';
            output += `  <${nodeTypeTag}>${content}</${nodeTypeTag}>\n`;
          }
        });
        output += `</${groupName}>\n\n`;
      }
    });
    
    // Process standalone input nodes (not connected to groups)
    const standaloneInputs = inputNodes.filter(node => {
      return !isConnectedToGroup(node.id, edges, groupNodes);
    });
    
    standaloneInputs.forEach(input => {
      const content = input.data.result || input.data.content || '';
      if (content) {
        const nodeTypeTag = input.type === 'website' ? 'website' : 'custom_text';
        output += `<${nodeTypeTag}>${content}</${nodeTypeTag}>\n`;
      }
    });
    
    return output.trim();
  };

  const findConnectedInputs = (groupNodeId: string, edges: Edge[], inputNodes: Node[]) => {
    const connectedEdges = edges.filter(edge => edge.target === groupNodeId);
    return inputNodes.filter(node => 
      connectedEdges.some(edge => edge.source === node.id)
    );
  };

  const isConnectedToGroup = (nodeId: string, edges: Edge[], groupNodes: Node[]) => {
    return edges.some(edge => 
      edge.source === nodeId && groupNodes.some(group => group.id === edge.target)
    );
  };

  const xmlOutput = generateXMLOutput();

  const copyToClipboard = async () => {
    if (xmlOutput) {
      try {
        await navigator.clipboard.writeText(xmlOutput);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="h-64 bg-gray-50 border-t border-gray-200 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Live XML Output</h3>
        {xmlOutput && (
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Copy
          </button>
        )}
      </div>
      <div className="h-48 bg-white border border-gray-200 rounded p-3 overflow-auto">
        {xmlOutput ? (
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
            {xmlOutput}
          </pre>
        ) : (
          <div className="text-gray-500 text-sm italic">
            Add connectors and connect them to generate XML output...
          </div>
        )}
      </div>
    </div>
  );
}