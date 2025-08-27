// dto/register-doctor.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsInt } from 'class-validator';

export class RegisterDoctorDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  citizen_id: string;
  
  @IsNotEmpty()
  birth_date: Date;

  // field ที่เฉพาะหมอเท่านั้น
  @IsInt()
  specialtyId: number;

  @IsOptional()
  licenseNo?: string;

  @IsOptional()
  bio?: string;

}
