export class UpdateCartDto {
  readonly user: string;
  readonly products: { count: number; product: string }[];
}
