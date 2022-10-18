import { Response } from "express";
import { v4 as uuid } from "uuid";
import { TransactionsRepository } from "../repository/transactions.repository";
import { Transaction } from "../types/transaction.dto";
import { NotFoundError, ValidationError } from "../utils/errors";

import { dateFunction } from "../utils/timeFunction";

export class TransactionsService {
  transactionRepository: TransactionsRepository;

  constructor() {
    this.transactionRepository = new TransactionsRepository();
  }

  async getTransactions(res: Response, page?: string) {
    const resultsPerPage = 10; //results per page

    let data:
      | Transaction[]
      | null = await this.transactionRepository.getAllTransactions();

    if (!data) {
      throw new NotFoundError(
        "Not found transactions. Add transaction or try later."
      );
    }

    if (!page) {
      data = data;
    } else {
      let pageNr = parseInt(page);

      if (page.includes("%")) {
        throw new ValidationError("Incorrect page number");
      }
      if (isNaN(pageNr) || pageNr < 1) {
        throw new ValidationError("Incorrect page number");
      }

      if ((pageNr - 1) * resultsPerPage > data.length) {
        throw new ValidationError("Max amount of pages has been exceeded");
      }

      const paginatedData = data.slice(
        resultsPerPage * (pageNr - 1),
        resultsPerPage * pageNr
      );

      data = paginatedData;
    }

    return res.json(data);
  }

  async addTransaction(body: Transaction, res: Response) {
    const { id, date, status } = body;
    const subscription = dateFunction(date, status);

    if (!date || !status) {
      throw new Error("Missing date or status");
    }

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
      let isExistIdInDB = false;

      // if id exist in transactions
      transactions.forEach((row) => {
        if (row.id === id) {
          row.subscription = subscription;
          isExistIdInDB = true;
        }
      });

      if (!isExistIdInDB) {
        transactions.push(inputRow);
      }
      const saveFileStatus = await this.transactionRepository.saveTransactions(
        transactions
      );

      if (!saveFileStatus) {
        throw new Error("Sorry, try later");
      }
    }

    return res.json({ newDate: subscription });
  }

  async updateTransaction(id: string, res: Response) {
    if (!id) {
      throw new ValidationError("No id provide.");
    }

    const transactions:
      | Transaction[]
      | null = await this.transactionRepository.getAllTransactions();

    let isRowInDb: boolean = false;
    let subscriptionDate: string | undefined;

    if (!transactions) {
      throw new NotFoundError("Sorry, try later");
    }

    transactions.forEach((row) => {
      if (row.id === id) {
        row.subscription = dateFunction(row.date, row.status);
        isRowInDb = true;
        subscriptionDate = row.subscription;
      }
    });

    if (!isRowInDb) {
      throw new ValidationError("Invalid id");
    }

    let saveFileStatus: boolean = false;
    saveFileStatus = await this.transactionRepository.saveTransactions(
      transactions
    );

    if (!saveFileStatus) {
      throw new NotFoundError("Sorry, try later");
    }

    return res.json({
      message: "Transaction save.",
      newDate: subscriptionDate,
    });
  }
}
