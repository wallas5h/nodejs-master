import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { ApiController } from "./api/api.controller";

const app = createExpressServer({
  controllers: [ApiController],
});

app.listen(3001, "0.0.0.0", () => {
  console.log("server started at http://localhost:3001");
});
