export interface ConnectorNode {
  id: string;
  type: 'website' | 'custom' | 'group';
  data: {
    label: string;
    url?: string;
    content?: string;
    groupName?: string;
  };
  position: { x: number; y: number };
}

export interface NodeData {
  label: string;
  url?: string;
  content?: string;
  groupName?: string;
  isExecuting?: boolean;
  result?: string;
}