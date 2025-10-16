# Legacy Database Mapping & Analysis

Datum: 2025-10-03  
Projekt: lc_website_old  
Zweck: Umfassende Dokumentation der Legacy-Datenbank-Struktur

---

## Übersicht

Das Legacy-System verwendet mehrere Datenbanken für verschiedene Zwecke:

1. `db_auth` (MySQL) - Account-Management und Authentifizierung
2. `db_db` (MySQL) - Spiel-Daten (Charaktere, Guilds, Castle)
3. `db_data` (MySQL) - Statische Spiel-Daten (Items, Skills, Options)
4. `db_db` (MySQL) - Logs (kann identisch mit Spiel-DB sein)
5. WEB2.db / WEB.db (SQLite) - Website-spezifische Daten

---

## Datenbank-Übersicht

### 1. Account Database (`db_auth`)

Haupttabelle: `bg_user`

Struktur der `bg_user` Tabelle:

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| user_code | INT (PK) | Primärschlüssel, eindeutige User-ID |
| user_id | VARCHAR | Benutzername für Login |
| passwd | VARCHAR | Gehashtes Passwort (MD5/SHA256) |
| email | VARCHAR(64) | E-Mail-Adresse |
| ip | VARCHAR | IP-Adresse bei Registrierung |
| activated | TINYINT | Account-Status (0=inaktiv, 1=aktiv) |
| create_date | DATETIME | Registrierungsdatum |
| cash | INT | Verfügbares Cash (Premium-Währung) |
| donated_cash | INT | Gespendetes/gekauftes Cash |
| social_id | VARCHAR(13) | Eindeutige Social-ID (7-stellig) |
| web_admin | INT | Admin-Level (0=Normal, 1+=Admin) |
| deletion_token | VARCHAR(40) | Token für Account-Löschung |
| passlost_token | VARCHAR(40) | Token für Passwort-Wiederherstellung |
| email_token | VARCHAR(40) | Token für E-Mail-Verifikation |
| lock_token | VARCHAR(40) | Token für Account-Sperre |
| registration_token | VARCHAR(40) | Token für Registrierung |
| new_email | VARCHAR(64) | Neue E-Mail bei E-Mail-Änderung |
| ban_time | DATETIME | Ban-Zeitpunkt |
| bantime | BIGINT | Ban-Dauer in Sekunden |
| DiscordId | INT | Discord Integration - User ID |
| DiscordUsername | VARCHAR(255) | Discord Benutzername |
| DiscordEmail | VARCHAR(255) | Discord E-Mail |
| DiscordDiscriminator | INT | Discord Discriminator |
| DiscordAvatar | VARCHAR(255) | Discord Avatar URL |
| DiscordLogin | INT | Discord-Login aktiviert (0/1) |
| token | VARCHAR(50) | Allgemeiner Token |
| donation_booster | INT | Spenden-Booster Status |

Zusätzliche Tabellen in db_auth:

- `t_users` - Zusätzliche User-Daten und Online-Status
  - `a_idname` - Account-Name
  - `a_zone_num` - Aktuelle Zone (0=offline, >0=online)

---

### 2. Game Database (`db_db`)

#### Charaktere: `t_characters`

Haupttabelle für alle Spieler-Charaktere.

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| a_index | INT (PK) | Charakter-ID |
| a_user_index | INT (FK) | Referenz zu `bg_user.user_code` |
| a_enable | TINYINT | Status (0=gelöscht, 1=aktiv) |
| a_name | VARCHAR | Charakter-Name |
| a_nick | VARCHAR | Nickname/Titel |
| a_job | INT | Klasse (0=Titan, 1=Knight, 2=Healer, etc.) |
| a_level | INT | Level des Charakters |
| a_exp | BIGINT | Erfahrungspunkte |
| a_admin | INT | GM-Level (0=Spieler, >0=GM) |
| a_was_zone | INT | Letzte Zone |
| a_wins | INT | PvP-Siege (Spaltenname konfigurierbar) |
| a_looses | INT | PvP-Niederlagen |
| a_killed_monster | INT | Getötete Monster |
| a_deaths | INT | Tode (PvM) |
| a_syndicate_type | INT | Fraktion (1=Knight, 2=Dark) |
| a_syndicate_point_k | INT | Knight-Fraktionspunkte |
| a_syndicate_point_d | INT | Dark-Fraktionspunkte |
| a_jewel_point | INT | Juwelen-Punkte für Rang |

