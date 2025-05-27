/* eslint-disable prettier/prettier */
// src/produto/dto/create-produto.dto.ts
import { IsString, IsOptional, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProdutoDto {
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
  categoria?: string;
}