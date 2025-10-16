# EVS-DLC Database

Diese README beschreibt den Inhalt des Ordners `DB/` und wie du die Datenbanken lokal importierst (Docker und lokal).

## Struktur (Trennung Game vs Web)

- `game/` – MySQL-Datenbanken des Spiels (db_auth, db_db, db_data, db_post)
	- `docker-compose.yml` – lokaler Start MySQL 8
	- `init/` – Lege hier alle MySQL-Skripte/Dumps ab:
		- `000_create_databases.sql`
		- `010_import.sh`
		- `dumps/` → `db_auth.sql`, `db_data.sql`, `db_db.sql`, `db_post.sql`
- `web/` – (nur Doku) Portal/Website – aktuell keine Datenbanken hier ablegen
	- Nur Dokumentation (z. B. `../docs/LEGACY_ANALYSIS.md`). Die SQLite-Dateien (WEB.db/WEB2.db) NICHT versionieren.
- `docs/` – Import-Anleitung und Legacy-Analyse

## Inhalt

- Hinweis: Lege alle SQL/Dumps unter `game/init/` ab (nicht im Root `DB/`).
 - `docs/IMPORT.md` – Detaillierte Import-Anleitung (Docker & lokal), Troubleshooting.
 - `docs/LEGACY_ANALYSIS.md` – Ausführliche Legacy-DB-Analyse (Struktur, Risiken, Empfehlungen).

Hinweise:
- Zielsystem ist MySQL 8.0 (Dump-Header: 8.0.41). MariaDB kann funktionieren, ist aber nicht empfohlen.
- Viele Tabellen sind MyISAM; es gibt keine Foreign-Key-Enforcement.
- Zahlreiche spezifische Zeichensätze/Collations pro Spalte (euckr, big5, gb2312, tis620, cp932, cp1250, cp1251, latin1, latin5, utf8mb4). Nutze MySQL 8 mit Standard-Charset-Paketen.

## Import (Kurzfassung)

- Mit Docker: `DB/game/init` wird nach `/docker-entrypoint-initdb.d/` gemountet. Beim ersten Start importiert MySQL automatisch `000_create_databases.sql` und ruft `010_import.sh` auf, welches die Dumps aus `init/dumps/` lädt. Details siehe `docs/IMPORT.md`.
- Lokal: Erst `000_create_databases.sql` ausführen, dann jeden Dump in die passende DB importieren. Details siehe `docs/IMPORT.md`.

Weitere Details und Troubleshooting findest du in `docs/IMPORT.md`.

Zusätzliche Ressourcen:
- Legacy-Analyse: `docs/LEGACY_ANALYSIS.md`
- Import-Guide: `docs/IMPORT.md`
