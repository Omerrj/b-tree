# B+ Tree Implementation in TypeScript

This repository contains an implementation of a B+ tree in TypeScript, along with an example usage.

## B+ Tree

A B+ tree is a self-balancing tree data structure that is commonly used in databases and file systems for efficient storage and retrieval of data. It is similar to a binary search tree but with additional properties that make it suitable for disk-based storage and range queries.

## First Lets Understand What is B+ tree

https://excalidraw.com/#json=U2oMktfNqHtYma3BV8-pz,4BuHZR3lIV7w79SFhYymcA

## Code Explanation

Let's break down each line of code in the provided implementation:

### `abstract class Node`

```typescript
abstract class Node {
  keys: number[];
  constructor() {
    this.keys = [];
  }
  abstract insert(key: number, value: unknown, order: number): [number | null, Node | null];
  abstract search(key: number): unknown;
  abstract draw(prefix: string): void;
}
```

- This abstract class represents the common interface for both internal and leaf nodes of the B+ tree.
- It contains a property keys to store keys and defines abstract methods insert, search, and draw.

## `class BPlusTree`

```typescript
class BPlusTree {
  rootNode: Node;
  order: number;

  constructor(order: number) {
    this.rootNode = new LeafNode(null);
    this.order = order;
  }
}
```

- This class represents the B+ tree itself.
- It has properties rootNode to store the root node of the tree and order to define the maximum number of keys in each node.
- The constructor initializes the B+ tree with a specified order and creates a new leaf node as the root node.

```typescript
insert(key: number, value: unknown) {
    const [newKey, newChild] = this.rootNode.insert(key, value, this.order);
    if (newKey !== null && newChild !== null) {
      const newRoot = new InternalNode(null);
      newRoot.keys.push(newKey);
      newRoot.children.push(this.rootNode, newChild);
      this.rootNode = newRoot;
    }
}
```

- The insert method inserts a key-value pair into the B+ tree.
- It delegates the insertion operation to the root node and handles the creation of a new root node if necessary.
- If newKey and newChild existed, then it means a new node is created so we will update the new root and its children to reflect the new data.

```typescript
search(key: number): unknown {
    return this.rootNode.search(key);
}
```

- The search method searches for a key within the B+ tree.
- It delegates the search operation to the root node and returns the associated value(s).

```typescript
draw(): void {
    console.log("B+ Tree Structure:");
    this.rootNode.draw("");
}
```

- The draw method visually represents the entire tree structure in the console.
- It delegates the drawing operation to the root node.

## `class InternalNode`

```typescript
class InternalNode extends Node {
  children: Node[];

  constructor(parent: Node | null) {
    super();
    this.children = [];
  }
}
```

- This class represents internal nodes of the B+ tree.
- It extends the Node class and adds a property children to store child nodes.

```typescript
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
```

- The insert method inserts a key-value pair into the internal node.
- It delegates the insertion operation to the appropriate child node and splits the node if necessary to maintain the B+ tree properties.
- If the child node returned a newKey with a newChild means we have to split the node into halves and return the new values, else we return null for both and the super class will not update the nodes.

```typescript
search(key: number): unknown {
    let index = this.findChildIndex(key);
    return this.children[index].search(key);
}
```

- The search method searches for a key within the internal node.
- It delegates the search operation to the appropriate child node.

```typescript
draw(prefix: string): void {
    console.log(`${prefix} └── [${this.keys.join(", ")}]`);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].draw(`${prefix}     `);
    }
}
```

- The draw method visually represents the internal node and its children in the console.

## `class LeafNode`

```typescript
class LeafNode extends Node {
  values: unknown;

  constructor(parent: Node | null) {
    super();
    this.values = [];
  }
}
```

- This class represents leaf nodes of the B+ tree.
- It extends the Node class and adds a property values to store values associated with keys.

```typescript
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
```

- The insert method inserts a key-value pair into the leaf node.
- It handles duplicate keys by throwing an error and splits the node if necessary to maintain the B+ tree properties.

```typescript
search(key: number): unknown {
    let index = this.findKeyIndex(key);
    if (this.keys[index] === key) return this.values[index];
    return [];
}
```

- The search method searches for a key within the leaf node and returns the associated value(s).

```typescript
draw(prefix: string): void {
    console.log(`${prefix} └── (${this.keys.join(", ")})`);
}
```

- The draw method visually represents the leaf node in the console.
