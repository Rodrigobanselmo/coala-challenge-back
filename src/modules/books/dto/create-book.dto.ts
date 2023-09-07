import { IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString({ each: true })
  title: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsString({ each: true })
  @IsOptional()
  authors?: string[];

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  smallThumbnail?: string;

  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @IsOptional()
  @IsString()
  googleId?: string;
}
