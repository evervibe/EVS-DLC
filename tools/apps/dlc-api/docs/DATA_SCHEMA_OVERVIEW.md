# Data Schema Overview

Version: 0.3.1  
Database: `db_data`  
Purpose: Game data tables for items, skills, and localized strings

## Tables

### 1. t_string

**Purpose**: Localized string storage supporting 26 different languages and regions

**Primary Key**: `a_index` (int)

**Columns** (27 total):
- `a_index` - Unique identifier
- `a_string_usa` - English (US)
- `a_string_ger` - German
- `a_string_spn` - Spanish
- `a_string_frc` - French
- `a_string_rus` - Russian
- `a_string` - Default string
- `a_string_twn` - Taiwanese
- `a_string_chn` - Chinese
- `a_string_thai` - Thai
- `a_string_thai_eng` - Thai (English)
- `a_string_twn2` - Taiwanese (variant 2)
- `a_string_jpn` - Japanese
- `a_string_mal` - Malay
- `a_string_mal_eng` - Malay (English)
- `a_string_brz` - Brazilian Portuguese
- `a_string_hk` - Hong Kong
- `a_string_hk_eng` - Hong Kong (English)
- `a_string_pld` - Polish
- `a_string_tur` - Turkish
- `a_string_spn2` - Spanish (variant 2)
- `a_string_frc2` - French (variant 2)
- `a_string_ita` - Italian
- `a_string_mex` - Mexican Spanish
- `a_string_nld` - Dutch
- `a_string_uk` - UK English
- `a_string_dev` - Developer notes

### 2. t_item

**Purpose**: Complete item definitions including equipment, consumables, and quest items

**Primary Key**: `a_index` (int, auto-increment)

**Column Categories**:

#### Basic Information (14 columns)
- `a_index` - Unique item ID (auto-increment)
- `a_type_idx` - Item type category
- `a_subtype_idx` - Item subtype
- `a_enable` - Enabled flag
- `a_name` - Default name
- `a_descr` - Default description
- `a_level` - Required level
- `a_level2` - Secondary level requirement
- `a_weight` - Item weight
- `a_price` - Base price
- `a_max_use` - Max uses/durability
- `a_grade` - Item grade/quality
- `a_fame` - Fame requirement
- `a_job_flag` - Job class restrictions

#### Localized Names (24 columns)
Names in multiple languages: usa, ger, twn, chn, thai, thai_eng, twn2, jpn, mal, mal_eng, brz, hk, hk_eng, spn, frc, pld, rus, tur, spn2, frc2, ita, mex, nld, uk, dev

#### Localized Descriptions (24 columns)
Descriptions in the same languages as names (a_descr_*)

#### Stats & Attributes (10 columns)
- `a_num_0` through `a_num_9` - Numeric attributes (damage, defense, etc.)

#### Requirements (20 columns)
- `a_need_item0` through `a_need_item9` - Required item indices
- `a_need_item_count0` through `a_need_item_count9` - Required item counts
- `a_need_sskill`, `a_need_sskill2` - Required skills
- `a_need_sskill_level`, `a_need_sskill_level2` - Required skill levels

#### Rare/Drop System (28 columns)
- `a_rare_index_0` through `a_rare_index_13` - Rare variant indices
- `a_rare_prob_0` through `a_rare_prob_13` - Rare variant probabilities
- `a_drop_prob_10` - Drop probability

#### Set Items (6 columns)
- `a_set_0` through `a_set_4` - Set bonuses
- `a_set` - Set ID

#### Visual & Effects (9 columns)
- `a_file_smc` - 3D model file
- `a_texture_id` - Texture atlas ID
- `a_texture_row`, `a_texture_col` - Texture coordinates
- `a_effect_name` - Visual effect name
- `a_attack_effect_name` - Attack effect
- `a_damage_effect_name` - Damage effect
- `a_wearing` - Wearing slot

#### Flags & Metadata (17 columns)
- `a_flag` - Item flags (bigint)
- `a_zone_flag` - Zone restrictions
- `a_quest_trigger_count` - Quest trigger count
- `a_quest_trigger_ids` - Quest IDs
- `a_origin_variation1` through `a_origin_variation10` - Origin variations
- `a_rvr_value`, `a_rvr_grade` - RvR attributes
- `a_durability` - Durability value
- `a_castle_war` - Castle war flag
- `b_todo_delete` - Deletion flag

**Total Columns**: 170+

### 3. t_skill

**Purpose**: Skill definitions with extensive metadata and localization

**Primary Key**: `a_index` (int)

**Column Categories**:

#### Basic Properties (14 columns)
- `a_index` - Skill ID
- `a_job`, `a_job2` - Job class restrictions
- `a_type` - Skill type
- `a_flag` - Skill flags
- `a_maxLevel` - Maximum skill level
- `a_appRange` - Application range
- `a_fireRange`, `a_fireRange2` - Fire range values
- `a_minRange` - Minimum range
- `a_targetType` - Target type
- `a_targetNum` - Number of targets
- `a_useState` - Use state
- `a_summon_idx` - Summon index (nullable)
- `a_apet_index` - Pet index

#### Localized Names (26 columns)
Names in all supported languages (a_name_*)

