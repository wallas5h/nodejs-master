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
    const resPerPage = 10; //results per page

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

      if ((pageNr - 1) * resPerPage > data.length) {
        throw new ValidationError("Max amount of pages reached");
      }

      const paginatedData = data.slice(
        resPerPage * (pageNr - 1),
        resPerPage * pageNr
      );

      data = paginatedData;
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

      if (!isIdExist) {
        transactions.push(inputRow);
      }
      const saveFileStatus = await this.transactionRepository.saveTransactions(
        transactions
      );

      if (!saveFileStatus) {
        throw new NotFoundError("Sorry, try later");
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

    return res.json({ message: "Transaction save.", subscriptionDate });
  }
}
