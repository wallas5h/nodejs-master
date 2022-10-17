import { Response } from "express";
import { Body, Controller, Get, Param, Post, Res } from "routing-controllers";
import { TransactionsService } from "../services/transaction.service";
import { TransactionCreateDto } from "../types/transaction.dto";

@Controller(`/api`)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {
    this.transactionsService = new TransactionsService();
  }

  @Get("/transactions")
  getAll(@Res() res: Response) {
    return this.transactionsService.getTransactions(res);
  }

  @Get("/transactions/:page")
  getPagination(@Res() res: Response, @Param("page") page: string) {
    return this.transactionsService.getTransactions(res, page);
  }

  @Post("/transactions")
  post(@Body() transaction: TransactionCreateDto, @Res() res: Response) {
    return this.transactionsService.addTransaction(res, transaction);
  }

  @Post("/transactions/:id")
  update(@Param("id") id: string, @Res() res: Response) {
    return this.transactionsService.updateTransaction(id, res);
  }
}
