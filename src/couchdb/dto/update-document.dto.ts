import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateDocumentDto {
  @IsString()
  @IsNotEmpty()
  readonly _id: string;

  @IsString()
  @IsNotEmpty()
  readonly _rev: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;
}
