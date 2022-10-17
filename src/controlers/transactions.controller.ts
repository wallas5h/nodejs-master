import { Response } from "express";
import { Body, Controller, Get, Param, Post, Res } from "routing-controllers";
import { TransactionsService } from "../services/transaction.service";
import { Transaction } from "../types/transaction.dto";

@Controller(`/api`)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {
    this.transactionsService = new TransactionsService();
  }

  @Get("/transactions")
  get(@Res() res: Response) {
    return this.transactionsService.getAllTransactions(res);
  }

  @Post("/transactions")
  post(@Body() transaction: Transaction, @Res() res: Response) {
    return this.transactionsService.addTransaction(res, transaction);
  }

  @Post("/transactions/:id")
  update(@Param("id") id: string, @Res() res: Response) {
    return this.transactionsService.updateTransaction(id, res);
  }
}
