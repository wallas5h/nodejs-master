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
      const transactions = await Csvtojson()
        .fromFile(this.csvFile)
        .then((source) => {
          return source;
        });

      if (!transactions) {
        return null;
      }
      return transactions;
    } catch (error) {
      return null;
    }
  };

  createTransactionsCsv = async (data: Transaction) => {
    // this.validateInputData(data);
    const { id, status, date, subscription } = data;

    if (!id || !status || !date || !subscription) {
      throw new Error("Invalid input data to create csv file");
    }

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
      throw new Error("Sorry, try later");
    }
  };

  saveTransactions = async (data: Transaction[]) => {
    if (!data) {
      throw new Error("No data");
    }

    try {
      await fs.writeFile(this.csvFile, parse(data));
      return true;
    } catch (error) {
      throw new Error("Sorry, try later");
    }
  };

  validateInputData(data: Transaction) {
    const { id, status, date, subscription } = data;

    if (!id || !status || !date || !subscription) {
      throw new Error("Invalid input data to create csv file");
    }
  }
}
