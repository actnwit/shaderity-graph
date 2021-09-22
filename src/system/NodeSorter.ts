import Node from '../node/Node';

export default class NodeSorter {
  static sortTopologically(unsortedNodes: Node[]): Node[] {
    // this sort is based on https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/

    // Storage of edges (e.g. edge[0] = [1] means unsortedNodes[0] has the edge to unsortedNodes[1])
    const edges: number[][] = Array(unsortedNodes.length);
    for (let i = 0; i < edges.length; i++) {
      edges[i] = [];
    }

    // count input nodes
    const inputNodeCounts: number[] = Array(unsortedNodes.length);
    inputNodeCounts.fill(0);
    for (let i = 0; i < unsortedNodes.length; i++) {
      const node = unsortedNodes[i];
      for (const inputSocket of node._inputSockets) {
        const inputNodeId = inputSocket.connectedNodeId;
        if (inputNodeId === -1) {
          // non-connected socket
          continue;
        }

        const inputNode = Node.getNodeById(inputNodeId);
        const inputIndex = unsortedNodes.findIndex(node => node === inputNode);
        inputNodeCounts[i]++;
        edges[inputIndex].push(i);
      }
    }

    // pick no input nodes
    const noUnsortedInputNodes: Node[] = [];
    for (let i = 0; i < inputNodeCounts.length; i++) {
      const inputNodeCount = inputNodeCounts[i];
      if (inputNodeCount === 0) {
        noUnsortedInputNodes.push(unsortedNodes[i]);
      }
    }

    // decrease input counts and sort topologically
    const sortedNodes: Node[] = [];
    while (noUnsortedInputNodes.length !== 0) {
      const sortingNode = noUnsortedInputNodes.shift() as Node;
      sortedNodes.push(sortingNode);

      const sortingNodeIndex = unsortedNodes.findIndex(
        node => node === sortingNode
      );

      for (const index of edges[sortingNodeIndex]) {
        inputNodeCounts[index]--;

        if (inputNodeCounts[index] === 0) {
          const noUnsortedInputNode = unsortedNodes[index];
          noUnsortedInputNodes.push(noUnsortedInputNode);
        }
      }
    }

    if (sortedNodes.length !== unsortedNodes.length) {
      console.error(
        'NodeSorter.__sortTopologically: failed to topological sort.'
      );
    }
    return sortedNodes;
  }
}
