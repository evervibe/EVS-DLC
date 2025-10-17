# Data API Endpoints

**Base URL:** `/data`
**Total Endpoints:** 25

All endpoints follow RESTful conventions:

## t_item

### List All
- **Endpoint:** `GET /data/t_item`
- **Description:** Retrieve all records from t_item
- **Response:** Array of TItemEntity

### Get One
- **Endpoint:** `GET /data/t_item/:id`
- **Description:** Retrieve a single record by ID
- **Response:** Single TItemEntity or null

### Create
- **Endpoint:** `POST /data/t_item`
- **Description:** Create a new record
- **Body:** Partial TItemEntity
- **Response:** Created TItemEntity

### Update
- **Endpoint:** `PUT /data/t_item/:id`
- **Description:** Update an existing record
- **Body:** Partial TItemEntity
- **Response:** Updated TItemEntity

### Delete
- **Endpoint:** `DELETE /data/t_item/:id`
- **Description:** Delete a record by ID
- **Response:** No content

## t_string

### List All
- **Endpoint:** `GET /data/t_string`
- **Description:** Retrieve all records from t_string
- **Response:** Array of TStringEntity

### Get One
- **Endpoint:** `GET /data/t_string/:id`
- **Description:** Retrieve a single record by ID
- **Response:** Single TStringEntity or null

### Create
- **Endpoint:** `POST /data/t_string`
- **Description:** Create a new record
- **Body:** Partial TStringEntity
- **Response:** Created TStringEntity

### Update
- **Endpoint:** `PUT /data/t_string/:id`
- **Description:** Update an existing record
- **Body:** Partial TStringEntity
- **Response:** Updated TStringEntity

### Delete
- **Endpoint:** `DELETE /data/t_string/:id`
- **Description:** Delete a record by ID
- **Response:** No content

## t_skill

### List All
- **Endpoint:** `GET /data/t_skill`
- **Description:** Retrieve all records from t_skill
- **Response:** Array of TSkillEntity

### Get One
- **Endpoint:** `GET /data/t_skill/:id`
- **Description:** Retrieve a single record by ID
- **Response:** Single TSkillEntity or null

### Create
- **Endpoint:** `POST /data/t_skill`
- **Description:** Create a new record
- **Body:** Partial TSkillEntity
- **Response:** Created TSkillEntity

### Update
- **Endpoint:** `PUT /data/t_skill/:id`
- **Description:** Update an existing record
- **Body:** Partial TSkillEntity
- **Response:** Updated TSkillEntity

### Delete
- **Endpoint:** `DELETE /data/t_skill/:id`
- **Description:** Delete a record by ID
- **Response:** No content

## t_skilllevel

### List All
- **Endpoint:** `GET /data/t_skilllevel`
- **Description:** Retrieve all records from t_skilllevel
- **Response:** Array of TSkilllevelEntity

### Get One
- **Endpoint:** `GET /data/t_skilllevel/:id`
- **Description:** Retrieve a single record by ID
- **Response:** Single TSkilllevelEntity or null

### Create
- **Endpoint:** `POST /data/t_skilllevel`
- **Description:** Create a new record
- **Body:** Partial TSkilllevelEntity
- **Response:** Created TSkilllevelEntity

### Update
- **Endpoint:** `PUT /data/t_skilllevel/:id`
- **Description:** Update an existing record
- **Body:** Partial TSkilllevelEntity
- **Response:** Updated TSkilllevelEntity

### Delete
- **Endpoint:** `DELETE /data/t_skilllevel/:id`
- **Description:** Delete a record by ID
- **Response:** No content

## t_character

### List All
- **Endpoint:** `GET /data/t_character`
- **Description:** Retrieve all records from t_character
- **Response:** Array of TCharacterEntity

### Get One
- **Endpoint:** `GET /data/t_character/:id`
- **Description:** Retrieve a single record by ID
- **Response:** Single TCharacterEntity or null

### Create
- **Endpoint:** `POST /data/t_character`
- **Description:** Create a new record
- **Body:** Partial TCharacterEntity
- **Response:** Created TCharacterEntity

### Update
- **Endpoint:** `PUT /data/t_character/:id`
- **Description:** Update an existing record
- **Body:** Partial TCharacterEntity
- **Response:** Updated TCharacterEntity

### Delete
- **Endpoint:** `DELETE /data/t_character/:id`
- **Description:** Delete a record by ID
- **Response:** No content

