import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ListQueryDto } from '../../dto/list-query.dto';

export class SkillLevelQueryDto extends ListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skillId?: number;
}
