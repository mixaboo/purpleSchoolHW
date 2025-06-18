import { IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class MonthlyReportDto {
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @Type(() => Number)
  @Min(2000)
  @Max(2100)
  year: number;
}
