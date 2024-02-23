abstract class Node {
  keys: number[];
  constructor() {
    this.keys = [];
  }
  abstract insert(key: number, value: unknown, order: number): [number | null, Node | null];
  abstract search(key: number): unknown;
  abstract draw(prefix: string): void;
}

class BPlusTree {
  rootNode: Node;
  order: number;

  constructor(order: number) {
    this.rootNode = new LeafNode(null);
    this.order = order;
  }

  insert(key: number, value: unknown) {
    const [newKey, newChild] = this.rootNode.insert(key, value, this.order);
    if (newKey !== null && newChild !== null) {
      const newRoot = new InternalNode(null);
      newRoot.keys.push(newKey);
      newRoot.children.push(this.rootNode, newChild);
      this.rootNode = newRoot;
    }
  }

  search(key: number): unknown {
    return this.rootNode.search(key);
  }

  draw(): void {
    console.log("B+ Tree Structure:");
    this.rootNode.draw("");
  }
}

class InternalNode extends Node {
  children: Node[];

  constructor(parent: Node | null) {
    super();
    this.children = [];
  }

  insert(key: number, value: unknown, order: number): [number | null, Node | null] {
    let index = this.findChildIndex(key);
    const [newKey, newChild] = this.children[index].insert(key, value, order);

    if (newKey !== null && newChild !== null) {
      this.keys.splice(index, 0, newKey);
      this.children.splice(index + 1, 0, newChild);

      if (this.keys.length > order) {
        const splitIndex = Math.floor(this.keys.length / 2);
        const splitKey = this.keys[splitIndex];
        const newInternalNode = new InternalNode(null);
        newInternalNode.keys = this.keys.splice(splitIndex + 1);
        newInternalNode.children = this.children.splice(splitIndex + 1);
        return [splitKey, newInternalNode];
      }
    }

    return [null, null];
  }

  search(key: number): unknown {
    let index = this.findChildIndex(key);
    return this.children[index].search(key);
  }

  draw(prefix: string): void {
    console.log(`${prefix} └── [${this.keys.join(", ")}]`);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].draw(`${prefix}     `);
    }
  }

  private findChildIndex(key: number): number {
    for (let i = 0; i < this.keys.length; i++) {
      if (key < this.keys[i]) {
        return i;
      }
    }
    return this.children.length - 1;
  }
}

class LeafNode extends Node {
  values: unknown[];

  constructor(parent: Node | null) {
    super();
    this.values = [];
  }

  insert(key: number, value: unknown, order: number): [number | null, Node | null] {
    let index = this.findKeyIndex(key);
    if (this.keys[index] === key) {
      throw new Error(`Duplicate key '${key}' found.`);
    }
    this.keys.splice(index, 0, key);
    this.values.splice(index, 0, value);

    if (this.keys.length > order) {
      const splitIndex = Math.floor(this.keys.length / 2);
      const splitKey = this.keys[splitIndex];
      const newLeafNode = new LeafNode(null);
      newLeafNode.keys = this.keys.splice(splitIndex);
      newLeafNode.values = this.values.splice(splitIndex);
      return [splitKey, newLeafNode];
    }

    return [null, null];
  }

  search(key: number): unknown {
    let index = this.findKeyIndex(key);
    if (this.keys[index] === key) return this.values[index];
    return [];
  }

  draw(prefix: string): void {
    console.log(`${prefix} └── (${this.keys.join(", ")})`);
  }

  private findKeyIndex(key: number): number {
    for (let i = 0; i < this.keys.length; i++) {
      if (key <= this.keys[i]) {
        return i;
      }
    }
    return this.keys.length;
  }
}

// Example usage:
const bPlusTree = new BPlusTree(4);
bPlusTree.insert(1, "Value1");
bPlusTree.insert(2, "Value2");
bPlusTree.insert(3, "Value3");
bPlusTree.insert(4, "Value4");

console.log("Before adding 5 to the tree");
bPlusTree.draw();
console.log("\n");

bPlusTree.insert(5, "Value5");
console.log("After adding 5 to the tree");

bPlusTree.draw();
