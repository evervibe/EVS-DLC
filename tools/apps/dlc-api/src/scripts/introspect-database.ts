import * as mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import { env } from '../config/env';

interface ColumnInfo {
  COLUMN_NAME: string;
  DATA_TYPE: string;
  COLUMN_TYPE: string;
  IS_NULLABLE: string;
  COLUMN_KEY: string;
  COLUMN_DEFAULT: string | null;
  EXTRA: string;
}

interface TableInfo {
  TABLE_NAME: string;
  TABLE_COMMENT: string;
  TABLE_ROWS: number;
}

function mapMySQLTypeToTypeScript(mysqlType: string, columnType: string): string {
  const lowerType = mysqlType.toLowerCase();
  
  if (lowerType.includes('int') || lowerType.includes('decimal') || lowerType.includes('float') || lowerType.includes('double')) {
    return 'number';
  }
  if (lowerType.includes('varchar') || lowerType.includes('char') || lowerType.includes('text') || lowerType.includes('enum')) {
    return 'string';
  }
  if (lowerType.includes('date') || lowerType.includes('time')) {
    return 'Date';
  }
  if (lowerType.includes('blob') || lowerType.includes('binary')) {
    return 'Buffer';
  }
  if (lowerType.includes('json')) {
    return 'any';
  }
  if (lowerType.includes('bit') || lowerType.includes('bool')) {
    return 'boolean';
  }
  
  return 'any';
}

function mapMySQLTypeToTypeORM(mysqlType: string, columnType: string): string {
  const lowerType = mysqlType.toLowerCase();
  
  if (lowerType === 'tinyint') {
    if (columnType === 'tinyint(1)') {
      return 'boolean';
    }
    return 'tinyint';
  }
  if (lowerType === 'smallint') return 'smallint';
  if (lowerType === 'mediumint') return 'mediumint';
  if (lowerType === 'int') return 'int';
  if (lowerType === 'bigint') return 'bigint';
  if (lowerType === 'decimal') return 'decimal';
  if (lowerType === 'float') return 'float';
  if (lowerType === 'double') return 'double';
  if (lowerType.includes('varchar')) return 'varchar';
  if (lowerType === 'char') return 'char';
  if (lowerType === 'text') return 'text';
  if (lowerType === 'mediumtext') return 'mediumtext';
  if (lowerType === 'longtext') return 'longtext';
  if (lowerType === 'datetime') return 'datetime';
  if (lowerType === 'timestamp') return 'timestamp';
  if (lowerType === 'date') return 'date';
  if (lowerType === 'time') return 'time';
  if (lowerType === 'json') return 'json';
  if (lowerType === 'blob') return 'blob';
  if (lowerType === 'enum') return 'enum';
  
  return mysqlType;
}

function generateEntityContent(tableName: string, columns: ColumnInfo[]): string {
  const className = tableName.split('_').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  
  const entityName = `${className}Entity`;
  
  let imports = `import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';\n\n`;
  
  let classContent = `@Entity('${tableName}')\n`;
  classContent += `export class ${entityName} {\n`;
  
  for (const col of columns) {
    const fieldName = col.COLUMN_NAME;
    const tsType = mapMySQLTypeToTypeScript(col.DATA_TYPE, col.COLUMN_TYPE);
    const ormType = mapMySQLTypeToTypeORM(col.DATA_TYPE, col.COLUMN_TYPE);
    const nullable = col.IS_NULLABLE === 'YES';
    const isPrimary = col.COLUMN_KEY === 'PRI';
    const isAutoIncrement = col.EXTRA.includes('auto_increment');
    
    // Add decorator
    if (isPrimary && isAutoIncrement) {
      classContent += `  @PrimaryGeneratedColumn()\n`;
    } else if (isPrimary) {
      classContent += `  @PrimaryColumn()\n`;
    } else {
      const columnOptions: string[] = [];
      
      if (ormType !== 'varchar') {
        columnOptions.push(`type: '${ormType}'`);
      }
      
      if (nullable) {
        columnOptions.push('nullable: true');
      }
      
      if (col.COLUMN_DEFAULT !== null && col.COLUMN_DEFAULT !== 'NULL') {
        let defaultValue = col.COLUMN_DEFAULT;
        if (defaultValue === 'CURRENT_TIMESTAMP') {
          columnOptions.push(`default: () => 'CURRENT_TIMESTAMP'`);
        } else if (tsType === 'string') {
          columnOptions.push(`default: '${defaultValue}'`);
        } else {
          columnOptions.push(`default: ${defaultValue}`);
        }
      }
      
      if (columnOptions.length > 0) {
        classContent += `  @Column({ ${columnOptions.join(', ')} })\n`;
      } else {
        classContent += `  @Column()\n`;
      }
    }
    
    // Add property
    const optionalMarker = nullable && !isPrimary ? '?' : '';
    classContent += `  ${fieldName}${optionalMarker}: ${tsType};\n\n`;
  }
  
  classContent += '}\n';
  
  return imports + classContent;
}