#### Gilden: `t_guild`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| a_index | INT (PK) | Guild-ID |
| a_enable | TINYINT | Status (0=aufgelöst, 1=aktiv) |
| a_name | VARCHAR | Gildenname |
| a_level | INT | Gildenlevel |
| a_balance | BIGINT | Gildengold |

#### Gildenmitglieder: `t_guildmember`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| a_char_index | INT (FK) | Charakter-ID |
| a_guild_index | INT (FK) | Guild-ID |
| a_char_name | VARCHAR | Charaktername |
| a_pos | INT | Position (0=Guildmaster, 1+=Mitglied) |

#### Castle/Siege: `t_castle`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| a_zone_index | INT (PK) | Castle-ID (4=Merac, 7=Dratan) |
| a_owner_char_index | INT | Besitzer Charakter-ID |
| a_owner_guild_index | INT | Besitzer Guild-ID |
| a_owner_char_name | VARCHAR | Besitzer Charakter-Name |
| a_owner_guild_name | VARCHAR | Besitzer Gildenname |
| a_next_war_time | BIGINT | Nächster Kriegszeitpunkt |
| a_last_war_time | BIGINT | Letzter Kriegszeitpunkt |

#### Castle Registrierung: `t_castle_join`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| a_index | INT (PK) | Join-ID |
| a_zone_index | INT | Castle-ID |
| a_guild | INT | Guild-ID |
| a_attack | TINYINT | Modus (0=Verteidigung, 1=Angriff) |

#### Inventar: `t_inven0{0-9}`

Mehrere Tabellen (partitioniert nach Server/Channel).

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| a_char_idx | INT (FK) | Charakter-ID |
| a_row_idx | INT | Inventory-Zeile |
| a_item_idx0-4 | INT | Item-ID (5 Slots pro Zeile) |
| a_serial0-4 | VARCHAR | Seriennummer des Items |
| a_count0-4 | INT | Anzahl/Stack |
| a_plus0-4 | INT | Upgrade-Level (+0 bis +20) |
| a_flag0-4 | INT | Item-Flags |
| a_item0-4_option0-4 | INT | Item-Optionen |

#### Lager: `t_stash0{0-9}`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| a_user_idx | INT (FK) | User-ID |
| a_item_idx | INT | Item-ID |
| a_serial | VARCHAR | Seriennummer |
| a_count | INT | Anzahl |
| a_plus | INT | Upgrade-Level |
| a_flag | INT | Flags |
| a_item_option0-4 | INT | Item-Optionen (5 Slots) |
| a_socket | INT | Socket-Info |
| a_item_origin_var0-5 | INT | Origin-Variablen |
| a_now_dur | INT | Aktuelle Haltbarkeit |
| a_max_dur | INT | Max. Haltbarkeit |

#### Lager-Geld: `t_stash_money`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| a_user_index | INT (PK, FK) | User-ID |
| a_stash_money | BIGINT | Geld im Lager |

#### Pets: `t_apets`

Tabelle für Begleiter-Haustiere.

#### Skills: `t_skill`

Charakter-Skills und Level.

#### Ausrüstung: `t_wear_inven`

Angelegte Items (Helm, Rüstung, Waffe, etc.).

#### Geschenke: `t_gift0{0-9}`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| a_server | INT | Server-ID |
| a_send_user_idx | INT | Sender User-ID |
| a_send_char_name | VARCHAR | Sender Name |
| a_send_msg | TEXT | Nachricht |
| a_send_date | DATETIME | Sendedatum |
| a_recv_user_idx | INT | Empfänger User-ID |
| a_ctid | INT | Item-ID |

#### Käufe: `t_purchase0{0-9}`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| a_user_idx | INT | User-ID |
| a_ctid | INT | Item-ID |
| a_pdate | DATETIME | Kaufdatum |
| a_confirm | INT | Bestätigt |
| a_server | INT | Server-ID |
| a_ip | VARCHAR | IP-Adresse |

