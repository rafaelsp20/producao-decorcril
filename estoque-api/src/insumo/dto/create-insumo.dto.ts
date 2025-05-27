// src/insumo/dto/create-insumo.dto.ts
import { IsString, IsNotEmpty, IsNumber, Min, IsDateString, IsOptional } from 'class-validator';

export class CreateInsumoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantidadeEstoque: number;

  @IsString()
  @IsNotEmpty()
  unidadeMedida: string;

  @IsNumber()
  @Min(0)
  valor: number;

  @IsString()
  @IsOptional()
  fornecedor?: string;

  @IsString()
  @IsOptional()
  formaPagamento?: string;

  @IsString()
  @IsOptional()
  categoria?: string;
}