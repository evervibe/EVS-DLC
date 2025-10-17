-- Full Schema Dump for db_data
-- Generated: 2025-10-17T00:30:06.481Z
-- This is a snapshot for documentation purposes

-- Table: t_item
CREATE TABLE IF NOT EXISTS `t_item` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255),
  `type` INT(11),
  `level` INT(11) DEFAULT '0',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Game items table';

-- Table: t_string
CREATE TABLE IF NOT EXISTS `t_string` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(100) NOT NULL,
  `value` TEXT,
  `language` VARCHAR(10) DEFAULT 'en',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='String localization table';

-- Table: t_skill
CREATE TABLE IF NOT EXISTS `t_skill` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255),
  `description` TEXT,
  `max_level` INT(11) DEFAULT '10',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Skills table';

-- Table: t_skilllevel
CREATE TABLE IF NOT EXISTS `t_skilllevel` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `skill_id` INT(11) NOT NULL,
  `level` INT(11) NOT NULL,
  `required_exp` INT(11) DEFAULT '0',
  `effect_value` FLOAT DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Skill levels table';

-- Table: t_character
CREATE TABLE IF NOT EXISTS `t_character` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255),
  `class_type` INT(11),
  `base_hp` INT(11) DEFAULT '100',
  `base_mp` INT(11) DEFAULT '50',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Characters table';

