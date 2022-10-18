import { getMockRes } from "@jest-mock/express";
import { TransactionsService } from "../services/transaction.service";
import { TransactionCreateDto } from "../types/transaction.dto";

const { res } = getMockRes();

let service: TransactionsService;

const data = {
  status: true,
  date: "2022-11-30T08:12:59Z",
};

const newDate = JSON.stringify({
  newDate: "2022-12-30T08:12:59Z",
});

beforeAll(async () => {
  service = new TransactionsService();
});

test("test addTransaction: completed data should return new date, without error", async () => {
  expect(async () => await service.addTransaction(data, res)).not.toThrow();
  expect(async () => await service.addTransaction(data, res)).toBeDefined();
});

describe("addTransaction()", () => {
  it(" incorrect data should throw Error", async () => {
    const inputData: TransactionCreateDto = data;
    inputData.date = "";

    await service.addTransaction(inputData, res).catch((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Missing date or status");
    });
  });
});

describe("getTransactions()", () => {
  it(" incorrect data should throw Error", async () => {
    const page: string = "";

    await service.getTransactions(res, page).then((data) => {
      expect(data).toBeTruthy();
    });
  });
});

describe("updateTransaction()", () => {
  it("no id should throw error", async () => {
    const id: string = "";

    await service.updateTransaction(id, res).catch((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("No id provide.");
    });
  });

  it("incorrect id should throw error", async () => {
    const id: string = "asdfghjk";

    await service.updateTransaction(id, res).catch((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Invalid id");
    });
  });
});
