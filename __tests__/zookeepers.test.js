const fs = require("fs");
const {
  filterByQuery,
  findById,
  createNewZookeeper,
  validateZookeeper,
} = require("../lib/zookeepers");
const { zookeepers } = require("../data/zookeepers.json");

// mock fs methods
jest.mock("fs");

test("create a zookeeper object", () => {
  const zookeeper = createNewZookeeper({ name: "Sven", id: "69" }, zookeepers);

  expect(zookeeper.name).toBe("Sven");
  expect(zookeeper.id).toBe("69");
});

test("filter by query", () => {
  const startingZookeepers = [
    {
      id: "1",
      name: "Raksha",
      age: 31,
      favoriteAnimal: "penguin",
    },
    {
      id: "2",
      name: "Isabella",
      age: 67,
      favoriteAnimal: "bear",
    },
  ];

  const updatedZookeepers = filterByQuery({ age: 31 }, startingZookeepers);

  expect(updatedZookeepers.length).toEqual(1);
});

test("find by ID", () => {
  const startingZookeepers = [
    {
      id: "1",
      name: "Raksha",
      age: 31,
      favoriteAnimal: "penguin",
    },
    {
      id: "2",
      name: "Isabella",
      age: 67,
      favoriteAnimal: "bear",
    },
  ];

  const result = findById("2", startingZookeepers);

  expect(result.name).toBe("Isabella");
});

test("validates age", () => {
  const zookeeper = {
    id: "2",
    name: "Isabella",
    age: 67,
    favoriteAnimal: "bear",
  };

  const invalidZookeeper = {
    id: "1",
    name: "Raksha",
    age: "31",
    favoriteAnimal: "penguin",
  };

  const result = validateZookeeper(zookeeper);
  const result2 = validateZookeeper(invalidZookeeper);

  expect(result).toBe(true);
  expect(result2).toBe(false);
});
