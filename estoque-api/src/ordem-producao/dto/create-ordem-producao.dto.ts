// src/ordem-producao/dto/create-ordem-producao.dto.ts
import { IsNumber, IsNotEmpty, Min, IsOptional, IsString } from 'class-validator';

export class CreateOrdemProducaoDto {
  @IsNumber()
  @IsNotEmpty()
  produtoId: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantidade: number;

  @IsOptional()
  @IsString()
  nomeCliente?: string;

  @IsOptional()
  @IsString()
  pedidoVenda?: string;
}