#### Client Display (78 columns)
- `a_client_description_*` - Descriptions in 26 languages
- `a_client_tooltip_*` - Tooltips in 26 languages
- `a_client_icon_texid` - Icon texture ID
- `a_client_icon_row`, `a_client_icon_col` - Icon coordinates

#### Weapon & Equipment Requirements (6 columns)
- `a_useWeaponType0`, `a_useWeaponType1` - Required weapon types
- `a_use_needWearingType` - Required wearing type
- `a_appWeaponType0`, `a_appWeaponType1` - Application weapon types
- `a_app_needWearingType` - Application wearing type

#### Magic Requirements (9 columns)
- `a_useMagicIndex1` through `a_useMagicIndex3` - Required magic indices
- `a_useMagicLevel1` through `a_useMagicLevel3` - Required magic levels
- `a_appState` - Application state

#### Timing (4 columns)
- `a_readyTime` - Ready time
- `a_stillTime` - Still time
- `a_fireTime` - Fire time
- `a_reuseTime` - Reuse/cooldown time

#### Combat Data (40+ columns)
Various combat-related parameters:
- `a_cd_ra`, `a_cd_ra2` - Ready animation
- `a_cd_re`, `a_cd_re2` - Ready effect
- `a_cd_sa`, `a_cd_sa2` - Start animation
- `a_cd_fa`, `a_cd_fa2` - Fire animation
- `a_cd_fe0` through `a_cd_fe5` - Fire effects
- `a_cd_fot`, `a_cd_fot2` - Fire object type
- `a_cd_fos`, `a_cd_fos2` - Fire object speed
- `a_cd_ox`, `a_cd_ox2` - Object X offset
- `a_cd_oz`, `a_cd_oz2` - Object Z offset
- `a_cd_oh`, `a_cd_oh2` - Object height
- `a_cd_oc`, `a_cd_oc2` - Object count
- `a_cd_fdc`, `a_cd_fdc2` - Fire damage count
- `a_cd_fd0` through `a_cd_fd7` - Fire damage values
- `a_cd_dd`, `a_cd_dd2` - Damage delay
- `a_cd_fe_after`, `a_cd_fe_after2` - After effects

#### Miscellaneous (5 columns)
- `a_selfparam` - Self parameters
- `a_targetparam` - Target parameters
- `a_soul_consum` - Soul consumption
- `a_sorcerer_flag` - Sorcerer flag
- `a_allowzone` - Allowed zones

**Total Columns**: 160+

### 4. t_skilllevel

**Purpose**: Skill level progression, costs, and requirements

**Primary Key**: `a_index` (int)

**Columns** (46 total):

#### Basic (2 columns)
- `a_index` - Skill level ID
- `a_level` - Level number

#### Resource Costs (4 columns)
- `a_needHP` - HP cost
- `a_needMP` - MP cost
- `a_needGP` - GP cost
- `a_durtime` - Duration time
- `a_dummypower` - Power value

#### Item Requirements (4 columns)
- `a_needItemIndex1`, `a_needItemIndex2` - Required item indices
- `a_needItemCount1`, `a_needItemCount2` - Required item counts

#### Learning Requirements (16 columns)
- `a_learnLevel` - Required character level
- `a_challenger` - Challenger requirement
- `a_learnSP` - Required skill points
- `a_learnGP` - Required GP
- `a_learnSkillIndex1` through `a_learnSkillIndex3` - Prerequisite skills
- `a_learnSkillLevel1` through `a_learnSkillLevel3` - Prerequisite skill levels
- `a_learnItemIndex1` through `a_learnItemIndex3` - Learning item indices
- `a_learnItemCount1` through `a_learnItemCount3` - Learning item counts
- `a_learnstr`, `a_learndex`, `a_learnint`, `a_learncon` - Stat requirements

#### Magic Effects (12 columns)
- `a_appMagicIndex1` through `a_appMagicIndex3` - Applied magic indices
- `a_appMagicLevel1` through `a_appMagicLevel3` - Applied magic levels
- `a_magicIndex1` through `a_magicIndex3` - Magic indices
- `a_magicLevel1` through `a_magicLevel3` - Magic levels

#### Usage (3 columns)
- `a_hate` - Hate/aggro generation
- `a_use_count` - Use count limit
- `a_targetNum` - Target number

## Type Mappings

| MySQL Type | TypeScript Type | Notes |
|------------|----------------|-------|
| int | number | Default 0 or -1 |
| tinyint | number | Small integers (0-255 or -128-127) |
| smallint | number | Medium integers |
| bigint | number | Large integers (may need string for very large values) |
| float | number | Floating point numbers |
| varchar(N) | string | Variable length strings |
| text | string | Long text fields |

## Default Values

- Numeric fields: `0` or `-1` (for "not set" values)
- String fields: `''` (empty string)
- Nullable fields: `NULL`

## Indexes

All tables use their respective `a_index` column as the primary key:
- `t_string`: Static primary key
- `t_item`: Auto-increment primary key
- `t_skill`: Static primary key
- `t_skilllevel`: Static primary key (composite with a_level conceptually)

## Notes

1. **Localization**: All tables support extensive localization with 20+ language variants
2. **Defaults**: Most numeric fields default to 0, with -1 indicating "not set" or "none"
3. **Flags**: Large flag fields use bigint for bitwise operations
4. **Auto-increment**: Only `t_item` uses auto-increment on its primary key
5. **Nullability**: Only specific effect/name fields allow NULL values