---

### 3. Data Database (`db_data`)

Statische Spiel-Daten (Read-Only im normalen Betrieb).

#### Items: `t_item`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| a_index | INT (PK) | Item-ID |
| a_name_usa | VARCHAR | Item-Name (EN) |
| a_descr_usa | TEXT | Item-Beschreibung (EN) |
| a_name | VARCHAR | Item-Name (lokalisiert) |
| a_descr | TEXT | Item-Beschreibung (lokalisiert) |
| a_texture_id | INT | Texture-ID |
| a_texture_row | INT | Texture-Zeile |
| a_texture_col | INT | Texture-Spalte |
| a_grade | INT | Item-Grade/Qualität |

#### Optionen: `t_option`

Verfügbare Item-Optionen und Enchantments.

---

### 4. Website Database (SQLite: `WEB2.db`)

#### News: `news`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | News-ID |
| category | INT | Kategorie (1=News, 2=Events, etc.) |
| title | TEXT | Titel |
| content | TEXT | Inhalt |
| date | DATETIME | Veröffentlichungsdatum |
| author | VARCHAR | Autor |

#### Donations: `donate`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Spenden-ID |
| account_id | INT | User-Code |
| code | VARCHAR | Spenden-Code |
| type | VARCHAR | Art der Spende |
| status | INT | Status (0=pending, 1=completed) |

#### Payments: `payments`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Payment-ID |
| item_name | VARCHAR | Produkt-Name |
| item_number | VARCHAR | Produkt-Nummer |
| payment_status | VARCHAR | Status |
| payment_amount | DECIMAL | Betrag |
| payment_currency | VARCHAR | Währung |
| txn_id | VARCHAR | Transaktions-ID |
| receiver_email | VARCHAR | Empfänger-E-Mail |
| payer_email | VARCHAR | Zahler-E-Mail |
| custom | VARCHAR | Custom-Data (meist Username) |
| createdtime | DATETIME | Erstellungszeitpunkt |

#### PayPal E-Mails: `paypal_emails`

Verwaltung von PayPal-Empfänger-E-Mails.

#### Auctions: `auctions`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Auktions-ID |
| seller_id | INT | Verkäufer User-Code |
| item_id | INT | Item-ID |
| starting_bid | INT | Startgebot |
| current_bid | INT | Aktuelles Gebot |
| end_time | DATETIME | Endzeitpunkt |
| status | VARCHAR | Status |

#### Auctions Bids: `bids`

Gebote auf Auktionen.

#### Auctions Log: `auctions_log`

Historie abgeschlossener Auktionen.

#### Market: `market`

Spieler-Marktplatz für Item-Handel.

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Market-ID |
| a_item_idx | INT | Item-ID |
| a_serial | VARCHAR | Seriennummer |
| a_plus | INT | Upgrade-Level |
| a_flag | INT | Flags |
| a_quantity | INT | Menge |
| a_item_option0-4 | INT | Item-Optionen |
| a_socket | INT | Socket |
| a_item_origin_0-5 | INT | Origin-Daten |
| a_now_dur | INT | Haltbarkeit |
| a_max_dur | INT | Max. Haltbarkeit |
| a_sell_charindex | INT | Verkäufer Char-ID |
| a_sell_charname | VARCHAR | Verkäufer Name |
| gold | BIGINT | Preis |
| list_date | DATETIME | Listungsdatum |
| category | INT | Kategorie |

#### Web Vault: `web_vault`

Web-basiertes Item-Storage für Cross-Server-Transfer.

#### Vote4Coins: `vote4coins`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Vote-ID |
| site | VARCHAR | Vote-Seite |
| account_id | INT | User-Code |
| account_ip | VARCHAR | IP-Adresse |
| date | DATETIME | Datum |

#### Vote4Coins Log: `vote4coins_log`

Historie aller Vote-Aktionen.

#### XtremeTop100: `xtremetop100`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Entry-ID |
| account_id | INT | User-Code |
| account_ip | VARCHAR | User-IP |
| xtremetop_ip | VARCHAR | XtremeTop100-IP |
| next_date | DATETIME | Nächstes Vote-Datum |

