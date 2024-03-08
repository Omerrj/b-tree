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

const dynamicHash = (key: number, n: number) => {
  return key % n;
};

const dynamicBuckets: Array<{ key: number; data: unknown }[]> = [[]];

const addDynamic = (key: number, data: unknown) => {
  const hashCode = dynamicHash(key, dynamicBuckets.length);

  while (hashCode >= dynamicBuckets.length) dynamicBuckets.push([]);

  dynamicBuckets[hashCode].push({ key, data });
};

const searchDynamic = (key: number): unknown | null => {
  const hashCode = dynamicHash(key, dynamicBuckets.length);
  const bucket = dynamicBuckets[hashCode];

  for (const item of bucket) {
    if (key === item.key) return item.data;
  }

  return null;
};

addDynamic(123, "Paniry PUK");
addDynamic(432, "Paniry Kiri");
addDynamic(205, "Sharbati Rani");

console.log(JSON.stringify(dynamicBuckets, null, 2));

console.log(searchDynamic(123));
