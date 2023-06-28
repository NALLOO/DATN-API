import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

export class  CreateCoachDTO {
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

}
