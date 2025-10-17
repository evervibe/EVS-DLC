# Data Schema Overview

**Database:** db_data
**Total Tables:** 5
**Generated:** 2025-10-17T00:30:06.482Z

## Tables

### t_item

- **Columns:** 6
- **Primary Keys:** id
- **Approximate Rows:** 0
- **Comment:** Game items table

**Column Details:**

| Column | Type | Nullable | Key |
|--------|------|----------|-----|
| id | int | NO | PRI |
| code | varchar | NO | - |
| name | varchar | YES | - |
| type | int | YES | - |
| level | int | YES | - |
| created_at | timestamp | YES | - |

### t_string

- **Columns:** 4
- **Primary Keys:** id
- **Approximate Rows:** 0
- **Comment:** String localization table

**Column Details:**

| Column | Type | Nullable | Key |
|--------|------|----------|-----|
| id | int | NO | PRI |
| key | varchar | NO | - |
| value | text | YES | - |
| language | varchar | YES | - |

### t_skill

- **Columns:** 5
- **Primary Keys:** id
- **Approximate Rows:** 0
- **Comment:** Skills table

**Column Details:**

| Column | Type | Nullable | Key |
|--------|------|----------|-----|
| id | int | NO | PRI |
| code | varchar | NO | - |
| name | varchar | YES | - |
| description | text | YES | - |
| max_level | int | YES | - |

### t_skilllevel

- **Columns:** 5
- **Primary Keys:** id
- **Approximate Rows:** 0
- **Comment:** Skill levels table

**Column Details:**

| Column | Type | Nullable | Key |
|--------|------|----------|-----|
| id | int | NO | PRI |
| skill_id | int | NO | - |
| level | int | NO | - |
| required_exp | int | YES | - |
| effect_value | float | YES | - |

### t_character

- **Columns:** 6
- **Primary Keys:** id
- **Approximate Rows:** 0
- **Comment:** Characters table

**Column Details:**

| Column | Type | Nullable | Key |
|--------|------|----------|-----|
| id | int | NO | PRI |
| code | varchar | NO | - |
| name | varchar | YES | - |
| class_type | int | YES | - |
| base_hp | int | YES | - |
| base_mp | int | YES | - |

