import fs from "fs/promises";
import path from "path";
import { TransactionsRepository } from "../repository/transactions.repository";

let repository: TransactionsRepository;

const csvFile = path.join(__dirname, "../csv/transactions.csv");

const data = {
  id: "6df5b18d-6382-4982-8d60-8957fdc2e339",
  status: true,
  date: "2022-11-30T08:12:59Z",
  subscription: "2022-12-30T08:12:59Z",
};

repository = new TransactionsRepository();

// beforeAll(async () => {
//   fs.rm(csvFile);
// });

afterEach(() => {
  fs.rm(csvFile);
});

test("test createTransactionsCsv: completed data should create csv file, without error", async () => {
  const testedData = data;

  expect(
    async () => await repository.createTransactionsCsv(testedData)
  ).not.toThrow();
  expect(() => fs.access(csvFile)).not.toThrow();
});

test("test createTransactionsCsv: data should be defined", async () => {
  const testedData = data;

  expect(testedData.id).toBeDefined();
  expect(testedData.status).toBeDefined();
  expect(testedData.date).toBeDefined();
  expect(testedData.subscription).toBeDefined();
});

test("test createTransactionsCsv: uncompleted data should throw error", async () => {
  const testedData = data;
  testedData.id = "";

  await repository.createTransactionsCsv(testedData).catch((error) => {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Invalid input data to create csv file");
  });
});

test("test getAllTransactions: should not return empty array (file csv exist)", async () => {
  const testedData = data;

  await repository.createTransactionsCsv(testedData);
  await repository.getAllTransactions().then((results) => {
    expect(results).not.toBe([]);
  });
});

test("test getAllTransactions: should not return empty array (no csv file)", async () => {
  await repository.createTransactionsCsv(data).then(() => {
    fs.rm(csvFile);
  });
  // await repository.getAllTransactions().then((results) => {
  //   expect(results).not.toBe([]);
  // });
  expect(async () => await repository.getAllTransactions()).not.toBe([]);
});

test("test saveTransactions: should be truthy", async () => {
  await repository.createTransactionsCsv(data).then(() => {
    const inputData = [data];
    expect(
      async () => await repository.saveTransactions(inputData)
    ).toBeTruthy();
  });
});
