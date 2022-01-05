import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'You must provide an user name or email' })
  userNameOrEmail: string;

  @IsNotEmpty({ message: 'You must provide the password' })
  password: string;
}
