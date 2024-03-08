function staticHash(key: number) {
  return key % 3;
}

const buckets: Array<{ key: number; data: unknown }[]> = [[], [], []];

function addStatic(key: number, data: unknown) {
  const hashCode = staticHash(key);
  buckets[hashCode].push({ key, data });
}

function searchStatic(key: number): unknown | null {
  const hashCode = staticHash(key);
  const bucket = buckets[hashCode];

  for (const item of bucket) {
    if (key === item.key) return item.data;
  }

  return null;
}

addStatic(123, "Paniry PUK");
addStatic(432, "Paniry Kiri");
addStatic(205, "Sharbati Rani");

console.log(JSON.stringify(buckets, null, 2));

console.log(searchStatic(123));
