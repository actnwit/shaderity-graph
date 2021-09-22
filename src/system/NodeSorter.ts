import Node from '../node/Node';
import {NodeId} from '../types/CommonType';

export default class NodeSorter {
  static sortTopologically(nodes: Node[]): Node[] {
    // Will be change the algorithm like the following:
    // https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/
    if (nodes.length === 0) {
      return nodes;
    }

    const beginNode = this.__findBeginNode(nodes);
    const sortedNodes = this.__sortTopologically(beginNode, nodes);
    return sortedNodes;
  }

  private static __findBeginNode(nodes: Node[]): Node {
    let noInputSocketNode: Node | undefined;
    for (const node of nodes) {
      const sockets = node._inputSockets;
      const inputSocketCount = sockets.length;
      if (inputSocketCount === 0) {
        noInputSocketNode = node;
        break;
      }
    }

    if (noInputSocketNode == null) {
      throw Error('NodeSorter:__findBeginNode: begin node not found');
    }

    return noInputSocketNode;
  }

  private static __sortTopologically(beginNode: Node, unsortedNodes: Node[]) {
    const ignoredInputNodeIds: NodeId[] = [beginNode.id];
    const sortedNodes: Node[] = [beginNode];

    const indexOfBeginNode = unsortedNodes.indexOf(beginNode);
    unsortedNodes.splice(indexOfBeginNode, 1);

    // take out the nodes that do not have the nodes contained in unsortedNodes as input nodes.
    while (unsortedNodes.length !== 0) {
      const nodesWillBeSorted: Node[] = new Array(unsortedNodes.length);
      unsortedNodes.forEach(node => {
        let hasNoUnsortedInputNode = true;

        for (const inputSocket of node._inputSockets.values()) {
          if (ignoredInputNodeIds.indexOf(inputSocket.connectedNodeId) === -1) {
            hasNoUnsortedInputNode = false;
            break;
          }
        }

        if (hasNoUnsortedInputNode) {
          nodesWillBeSorted.push(node);
        }
      });

      nodesWillBeSorted.forEach(node => {
        ignoredInputNodeIds.push(node.id);
        sortedNodes.push(node);
        unsortedNodes.splice(unsortedNodes.indexOf(node), 1);
      });

      if (nodesWillBeSorted.length === 0) {
        throw Error('NodeSorter.__sortTopologically: failed to sort...');
      }
    }

    return sortedNodes;
  }
}
