import { Body, Controller, Post } from "routing-controllers";
import { ApiRepository } from "./api.repository";

interface User {
  id: string;
  transactionStatus: boolean;
  date: string | Date;
  newDate?: string | Date;
}

@Controller()
// @Service()
export class ApiController {
  constructor(private apiRepository: ApiRepository) {}

  @Post("/users")
  post(@Body() user: User) {
    return "Saving user...";
  }
}
