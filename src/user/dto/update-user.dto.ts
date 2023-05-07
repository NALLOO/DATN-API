import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @IsPhoneNumber('VN', {
    message: 'Phone number not valid!',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
