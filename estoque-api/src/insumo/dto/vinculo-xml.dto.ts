export class VinculoXmlDto {
  itens: Array<{
    descricaoXml: string;
    insumoId?: number;
    novo?: boolean;
    nome?: string;
    unidade?: string;
    quantidade?: number;
    valor?: number;
  }>;
}