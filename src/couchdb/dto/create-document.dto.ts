import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  readonly subdomain: string;

  @IsString()
  @IsNotEmpty()
  readonly owner: string;

  @IsString()
  @IsNotEmpty()
  readonly zonefile: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsString()
  @IsNotEmpty()
  readonly transactid: string;


}
