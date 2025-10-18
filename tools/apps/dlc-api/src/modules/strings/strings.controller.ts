import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard, Public } from '../../common/middleware';
import { buildSuccessResponse } from '../../common/utils';
import { ApiError } from '../../common/errors';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './guards/roles.decorator';
import { StringsService } from './strings.service';
import {
  StringsListQueryDto,
  UpdateStringValuesDto,
  SubmitReviewDto,
  ApproveStringDto,
  RejectStringDto,
  BulkImportQueryDto,
  ExportPublishDto,
  ExportFormatQueryDto,
} from './dto/strings.dto';

/**
 * Strings Controller - Enhanced localization management
 * Public: /data/t_string/count (unchanged)
 * Protected: All other endpoints require JWT + appropriate roles
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('strings')
export class StringsController {
  constructor(private readonly service: StringsService) {}

  /**
   * List strings with advanced filtering
   * Requires: Editor role or higher
   */
  @Get()
  @Roles('editor', 'reviewer', 'publisher')
  async findAll(@Query() query: StringsListQueryDto) {
    const result = await this.service.findAll(query);
    return buildSuccessResponse(result.data, undefined, result.meta);
  }

  /**
   * Get single string with metadata
   * Requires: Editor role or higher
   */
  @Get(':id')
  @Roles('editor', 'reviewer', 'publisher')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.service.findOne(id);
    return buildSuccessResponse(result);
  }

  /**
   * Update string values
   * Sets status to draft, increments version
   * Requires: Editor role
   */
  @Put(':id')
  @Roles('editor')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStringValuesDto,
    @Request() req: any,
  ) {
    const userId = req.user?.sub || req.user?.username || 'unknown';
    const result = await this.service.update(id, body, userId);
    return buildSuccessResponse(result, 'String updated successfully');
  }

  /**
   * Submit string for review
   * Requires: Editor role
   */
  @Post(':id/submit-review')
  @Roles('editor')
  async submitReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() _body: SubmitReviewDto,
    @Request() req: any,
  ) {
    const userId = req.user?.sub || req.user?.username || 'unknown';
    const result = await this.service.submitForReview(id, userId);
    return buildSuccessResponse(result, 'String submitted for review');
  }

  /**
   * Approve string
   * Requires: Reviewer role
   */
  @Post(':id/approve')
  @Roles('reviewer')
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() _body: ApproveStringDto,
    @Request() req: any,
  ) {
    const userId = req.user?.sub || req.user?.username || 'unknown';
    const result = await this.service.approve(id, userId);
    return buildSuccessResponse(result, 'String approved');
  }

  /**
   * Reject string (returns to draft)
   * Requires: Reviewer role
   */
  @Post(':id/reject')
  @Roles('reviewer')
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RejectStringDto,
    @Request() req: any,
  ) {
    const userId = req.user?.sub || req.user?.username || 'unknown';
    const result = await this.service.reject(id, userId, body);
    return buildSuccessResponse(result, 'String rejected');
  }

  /**
   * Bulk import from CSV/XLSX
   * Supports dry-run mode for preview
   * Requires: Editor role (dry-run), Publisher role (commit)
   */
  @Post('bulk/import')
  @UseInterceptors(FileInterceptor('file'))
  @Roles('editor', 'publisher')
  async bulkImport(
    @UploadedFile() file: Express.Multer.File,
    @Query() query: BulkImportQueryDto,
    @Request() req: any,
  ) {
    if (!file) {
      throw ApiError.badRequest('No file uploaded', 'NO_FILE');
    }

    const dryRun = query.dryRun !== false; // Default to dry-run
    const userId = req.user?.sub || req.user?.username || 'unknown';

    // Parse CSV/XLSX content
    const rows = await this.parseImportFile(file);
    const result = await this.service.bulkImport(rows, dryRun, userId);

    return buildSuccessResponse(
      result,
      dryRun ? 'Dry-run completed' : `Import completed: ${result.summary.updated} updated, ${result.summary.added} added`,
    );
  }

  /**
   * Get export preview
   * Requires: Publisher role
   */
  @Get('export/preview')
  @Roles('publisher')
  async exportPreview(@Query() _query: ExportFormatQueryDto) {
    const result = await this.service.getExportPreview();
    return buildSuccessResponse(result);
  }

  /**
   * Publish export (generate .load + manifest)
   * Requires: Publisher role
   */
  @Post('export/publish')
  @Roles('publisher')
  async exportPublish(@Body() body: ExportPublishDto) {
    const result = await this.service.publishExport(body);
    return buildSuccessResponse(result, `Export published: version ${body.version}`);
  }

  /**
   * Helper: Parse CSV/XLSX file to rows
   */
  private async parseImportFile(file: Express.Multer.File): Promise<any[]> {
    const content = file.buffer.toString('utf8');
    const lines = content.split('\n').filter((line) => line.trim());

    if (lines.length === 0) {
      throw ApiError.badRequest('Empty file', 'EMPTY_FILE');
    }

    // Parse CSV (simple implementation)
    const rows: any[] = [];
    const header = lines[0].split('\t').map((h) => h.trim());

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('\t');
      const row: any = {};
      for (let j = 0; j < header.length; j++) {
        row[header[j]] = values[j]?.trim() || '';
      }
      rows.push(row);
    }

    return rows;
  }
}
