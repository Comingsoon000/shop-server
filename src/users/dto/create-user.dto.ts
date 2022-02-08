export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly avatar: string;
  readonly cart: string;
  readonly cart_count: number;
  readonly total_cost: number;
  readonly is_admin: boolean;
  readonly is_auth: boolean;
}