function generateModuleContent(tableName: string, entityName: string): string {
  const className = tableName.split('_').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  
  return `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${entityName} } from './${tableName}.entity';
import { ${className}Controller } from './${tableName}.controller';
import { ${className}Service } from './${tableName}.service';

@Module({
  imports: [TypeOrmModule.forFeature([${entityName}])],
  controllers: [${className}Controller],
  providers: [${className}Service],
  exports: [${className}Service],
})
export class ${className}Module {}
`;
}

function generateServiceContent(tableName: string, entityName: string): string {
  const className = tableName.split('_').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  
  return `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${entityName} } from './${tableName}.entity';

@Injectable()
export class ${className}Service {
  constructor(
    @InjectRepository(${entityName})
    private readonly repository: Repository<${entityName}>,
  ) {}

  async findAll(): Promise<${entityName}[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<${entityName} | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async create(data: Partial<${entityName}>): Promise<${entityName}> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<${entityName}>): Promise<${entityName} | null> {
    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
`;
}

function generateControllerContent(tableName: string, entityName: string): string {
  const className = tableName.split('_').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  
  return `import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ${className}Service } from './${tableName}.service';
import { ${entityName} } from './${tableName}.entity';

@Controller('data/${tableName}')
export class ${className}Controller {
  constructor(private readonly service: ${className}Service) {}

  @Get()
  async findAll(): Promise<${entityName}[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<${entityName} | null> {
    return this.service.findOne(parseInt(id, 10));
  }

  @Post()
  async create(@Body() data: Partial<${entityName}>): Promise<${entityName}> {
    return this.service.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<${entityName}>,
  ): Promise<${entityName} | null> {
    return this.service.update(parseInt(id, 10), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(parseInt(id, 10));
  }
}
`;
}

export async function introspectDatabase() {
  const connection = await mysql.createConnection({
    host: env.dbData.host,
    port: env.dbData.port,
    user: env.dbData.user,
    password: env.dbData.password,
    database: env.dbData.database,
  });

  try {
    // Get all tables
    const [tables] = await connection.execute<any[]>(
      `SELECT TABLE_NAME, TABLE_COMMENT, TABLE_ROWS 
       FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_TYPE = 'BASE TABLE'
       ORDER BY TABLE_NAME`,
      [env.dbData.database]
    );

    const tableInfos: TableInfo[] = tables as TableInfo[];
    const generatedFiles: string[] = [];
    const entityList: Array<{ tableName: string; entityName: string; className: string }> = [];

    console.log(`\n🔍 Found ${tableInfos.length} tables in database '${env.dbData.database}'\n`);

    for (const tableInfo of tableInfos) {
      const tableName = tableInfo.TABLE_NAME;
      
      // Get columns for this table
      const [columns] = await connection.execute<any[]>(
        `SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT, EXTRA
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
         ORDER BY ORDINAL_POSITION`,
        [env.dbData.database, tableName]
      );

      const columnInfos: ColumnInfo[] = columns as ColumnInfo[];
      
      const className = tableName.split('_').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join('');
      
      const entityName = `${className}Entity`;

      // Create directory for this table
      const tableDir = path.join(__dirname, '..', 'modules', 'data', tableName);
      if (!fs.existsSync(tableDir)) {
        fs.mkdirSync(tableDir, { recursive: true });
      }

      // Generate entity file
      const entityContent = generateEntityContent(tableName, columnInfos);
      const entityPath = path.join(tableDir, `${tableName}.entity.ts`);
      fs.writeFileSync(entityPath, entityContent);
      generatedFiles.push(entityPath);

      // Generate module file
      const moduleContent = generateModuleContent(tableName, entityName);
      const modulePath = path.join(tableDir, `${tableName}.module.ts`);
      fs.writeFileSync(modulePath, moduleContent);
      generatedFiles.push(modulePath);

      // Generate service file
      const serviceContent = generateServiceContent(tableName, entityName);
      const servicePath = path.join(tableDir, `${tableName}.service.ts`);
      fs.writeFileSync(servicePath, serviceContent);
      generatedFiles.push(servicePath);

      // Generate controller file
      const controllerContent = generateControllerContent(tableName, entityName);
      const controllerPath = path.join(tableDir, `${tableName}.controller.ts`);
      fs.writeFileSync(controllerPath, controllerContent);
      generatedFiles.push(controllerPath);

      entityList.push({ tableName, entityName, className });
      
      console.log(`✓ Generated files for table '${tableName}' (${columnInfos.length} columns)`);
    }

    // Generate updated data.module.ts that imports all generated modules
    const dataModuleContent = generateUpdatedDataModule(entityList);
    const dataModulePath = path.join(__dirname, '..', 'modules', 'data', 'data.module.ts');
    fs.writeFileSync(dataModulePath, dataModuleContent);
    console.log(`\n✓ Updated data.module.ts with ${entityList.length} imported modules`);

    // Generate migration SQL dump
    await generateMigrationDump(connection);

    // Generate documentation
    await generateDocumentation(tableInfos, entityList, connection);

    console.log(`\n✅ Database introspection complete!`);
    console.log(`   Tables processed: ${tableInfos.length}`);
    console.log(`   Files generated: ${generatedFiles.length}`);

    return {
      tables: tableInfos,
      entities: entityList,
      generatedFiles,
    };
  } finally {
    await connection.end();
  }
}

