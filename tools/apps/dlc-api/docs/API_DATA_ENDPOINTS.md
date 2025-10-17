# Data API Endpoints

Version: 0.3.1  
Base URL: `http://localhost:3000`

## Overview

The Data API provides CRUD operations for all game data tables in the `db_data` database. Each table has a standardized set of endpoints following RESTful conventions.

## Available Tables

- `t_string` - Localized strings (26 languages)
- `t_item` - Item definitions (170+ columns)
- `t_skill` - Skill definitions (160+ columns)
- `t_skilllevel` - Skill level progression (46 columns)

## Common Endpoints Pattern

All tables follow this pattern:

### GET /data/{table}

**Description**: Fetch paginated list of records

**Parameters**:
- `limit` (optional, query): Number of records to return (default: no limit)
- `offset` (optional, query): Number of records to skip (default: 0)

**Response**: Array of records

**Example**:
```bash
GET /data/t_string?limit=10&offset=0
```

### GET /data/{table}/:id

**Description**: Fetch single record by ID

**Parameters**:
- `id` (required, path): Primary key value (a_index)

**Response**: Single record object or 404

**Example**:
```bash
GET /data/t_item/1
```

### POST /data/{table}

**Description**: Create new record

**Body**: JSON object with record fields

**Response**: Created record with generated ID

**Example**:
```bash
POST /data/t_string
Content-Type: application/json

{
  "a_index": 1000,
  "a_string_usa": "Test String",
  "a_string_ger": "Testzeichenfolge"
}
```

### PUT /data/{table}/:id

**Description**: Update existing record

**Parameters**:
- `id` (required, path): Primary key value (a_index)

**Body**: JSON object with fields to update

**Response**: Updated record

**Example**:
```bash
PUT /data/t_item/1
Content-Type: application/json

{
  "a_price": 1500,
  "a_enable": 1
}
```

### DELETE /data/{table}/:id

**Description**: Delete record

**Parameters**:
- `id` (required, path): Primary key value (a_index)

**Response**: 204 No Content

**Example**:
```bash
DELETE /data/t_skill/999
```

## Specific Table Examples

### t_string Endpoints

#### List all strings
```bash
GET /data/t_string
```

**Response**:
```json
[
  {
    "a_index": 1,
    "a_string_usa": "Health Potion",
    "a_string_ger": "Heiltrank",
    "a_string_spn": "Poción de salud",
    "a_string_frc": "Potion de santé",
    "a_string_rus": "Зелье здоровья",
    "a_string": "Health Potion",
    "a_string_twn": "生命藥水",
    "a_string_chn": "生命药水",
    ...
  }
]
```

#### Get specific string
```bash
GET /data/t_string/1
```

### t_item Endpoints

#### List items with pagination
```bash
GET /data/t_item?limit=20&offset=0
```

**Response**:
```json
[
  {
    "a_index": 1,
    "a_type_idx": 1,
    "a_subtype_idx": 0,
    "a_enable": 1,
    "a_name_usa": "Sword of Truth",
    "a_name_ger": "Schwert der Wahrheit",
    "a_descr_usa": "A legendary blade",
    "a_level": 50,
    "a_price": 10000,
    "a_weight": 150,
    ...
  }
]
```

#### Get item details
```bash
GET /data/t_item/1
```

#### Create new item
```bash
POST /data/t_item
Content-Type: application/json

{
  "a_type_idx": 2,
  "a_subtype_idx": 1,
  "a_enable": 1,
  "a_name_usa": "Magic Staff",
  "a_descr_usa": "A powerful staff",
  "a_level": 30,
  "a_price": 5000
}
```

#### Update item
```bash
PUT /data/t_item/1
Content-Type: application/json

{
  "a_price": 12000,
  "a_level": 55
}
```

### t_skill Endpoints

#### List all skills
```bash
GET /data/t_skill
```

**Response**:
```json
[
  {
    "a_index": 1,
    "a_job": 1,
    "a_job2": 0,
    "a_name": "Fireball",
    "a_name_usa": "Fireball",
    "a_name_ger": "Feuerball",
    "a_type": 1,
    "a_maxLevel": 10,
    "a_fireRange": 20.0,
    "a_targetType": 1,
    "a_reuseTime": 3000,
    ...
  }
]
```

#### Get skill by ID
```bash
GET /data/t_skill/1
```

### t_skilllevel Endpoints

#### List skill levels
```bash
GET /data/t_skilllevel
```

**Response**:
```json
[
  {
    "a_index": 1,
    "a_level": 1,
    "a_needHP": 0,
    "a_needMP": 50,
    "a_needGP": 0,
    "a_learnLevel": 10,
    "a_learnSP": 1,
    "a_durtime": 0,
    ...
  }
]
```

## Error Responses

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Record not found",
  "error": "Not Found"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["a_index must be a number"],
  "error": "Bad Request"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Authentication

Currently, the API does not require authentication. Future versions will implement JWT-based authentication for write operations.

## Rate Limiting

No rate limiting is currently implemented. This may be added in future versions.

## Data Validation

- Primary keys must be valid integers
- Required fields cannot be null (unless specified in schema)
- String fields are limited to their specified lengths
- Numeric fields must be within valid ranges

## Notes

1. **Primary Keys**: All tables use `a_index` as the primary key
2. **Auto-increment**: Only `t_item` has auto-increment on `a_index`
3. **Pagination**: Use `limit` and `offset` for large datasets
4. **Bulk Operations**: Not currently supported; use multiple requests
5. **Transactions**: Each operation is atomic
6. **Localization**: When creating/updating, provide all language fields or use defaults

## Example Usage Flow

### Complete Item Creation Workflow

1. Create localized strings for item name and description:
```bash
POST /data/t_string
{
  "a_index": 5000,
  "a_string_usa": "Epic Helmet",
  "a_string_ger": "Epischer Helm"
}

POST /data/t_string
{
  "a_index": 5001,
  "a_string_usa": "A helmet of legendary power",
  "a_string_ger": "Ein Helm von legendärer Macht"
}
```

2. Create the item record:
```bash
POST /data/t_item
{
  "a_type_idx": 5,
  "a_subtype_idx": 1,
  "a_enable": 1,
  "a_name_usa": "Epic Helmet",
  "a_descr_usa": "A helmet of legendary power",
  "a_level": 60,
  "a_price": 50000,
  "a_num_0": 100,
  "a_num_1": 50
}
```

3. Verify the item:
```bash
GET /data/t_item/{returned_id}
```

## Future Enhancements (v0.4.0+)

- Relationship queries (e.g., get all items for a skill)
- Advanced filtering and search
- Bulk operations
- Data export/import
- Audit logging
- RBAC permissions
- WebSocket support for real-time updates
