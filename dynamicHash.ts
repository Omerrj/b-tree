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
