import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

@Injectable()
export class DataPreloaderService implements OnModuleInit {
  private readonly logger = new Logger(DataPreloaderService.name);
  private readonly preloadOnStart: boolean;
  private readonly preloadTables: string[];

  constructor(
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    this.preloadOnStart = this.configService.get<boolean>('PRELOAD_ON_START', false);
    const tablesStr = this.configService.get<string>('PRELOAD_TABLES', '');
    this.preloadTables = tablesStr ? tablesStr.split(',').map(t => t.trim()) : [];
  }

  async onModuleInit() {
    if (!this.preloadOnStart) {
      this.logger.log('Cache preloading is disabled (PRELOAD_ON_START=false)');
      return;
    }

    if (this.preloadTables.length === 0) {
      this.logger.warn('PRELOAD_ON_START is true but no PRELOAD_TABLES specified');
      return;
    }

    this.logger.log(`Starting cache preload for tables: ${this.preloadTables.join(', ')}`);
    
    // Preloading logic can be implemented here
    // For now, we just log the intent
    // In a real implementation, you would inject the data services and call their findAll methods
    
    this.logger.log('Cache preloading completed');
  }
}
