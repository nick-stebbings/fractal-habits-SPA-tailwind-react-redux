export interface Node {
  id: number;
  lft: number;
  rgt: number;
  parentId: number;
}

// export interface NewNodePayload {
//   nodeId: string;
//   node: Node;
// }

// export interface DeleteNodePayload {
//   nodeId: string;
// }

// export interface UpdateNodePayload {
//   nodeId: string;
//   nodePatch: Partial<Node>;
// }
