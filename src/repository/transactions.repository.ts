import Csvtojson from "csvtojson";
import fs from "fs/promises";
import { parse } from "json2csv";
import path from "path";
import { Transaction } from "../types/transaction.dto";
import { NotFoundError } from "../utils/errors";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

export class TransactionsRepository {
  private csvFile = path.join(__dirname, "../csv/transactions.csv");

  getAllTransactions = async () => {
    try {
      return await Csvtojson()
        .fromFile(this.csvFile)
        .then((source) => {
          return source;
        });
    } catch (error) {
      return null;
    }
  };

  createTransactionsCsv = async (data: Transaction) => {
    try {
      const csvWriter = createCsvWriter({
        path: this.csvFile,
        header: [
          { id: "id", title: "id" },
          { id: "status", title: "status" },
          { id: "date", title: "date" },
          { id: "subscription", title: "subscription" },
        ],
      });
      const record = [data];
      csvWriter.writeRecords(record);
    } catch (error) {
      throw new NotFoundError("Sorry, try later");
    }
  };

  saveTransactions = async (data: Transaction[]) => {
    try {
      await fs.writeFile(this.csvFile, parse(data));
      return true;
    } catch (error) {
      throw new NotFoundError("Sorry, try later");
    }
  };
}
