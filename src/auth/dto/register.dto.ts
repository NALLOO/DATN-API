import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator"
import { Role } from "../enum/role.enum"

export class  RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('VN', {
    message: 'phone field must be a phone number'
  })
  phone: string

  @IsEnum(Role)
  @IsNotEmpty()
  role: number
}
