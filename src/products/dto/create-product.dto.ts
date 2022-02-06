export class CreateProductDto {
  readonly name: string;
  readonly price: number;
  readonly unitMeasure: string;
  readonly title: string;
  readonly description: string;
  readonly iconUrl: string;
  readonly categories: string[];
}
