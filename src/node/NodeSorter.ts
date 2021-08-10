import Node from '../node/Node';

export default class NodeSorter {
  static sortTopologically(nodes: Node[]): Node[] {
    const beginNode = this.__findBeginNode(nodes);
    return [];
  }

  private static __findBeginNode(nodes: Node[]): Node {
    let noInputSocketNode: Node | undefined;
    for (const node of nodes) {
      const sockets = node.inputSockets;
      const inputSocketCount = Object.keys(sockets).length;
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
}
