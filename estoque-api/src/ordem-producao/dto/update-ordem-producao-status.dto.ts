// src/ordem-producao/dto/update-ordem-producao-status.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrdemProducaoStatus } from '../../common/enums/ordem-producao-status.enum';

export class UpdateOrdemProducaoStatusDto {
  @IsEnum(OrdemProducaoStatus)
  @IsNotEmpty()
  status: OrdemProducaoStatus;
}