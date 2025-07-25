'use client';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export default function Sidebar({ onDragStart }: SidebarProps) {
  const connectors = [
    {
      type: 'website',
      label: 'Website Connector',
      description: 'Fetch content from a URL',
      color: 'bg-blue-100 border-blue-300',
    },
    {
      type: 'custom',
      label: 'Custom Instructions',
      description: 'Add custom text content',
      color: 'bg-green-100 border-green-300',
    },
    {
      type: 'googledrive',
      label: 'Google Drive',
      description: 'Access files from Google Drive',
      color: 'bg-yellow-100 border-yellow-300',
    },
    {
      type: 'github',
      label: 'GitHub',
      description: 'Connect to GitHub repositories',
      color: 'bg-gray-100 border-gray-300',
    },
    {
      type: 'codebase',
      label: 'Codebase',
      description: 'Analyze codebase files',
      color: 'bg-indigo-100 border-indigo-300',
    },
    {
      type: 'group',
      label: 'Group',
      description: 'Group inputs into XML tags',
      color: 'bg-purple-100 border-purple-300',
    },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Connectors</h2>
      <div className="space-y-3">
        {connectors.map((connector) => (
          <div
            key={connector.type}
            draggable
            onDragStart={(event) => onDragStart(event, connector.type)}
            className={`${connector.color} p-3 rounded-lg border-2 border-dashed cursor-grab hover:shadow-md transition-shadow`}
          >
            <div className="font-medium text-sm text-gray-800">
              {connector.label}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {connector.description}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-sm font-medium text-yellow-800 mb-1">
          How to use:
        </div>
        <div className="text-xs text-yellow-700">
          Drag connectors to the canvas and connect them to build your prompt workflow.
        </div>
      </div>
    </div>
  );
}