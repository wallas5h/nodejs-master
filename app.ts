import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { TransactionsController } from "./src/controlers/transactions.controller";

const app = createExpressServer({
  controllers: [TransactionsController],
});

app.listen(3001, "0.0.0.0", () => {
  console.log("server started at http://localhost:3001");
});