function generateUpdatedDataModule(entities: Array<{ tableName: string; entityName: string; className: string }>): string {
  const imports = entities.map(e => 
    `import { ${e.className}Module } from './${e.tableName}/${e.tableName}.module';`
  ).join('\n');

  const moduleList = entities.map(e => `    ${e.className}Module,`).join('\n');

  return `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataController } from './data.controller';
import { DataService } from './data.service';
${imports}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_DATA_HOST || 'localhost',
      port: parseInt(process.env.DB_DATA_PORT || '3306', 10),
      username: process.env.DB_DATA_USER || 'root',
      password: process.env.DB_DATA_PASS || 'root',
      database: process.env.DB_DATA_NAME || 'db_data',
      autoLoadEntities: true,
      synchronize: false,
    }),
${moduleList}
  ],
  controllers: [DataController],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
`;
}

async function generateMigrationDump(connection: mysql.Connection) {
  console.log('\n📄 Generating migration snapshot...');
  
  const [tables] = await connection.execute<any[]>(
    `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
     WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'
     ORDER BY TABLE_NAME`,
    [env.dbData.database]
  );

  let sqlDump = `-- Full Schema Dump for db_data\n`;
  sqlDump += `-- Generated: ${new Date().toISOString()}\n`;
  sqlDump += `-- This is a snapshot for documentation purposes\n\n`;

  for (const table of tables as any[]) {
    const tableName = table.TABLE_NAME;
    
    const [createTableResult] = await connection.execute<any[]>(
      `SHOW CREATE TABLE \`${tableName}\``
    );
    
    if (createTableResult.length > 0) {
      const createTableStmt = (createTableResult[0] as any)['Create Table'];
      sqlDump += `-- Table: ${tableName}\n`;
      sqlDump += createTableStmt + ';\n\n';
    }
  }

  const migrationPath = path.join(__dirname, '..', '..', 'migrations', '001_full_schema_dump.sql');
  fs.writeFileSync(migrationPath, sqlDump);
  console.log(`✓ Migration snapshot created: migrations/001_full_schema_dump.sql`);
}

