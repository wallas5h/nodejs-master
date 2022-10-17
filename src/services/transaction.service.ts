import { Response } from "express";
import { v4 as uuid } from "uuid";
import { TransactionsRepository } from "../repository/transactions.repository";
import { Transaction } from "../types/transaction.dto";

import { dateFunction } from "../utils/timeFunction";

export class TransactionsService {
  transactionRepository: TransactionsRepository;

  constructor() {
    this.transactionRepository = new TransactionsRepository();
  }

  async getAllTransactions(res: Response) {
    const data = await this.transactionRepository.getAllTransactions();

    if (!data) {
      return res.status(400).json({
        message: "No transactions or no DB",
      });
    }

    return res.json(data);
  }

  async addTransaction(res: Response, body: Transaction) {
    const { id, date, status } = body;
    const subscription = dateFunction(date, status);
    const inputRow: Transaction = {
      id: id && id !== "" ? id : uuid(),
      status,
      date,
      subscription,
    };

    const transactions:
      | Transaction[]
      | null = await this.transactionRepository.getAllTransactions();

    if (!transactions) {
      await this.transactionRepository.createTransactionsCsv(inputRow);
    }

    if (transactions) {
      let isIdExist = false;

      // if id exist in transactions
      transactions.forEach((row) => {
        if (row.id === id) {
          row.subscription = subscription;
          isIdExist = true;
        }
      });

      console.log(isIdExist);

      if (!isIdExist) {
        transactions.push(inputRow);
      }
      const saveFileStatus = await this.transactionRepository.saveTransactions(
        transactions
      );

      if (!saveFileStatus) {
        return res.status(500).json({ message: "Sorry, try later." });
      }
    }

    return res.json({ subscription });
  }

  async updateTransaction(id: string, res: Response) {
    const transactions:
      | Transaction[]
      | null = await this.transactionRepository.getAllTransactions();

    let isRowInDb: boolean = false;
    let subscriptionDate: string | undefined;

    if (!transactions) {
      return res.status(500).json({
        message: "Sorry, try later.",
      });
    }

    transactions.forEach((row) => {
      if (row.id === id) {
        row.subscription = dateFunction(row.date, row.status);
        isRowInDb = true;
        subscriptionDate = row.subscription;
      }
    });

    if (!isRowInDb) {
      return res.status(404).json({ message: "Invalid id" });
    }

    const saveFileStatus = await this.transactionRepository.saveTransactions(
      transactions
    );

    if (!saveFileStatus) {
      return res.status(500).json({ message: "Sorry, try later." });
    }

    return res.json({ message: "Transaction save.", subscriptionDate });
  }
}
