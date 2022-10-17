import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from "class-validator";

export interface Transaction {
  id?: string;
  status: boolean;
  date: string;
  subscription?: string | Date;
}

export class TransactionCreateDto {
  // @IsString()
  id?: string;

  @IsBoolean()
  @IsNotEmpty()
  status!: boolean;

  @IsString()
  @IsNotEmpty()
  date!: string;
}

export class pageQueryDto {
  @IsNumberString()
  page!: boolean;
}