#### Referrals: `referrals`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Referral-ID |
| invited_by | INT | Einlader User-Code |
| registered | INT | Registrierter User-Code |
| date | DATETIME | Datum |

#### Redeem Codes: `redeem`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Code-ID |
| code | VARCHAR | Einlösecode |
| type | VARCHAR | Art (cash, item, etc.) |
| value | INT | Wert |
| status | INT | Status (0=unused, 1=used) |

#### Tickets: `tickets`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Ticket-ID |
| account | INT | User-Code |
| category | VARCHAR | Kategorie |
| desc | TEXT | Beschreibung |
| date | DATETIME | Erstellungsdatum |
| priority | INT | Priorität |
| status | VARCHAR | Status (open, closed, etc.) |

#### Ban Log: `ban_log`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Log-ID |
| account_id | INT | User-Code |
| date | DATETIME | Ban-Datum |
| reason | TEXT | Ban-Grund |

#### Delete Account: `delete_account`

Warteschlange für Account-Löschungen.

#### Events: `events`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Event-ID |
| name | VARCHAR | Event-Name |
| event_start | DATETIME | Startzeit |
| event_end | DATETIME | Endzeit |

#### Launcher Log: `launcher_log`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | INTEGER (PK) | Log-ID |
| account | INT | User-Code |
| version | VARCHAR | Launcher-Version |
| file | VARCHAR | Dateiname |
| date | DATETIME | Datum |

#### VIP Subscribers: `vip_subscribers`

VIP-Mitgliedschaften.

#### Taxes: `taxes`

Steuer-Konfiguration für verschiedene Systeme.

Zusätzliche Tabellen:

- `lotto_tickets` - Lotterie-Tickets
- `lotto_winning_numbers` - Gewinnzahlen
- `lotto_reward` - Lotterie-Belohnungen
- `blackjack` - BlackJack-Spiel
- `blackjack_log` - BlackJack-Historie
- `minislots` - Mini-Slots-Spiel
- `wheel_of_fortune` - Glücksrad
- `wheel_of_fortune_free` - Gratis-Glücksrad
- `wheel_of_fortune_logs` - Glücksrad-Historie
- `lcball` - LCBall-Spiel (Lotto-ähnlich)
- `mystery` - Mystery-Box-System
- `architect` - Architekten-System
- `architect_log` - Architekten-Log
- `tournament` - Turniere
- `rewards` - Belohnungen
- `surprises` - Überraschungen
- `loyalty` - Loyalitätspunkte
- `subscribers` - Newsletter-Abonnenten
- `discord` - Discord-Integration
- `pages` - Dynamische Seiten
- `tiers` - Tier-System
- `tiers_level` - Tier-Level
- `tiers_logs` - Tier-Logs
- `achievements` - Erfolge

---

## Authentifizierung & Hash-Algorithmen

Verwendete Hash-Verfahren:

1. MD5 (Standard, wenn `$encryption = "MD5"`)
   - Funktion: `md5($password)`
   - Speicherung: Lowercase
   - Sicherheitsrisiko: MD5 ist veraltet und unsicher!

2. SHA256 (wenn `$encryption = "SHA256"`)
   - Salt: Fest codiert (sehr lang, 120+ Zeichen)
   - Funktion: `hash('sha256', $username . $salt . $password)`
   - Speicherung: Lowercase
   - Sicherheitsrisiko: Fest codierter Salt!

3. Klartext (wenn `$encryption` leer)
   - Passwort wird unverschlüsselt gespeichert
   - Kritisches Sicherheitsrisiko!

Authentifizierungs-Flow:

1. Login:
   - User gibt `user_id` oder `email` + `password` ein
   - System hasht Passwort mit gewählter Methode
   - Query: `SELECT user_code, activated, passwd FROM bg_user WHERE (user_id|email)=:login AND passwd=:password`
   - Session-Speicherung: `$_SESSION['id'] = user_code`
   - Fingerprint: `md5($_SERVER['HTTP_USER_AGENT'] . 'x' . $_SERVER['REMOTE_ADDR'])`

