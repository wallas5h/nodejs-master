import "express-async-errors";
import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { TransactionsController } from "./src/controlers/transactions.controller";
import { TransactionCreateDto } from "./src/types/transaction.dto";

const app = createExpressServer({
  controllers: [TransactionsController, TransactionCreateDto],
});

app.listen(3001, () => {
  console.log("server started at http://localhost:3001");
});
