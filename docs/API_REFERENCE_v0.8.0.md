# API Reference – EVS-DLC v0.8.0

All endpoints live under `http://localhost:30089` and require a valid JWT presented as `Authorization: Bearer <token>`. Successful responses follow the shared envelope:

```json
{
  "success": true,
  "message": "optional description",
  "data": {},
  "meta": {}
}
```

Error responses share the same shape with `success: false` and an `errorCode` field.

## Common Query Parameters
- `limit` (number, optional) – defaults to module-specific pagination (50 for skill levels, 20 for others).
- `offset` (number, optional) – starting index for pagination.
- `search` (string, optional) – performs a case-insensitive LIKE search on the most relevant text columns.

## Items (`t_item`)
### `GET /data/t_item`
Returns a paginated list of items. Supports `search` across item names and descriptions.

### `GET /data/t_item/:id`
Fetches a single item by `a_index`.

### `POST /data/t_item`
Creates a new item. Required body fields:
- `a_type_idx` (number)
- `a_subtype_idx` (number)
- `a_enable` (0 or 1)
- `a_name` (string, ≤ 60 chars)
- `a_name_usa` (string, ≤ 60 chars)

Optional fields mirror the entity columns (level, price, descriptors, localisation variants, etc.).

### `PUT /data/t_item/:id`
Updates an existing item. Accepts any subset of the item fields; omitted keys remain unchanged.

### `DELETE /data/t_item/:id`
Removes the item with the specified index.

## Skills (`t_skill`)
### `GET /data/t_skill`
Lists skills with pagination and name search.

### `GET /data/t_skill/:id`
Returns a single skill, including level relations if cached.

### `POST /data/t_skill`
Body requirements:
- `a_index` (number)
- `a_job` (number)
- `a_type` (number)
- `a_maxLevel` (number ≥ 1)
- `a_name` (string, ≤ 50 chars)

Additional properties (targeting data, ranges, localisation strings) are optional.

### `PUT /data/t_skill/:id`
Partial update for any skill field.

### `DELETE /data/t_skill/:id`
Deletes the skill by index.

## Skill Levels (`t_skilllevel`)
### `GET /data/t_skilllevel`
Supports `search` and `skillId` filters. When `skillId` is supplied, results are limited to the matching skill. Each level includes a `skill` object with the id and name when available.

### `GET /data/t_skilllevel/:id`
Retrieves a single skill level, including the related skill reference.

### `POST /data/t_skilllevel`
Required fields:
- `a_index` (number) – matches an existing `t_skill.a_index`.
- `a_level` (number ≥ 0)

Optional numeric attributes (HP/MP/GP costs, learning requirements, etc.) follow the entity schema. Duplicate `a_index` values are rejected and the referenced skill must exist.

### `PUT /data/t_skilllevel/:id`
Updates allowed fields except for `a_index` (primary key). Payloads omitting keys leave the original values intact.

### `DELETE /data/t_skilllevel/:id`
Deletes a skill level by index.

## Strings (`t_string`)
### `GET /data/t_string`
Returns localisation entries with pagination and search across the default/English fields.

### `GET /data/t_string/:id`
Fetches a single localisation record.

### `POST /data/t_string`
Body requirements:
- `a_index` (number)
- `a_string` (string, ≤ 255 chars)
- `a_string_usa` (string, ≤ 255 chars)

Other localisation variants are optional and capped at 255 characters.

### `PUT /data/t_string/:id`
Partial update for any string column.

### `DELETE /data/t_string/:id`
Removes a localisation entry by index.
