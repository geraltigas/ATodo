type GraphNode<T> = {
    value: T;
    edges: GraphNode<T>[];
}

class Graph<T> {
    public nodes: GraphNode<T>[] = [];

    public addNode(value: T): GraphNode<T> {
        const newNode: GraphNode<T> = { value, edges: [] };
        this.nodes.push(newNode);
        return newNode;
    }

    public addEdge(node1: GraphNode<T>, node2: GraphNode<T>): void {
        node1.edges.push(node2);
        // If the graph is undirected, we need to add edges in both directions
        // node2.edges.push(node1);
    }
}

export default Graph;