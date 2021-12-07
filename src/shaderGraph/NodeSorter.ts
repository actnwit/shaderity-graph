import ShaderityNode from '../node/ShaderityNode';
import StandardInputSocket from '../sockets/input/StandardInputSocket';
import VaryingInputSocket from '../sockets/input/VaryingInputSocket';
import {ISocket} from '../sockets/interface/ISocket';
import {ShaderStage} from '../types/CommonEnum';

/**
 * This class sorts nodes.
 */
export default class NodeSorter {
  /**
   * Sort the nodes topologically based on Kahn's algorithm
   */
  static sortTopologically(unsortedNodes: ShaderityNode[]): ShaderityNode[] {
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

  /**
   * @private
   * Calculate how many nodes are in the input of each node.
   * In addition, store the specific edge information in the "edges" array.
   */
  private static __countInputNodesAndSetEdges(
    unsortedNodes: ShaderityNode[],
    edges: number[][]
  ) {
    const inputNodeCounts: number[] = Array(unsortedNodes.length);
    inputNodeCounts.fill(0);

    for (let i = 0; i < unsortedNodes.length; i++) {
      const node = unsortedNodes[i];
      for (const socket of node._sockets) {
        const isTargetSocket =
          this.__isInputSocketWhoseConnectedOutputIsInSameShader(socket, node);
        if (!isTargetSocket) {
          continue;
        }

        const inputNode = (socket as StandardInputSocket | VaryingInputSocket)
          .connectedNode;
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

  private static __isInputSocketWhoseConnectedOutputIsInSameShader(
    inputSocket: ISocket,
    node: ShaderityNode
  ) {
    if (inputSocket.className === 'StandardInputSocket') {
      return true;
    }

    if (
      node.shaderStage === ShaderStage.Vertex &&
      inputSocket.className === 'VaryingInputSocket'
    ) {
      return true;
    }

    return false;
  }

  /**
   * @private
   * Find nodes that have no input nodes.
   */
  private static __getNoInputNodes(
    unsortedNodes: ShaderityNode[],
    inputNodeCounts: number[]
  ) {
    const noUnsortedInputNodes: ShaderityNode[] = [];
    for (let i = 0; i < inputNodeCounts.length; i++) {
      const inputNodeCount = inputNodeCounts[i];
      if (inputNodeCount === 0) {
        noUnsortedInputNodes.push(unsortedNodes[i]);
      }
    }

    return noUnsortedInputNodes;
  }

  /**
   * @private
   * Sorting nodes
   */
  private static __sortTopologically(
    unsortedNodes: ShaderityNode[],
    inputNodeCounts: number[],
    noUnsortedInputNodes: ShaderityNode[],
    edges: number[][]
  ) {
    const sortedNodes: ShaderityNode[] = [];
    while (noUnsortedInputNodes.length !== 0) {
      const sortingNode = noUnsortedInputNodes.shift() as ShaderityNode;
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
