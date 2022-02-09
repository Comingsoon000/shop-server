export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  readonly avatar: string;
  readonly cart: string;
  readonly is_admin: boolean;
  readonly is_auth: boolean;
}