2. Discord OAuth:
   - Login via Discord-ID und Discord-E-Mail
   - Kein Passwort-Check erforderlich
   - `DiscordLogin` muss aktiviert sein

3. Session-Validierung:
   - Prüfung von `$_SESSION['id']`
   - Prüfung von `$_SESSION['password']` (doppelt gehashtes Passwort)
   - Fingerprint-Validierung gegen Session-Hijacking

4. Token-basierte Aktionen:
   - E-Mail-Verifikation: `email_token`
   - Passwort-Reset: `passlost_token`
   - Account-Löschung: `deletion_token`
   - Account-Registrierung: `registration_token`

---

## Datenbank-Beziehungen (ER-Diagramm)

```mermaid
erDiagram
    bg_user ||--o{ t_characters : "hat"
    bg_user ||--o{ t_stash0 : "besitzt"
    bg_user ||--o{ t_stash_money : "hat"
    bg_user ||--o{ referrals : "lädt_ein"
    bg_user ||--o{ vote4coins : "votet"
    bg_user ||--o{ donate : "spendet"
    bg_user ||--o{ tickets : "erstellt"
    bg_user ||--o{ ban_log : "gebannt"
    
    t_users ||--|| bg_user : "erweitert"
    
    t_characters ||--o{ t_inven0 : "hat_inventar"
    t_characters ||--o{ t_wear_inven : "trägt"
    t_characters ||--o{ t_skill : "hat_skills"
    t_characters ||--o{ t_apets : "hat_pets"
    t_characters ||--o| t_guildmember : "gehört_zu"
    
    t_guild ||--o{ t_guildmember : "enthält"
    t_guild ||--o| t_castle : "besitzt"
    t_guild ||--o{ t_castle_join : "registriert_für"
    
    t_item ||--o{ t_inven0 : "referenziert"
    t_item ||--o{ t_stash0 : "referenziert"
    t_item ||--o{ market : "verkauft"
    t_item ||--o{ web_vault : "gelagert"
    
    auctions ||--o{ bids : "hat_gebote"
    auctions ||--|| auctions_log : "wird_zu"
    
    payments ||--|| bg_user : "von"
    donate ||--|| bg_user : "von"
    
    t_gift0 ||--|| bg_user : "von"
    t_gift0 ||--|| bg_user : "an"
    
    t_purchase0 ||--|| bg_user : "gekauft_von"
    
    bg_user {
        int user_code PK
        varchar user_id UK
        varchar passwd
        varchar email UK
        varchar ip
        tinyint activated
        datetime create_date
        int cash
        int donated_cash
        varchar social_id UK
        int web_admin
        varchar deletion_token
        varchar passlost_token
        varchar email_token
        varchar new_email
        datetime ban_time
        int DiscordId
        varchar DiscordUsername
    }
    
    t_users {
        varchar a_idname PK
        int a_zone_num
    }
    
    t_characters {
        int a_index PK
        int a_user_index FK
        tinyint a_enable
        varchar a_name UK
        varchar a_nick
        int a_job
        int a_level
        bigint a_exp
        int a_admin
        int a_wins
        int a_looses
        int a_killed_monster
        int a_deaths
    }
    
    t_guild {
        int a_index PK
        tinyint a_enable
        varchar a_name UK
        int a_level
        bigint a_balance
    }
    
    t_guildmember {
        int a_char_index PK_FK
        int a_guild_index FK
        varchar a_char_name
        int a_pos
    }
    
    t_castle {
        int a_zone_index PK
        int a_owner_char_index
        int a_owner_guild_index
        varchar a_owner_char_name
        varchar a_owner_guild_name
        bigint a_next_war_time
        bigint a_last_war_time
    }
    
    t_item {
        int a_index PK
        varchar a_name_usa
        text a_descr_usa
        int a_texture_id
        int a_grade
    }
    
    t_stash0 {
        int a_user_idx FK
        int a_item_idx FK
        varchar a_serial
        int a_count
        int a_plus
        int a_item_option0
        int a_item_option1
        int a_item_option2
        int a_item_option3
        int a_item_option4
    }
    
    payments {
        int id PK
        varchar txn_id UK
        varchar custom FK
        decimal payment_amount
        datetime createdtime
    }
    
    donate {
        int id PK
        int account_id FK
        varchar code
        int status
    }
```

