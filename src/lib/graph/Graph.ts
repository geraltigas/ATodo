interface Graph<T> {
  nodes: T[];
  edges: [string, string][];

  // public addNode(value: T): T {
  //   this.nodes.push(value);
  //   console.log('addNode', value);
  //   return value;
  // }
  //
  // public addEdge(node1: string, node2: string): void {
  //   this.edges.push([node1, node2]);
  //   // If the graph is undirected, we need to add edges in both directions
  //   // node2.edges.push(node1);
  // }
  //
  // public forEachNode(callback: (node: T) => void): void {
  //   this.nodes.forEach(callback);
  // }
  //
  // public forEachEdge(callback: (edge: [string, string]) => void): void {
  //   this.edges.forEach(callback);
  // }
  //
  // public getNodes(): T[] {
  //   return this.nodes;
  // }
}

export default Graph;