async function generateDocumentation(
  tables: TableInfo[],
  entities: Array<{ tableName: string; entityName: string; className: string }>,
  connection: mysql.Connection
) {
  console.log('\n📚 Generating documentation...');
  
  // Generate DATA_SCHEMA_OVERVIEW.md
  let schemaDoc = `# Data Schema Overview\n\n`;
  schemaDoc += `**Database:** ${env.dbData.database}\n`;
  schemaDoc += `**Total Tables:** ${tables.length}\n`;
  schemaDoc += `**Generated:** ${new Date().toISOString()}\n\n`;
  schemaDoc += `## Tables\n\n`;

  for (const table of tables) {
    const [columns] = await connection.execute<any[]>(
      `SELECT COLUMN_NAME, DATA_TYPE, COLUMN_KEY, IS_NULLABLE
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
       ORDER BY ORDINAL_POSITION`,
      [env.dbData.database, table.TABLE_NAME]
    );

    const primaryKeys = (columns as ColumnInfo[])
      .filter(col => col.COLUMN_KEY === 'PRI')
      .map(col => col.COLUMN_NAME);

    schemaDoc += `### ${table.TABLE_NAME}\n\n`;
    schemaDoc += `- **Columns:** ${columns.length}\n`;
    schemaDoc += `- **Primary Keys:** ${primaryKeys.join(', ') || 'None'}\n`;
    schemaDoc += `- **Approximate Rows:** ${table.TABLE_ROWS}\n`;
    if (table.TABLE_COMMENT) {
      schemaDoc += `- **Comment:** ${table.TABLE_COMMENT}\n`;
    }
    schemaDoc += `\n**Column Details:**\n\n`;
    schemaDoc += `| Column | Type | Nullable | Key |\n`;
    schemaDoc += `|--------|------|----------|-----|\n`;
    
    for (const col of columns as ColumnInfo[]) {
      schemaDoc += `| ${col.COLUMN_NAME} | ${col.DATA_TYPE} | ${col.IS_NULLABLE} | ${col.COLUMN_KEY || '-'} |\n`;
    }
    schemaDoc += `\n`;
  }

  const docsDir = path.join(__dirname, '..', '..', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const schemaDocPath = path.join(docsDir, 'DATA_SCHEMA_OVERVIEW.md');
  fs.writeFileSync(schemaDocPath, schemaDoc);
  console.log(`✓ Created docs/DATA_SCHEMA_OVERVIEW.md`);

  // Generate API_DATA_ENDPOINTS.md
  let apiDoc = `# Data API Endpoints\n\n`;
  apiDoc += `**Base URL:** \`/data\`\n`;
  apiDoc += `**Total Endpoints:** ${entities.length * 5}\n\n`;
  apiDoc += `All endpoints follow RESTful conventions:\n\n`;

  for (const entity of entities) {
    apiDoc += `## ${entity.tableName}\n\n`;
    apiDoc += `### List All\n`;
    apiDoc += `- **Endpoint:** \`GET /data/${entity.tableName}\`\n`;
    apiDoc += `- **Description:** Retrieve all records from ${entity.tableName}\n`;
    apiDoc += `- **Response:** Array of ${entity.entityName}\n\n`;

    apiDoc += `### Get One\n`;
    apiDoc += `- **Endpoint:** \`GET /data/${entity.tableName}/:id\`\n`;
    apiDoc += `- **Description:** Retrieve a single record by ID\n`;
    apiDoc += `- **Response:** Single ${entity.entityName} or null\n\n`;

    apiDoc += `### Create\n`;
    apiDoc += `- **Endpoint:** \`POST /data/${entity.tableName}\`\n`;
    apiDoc += `- **Description:** Create a new record\n`;
    apiDoc += `- **Body:** Partial ${entity.entityName}\n`;
    apiDoc += `- **Response:** Created ${entity.entityName}\n\n`;

    apiDoc += `### Update\n`;
    apiDoc += `- **Endpoint:** \`PUT /data/${entity.tableName}/:id\`\n`;
    apiDoc += `- **Description:** Update an existing record\n`;
    apiDoc += `- **Body:** Partial ${entity.entityName}\n`;
    apiDoc += `- **Response:** Updated ${entity.entityName}\n\n`;

    apiDoc += `### Delete\n`;
    apiDoc += `- **Endpoint:** \`DELETE /data/${entity.tableName}/:id\`\n`;
    apiDoc += `- **Description:** Delete a record by ID\n`;
    apiDoc += `- **Response:** No content\n\n`;
  }

  const apiDocPath = path.join(docsDir, 'API_DATA_ENDPOINTS.md');
  fs.writeFileSync(apiDocPath, apiDoc);
  console.log(`✓ Created docs/API_DATA_ENDPOINTS.md`);
}

if (require.main === module) {
  introspectDatabase().catch(error => {
    console.error('Error during introspection:', error);
    process.exit(1);
  });
}