---

## Sicherheitsrisiken

### 1. Authentifizierung

| Risiko | Schweregrad | Beschreibung |
|--------|-------------|--------------|
| Schwache Hashes | Kritisch | MD5 ist veraltet, Rainbow-Tables können Passwörter knacken |
| Fest codierter Salt | Kritisch | SHA256-Salt ist fest im Code, nicht pro User |
| Klartext-Option | Kritisch | Möglichkeit, Passwörter unverschlüsselt zu speichern |
| Keine Argon2 | Hoch | Moderne Hashing-Algorithmen fehlen |
| Kein 2FA/TOTP | Hoch | Keine Zwei-Faktor-Authentifizierung |
| Session-Fixation | Hoch | Session-ID wird nicht regeneriert nach Login |

### 2. Datenbankstruktur

| Risiko | Schweregrad | Beschreibung |
|--------|-------------|--------------|
| Keine Foreign Keys | Mittel | Referentielle Integrität nicht erzwungen |
| Fehlende Indizes | Mittel | Performance-Probleme bei großen Datenmenken |
| Partitionierte Tabellen | Mittel | `t_inven0X`, `t_stash0X` - komplexe Verwaltung |
| Direkte Queries | Mittel | 347+ SQL-Queries direkt im Code |

### 3. Datenintegrität

| Risiko | Schweregrad | Beschreibung |
|--------|-------------|--------------|
| Keine Transaktionen | Mittel | Kritische Operationen nicht atomar |
| Race Conditions | Mittel | Gleichzeitige Item-Transfers unsicher |
| Fehlende Constraints | Mittel | NULL/NOT NULL nicht konsistent |

### 4. SQL Injection

| Risiko | Schweregrad | Beschreibung |
|--------|-------------|--------------|
| Teilweise Prepared Statements | Hoch | Nicht alle Queries verwenden Prepared Statements |
| String-Konkatenation | Hoch | Einige Queries bauen SQL-Strings zusammen |
| Fehlende Input-Validierung | Hoch | Unzureichende Validierung von User-Input |

### 5. Credentials im Code

| Risiko | Schweregrad | Beschreibung |
|--------|-------------|--------------|
| Hardcoded DB-Credentials | Kritisch | `config.php` enthält Klartext-Passwörter |
| E-Mail-Passwörter | Kritisch | SMTP-Passwörter im Code |
| API-Keys | Kritisch | reCAPTCHA-Keys im Code |

---

## Technische Schulden

1. Architektur
   - Monolithische Struktur, keine Microservices, direkter DB-Zugriff
2. Performance
   - N+1 Queries, kein Caching, fehlende Indizes, SQLite-Concurrency
3. Wartbarkeit
   - 347+ SQL-Queries ohne ORM/Migrations/Seeds
4. Datenkonsistenz
   - MySQL + SQLite, doppelte Daten, keine Synchronisation

---

## Empfehlungen für neue Portal-DB

Konzept: Separate Portal-Datenbank – Trennung von Game-Backend und Portal-Frontend

Beispieltabellen: `portal_users`, `portal_user_security`, `portal_oauth_providers`, `portal_game_accounts`, `portal_sessions`, `portal_activity_log`, `portal_roles`/`portal_permissions`/`portal_role_permissions`/`portal_user_roles`

Vorteile: Sicherheit (Argon2id, 2FA), Skalierbarkeit, Multi-Server, OAuth, Audit Trail, RBAC

Migration-Strategie (Phasen 1–5): Parallelbetrieb, Migration mit Passwort-Reset, Fallback, schrittweise Umstellung

---

Zusammenfassung

- 4 MySQL-Datenbanken (`db_auth`, `db_db`, `db_data`, `db_db` [logs])
- 2 SQLite-Datenbanken (`WEB2.db`, `WEB.db`)
- 40+ Tabellen beschrieben, Beziehungen dokumentiert (Mermaid)
- Wesentliche Risiken und Empfehlungen aufgeführt

Dokumentiert am: 2025-10-03  
Autor: Legacy DB Analysis Agent  
Status: Abgeschlossen (Analyse-Phase)
