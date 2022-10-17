import Csvtojson from "csvtojson";
import fs from "fs/promises";
import { parse } from "json2csv";
import path from "path";
import { Transaction } from "../types/transaction.dto";
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
    const { id, date, status, subscription } = data;

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
  };

  saveTransactions = async (data: Transaction[]) => {
    try {
      await fs.writeFile(this.csvFile, parse(data));
      return true;
    } catch (error) {
      return false;
    }
  };
}
