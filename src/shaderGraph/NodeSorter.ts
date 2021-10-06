import Node from '../node/Node';
import ConnectableInputSocket from '../sockets/input/ConnectableInputSocket';

export default class NodeSorter {
  static sortTopologically(unsortedNodes: Node[]): Node[] {
    // this sort is based on https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/

    // Storage of edges (e.g. edge[0] = [1] means unsortedNodes[0] has the edge to unsortedNodes[1])
    const edges: number[][] = Array(unsortedNodes.length);
    for (let i = 0; i < edges.length; i++) {
      edges[i] = [];
    }

    const inputNodeCounts = this.__countInputNodesAndSetEdges(
      unsortedNodes,
      edges
    );

    const noUnsortedInputNodes = this.__getNoInputNodes(
      unsortedNodes,
      inputNodeCounts
    );

    // decrease input counts and sort topologically
    const sortedNodes = this.__sortTopologically(
      unsortedNodes,
      inputNodeCounts,
      noUnsortedInputNodes,
      edges
    );

    if (sortedNodes.length !== unsortedNodes.length) {
      console.error(
        'NodeSorter.__sortTopologically: failed to topological sort.'
      );
    }
    return sortedNodes;
  }

  private static __countInputNodesAndSetEdges(
    unsortedNodes: Node[],
    edges: number[][]
  ) {
    const inputNodeCounts: number[] = Array(unsortedNodes.length);
    inputNodeCounts.fill(0);

    for (let i = 0; i < unsortedNodes.length; i++) {
      const node = unsortedNodes[i];
      for (const inputSocket of node._inputSockets) {
        if (inputSocket.className !== 'ConnectableInputSocket') {
          continue;
        }

        const inputNode = (inputSocket as ConnectableInputSocket).connectedNode;
        if (inputNode == null) {
          // non-connected socket
          continue;
        }

        const inputIndex = unsortedNodes.findIndex(node => node === inputNode);
        inputNodeCounts[i]++;
        edges[inputIndex].push(i);
      }
    }
    return inputNodeCounts;
  }

  private static __getNoInputNodes(
    unsortedNodes: Node[],
    inputNodeCounts: number[]
  ) {
    const noUnsortedInputNodes: Node[] = [];
    for (let i = 0; i < inputNodeCounts.length; i++) {
      const inputNodeCount = inputNodeCounts[i];
      if (inputNodeCount === 0) {
        noUnsortedInputNodes.push(unsortedNodes[i]);
      }
    }

    return noUnsortedInputNodes;
  }

  private static __sortTopologically(
    unsortedNodes: Node[],
    inputNodeCounts: number[],
    noUnsortedInputNodes: Node[],
    edges: number[][]
  ) {
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

    return sortedNodes;
  }
}
