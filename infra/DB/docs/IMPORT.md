# Datenbank-Import (EVS-DLC)

Diese Anleitung ist in zwei Bereiche getrennt:

- Game (MySQL): Vier Spiel-Datenbanken (`db_auth`, `db_db`, `db_data`, `db_post`)
- Web: Aktuell nur Dokumentation. Die frühere SQLite WEB.db wird später nach PostgreSQL migriert (siehe Legacy-Analyse). Hier im Repo keine DB-Dateien ablegen.

## Voraussetzungen

- MySQL 8.0 (empfohlen: 8.0.41 oder kompatibel)
- Ausreichender Speicher/Platz (große Dumps: `db_auth.sql`, `db_db.sql` jeweils >50 MB)
- macOS zsh Beispiele (Pfadangaben ggf. anpassen)

Zeichensätze/Collations: Die Dumps definieren teils spaltenspezifische Charsets (euckr, big5, gb2312, tis620, cp932, cp1250, cp1251, latin1, latin5). MySQL 8 bringt diese in der Regel mit. Bei exotischen Collation-Fehlern bitte MySQL 8 verwenden und ggf. `character-set-server`/`collation-server` Default auf `utf8mb4` belassen.

## Game (MySQL)

### Import mit Docker (empfohlen)

1. Docker Desktop starten.
2. In das Projektverzeichnis wechseln und den server-spezifischen Ordner per `SERVER` Variable mounten:

   - Der MySQL-EntryPoint importiert automatisch alles unter `/docker-entrypoint-initdb.d/` beim ersten Start mit leerem Datenverzeichnis.

   Beispiel docker run (Passwort anpassen):

   ```bash
  # Alternativ (empfohlen): docker-compose verwenden (SERVER und Port setzen)
  # Beispiel DEV:
  SERVER=dev MYSQL_PORT=3306 docker compose -f DB/game/docker-compose.yml up -d
   ```

  - Beim ersten Start werden nacheinander `000_create_databases.sql` und danach `010_import.sh` ausgeführt.
  - Die eigentlichen Dumps (`db_auth.sql`, `db_data.sql`, `db_db.sql`, `db_post.sql`) liegen unter `DB/game/servers/${SERVER}/dumps/` und werden durch `010_import.sh` importiert.
  - `010_import.sh` nutzt `$MYSQL_ROOT_PASSWORD` und ruft `mysql` gegen die vier DBs auf.

3. Healthcheck: Nach dem Import in den Container gehen und Tabellen zählen (optional):

   ```bash
  docker exec -it evs-lc-${SERVER:-dev}-mysql mysql -uroot -psecret -e "SHOW DATABASES;"
  docker exec -it evs-lc-${SERVER:-dev}-mysql mysql -uroot -psecret -e "SELECT COUNT(*) FROM db_data.t_action;"
   ```

### Import lokal (ohne Docker)

1. Datenbanken erstellen:

   ```bash
  mysql -u root -p < DB/game/servers/${SERVER}/000_create_databases.sql
   ```

2. Dumps in die jeweiligen DBs einspielen:

   ```bash
  mysql -u root -p db_auth < DB/game/servers/${SERVER}/dumps/db_auth.sql
  mysql -u root -p db_data < DB/game/servers/${SERVER}/dumps/db_data.sql
  mysql -u root -p db_db   < DB/game/servers/${SERVER}/dumps/db_db.sql
  mysql -u root -p db_post < DB/game/servers/${SERVER}/dumps/db_post.sql
   ```

> Tipp: Je nach Größe der Dateien kann der Import mehrere Minuten dauern.

### Troubleshooting (Game/MySQL)

- Fehler bei Collations (z. B. euckr/big5/gb2312/tis620/cp932/cp1250/cp1251):
  - Stelle sicher, dass MySQL 8.0 verwendet wird.
  - Prüfe die Server-Variablen:
    - `show variables like 'character_set%';`
    - `show variables like 'collation%';`
  - Lasse `character_set_server`/`collation_server` auf Standard (`utf8mb4`/`utf8mb4_0900_ai_ci`). Spaltencollations aus dem Dump werden respektiert.

- Zugriff verweigert (Authentication):
  - Passwort korrekt? `MYSQL_ROOT_PASSWORD` bei Docker bzw. `-p` Eingabe lokal.

- Import langsam:
  - MyISAM-Dumps: `bulk_insert_buffer_size` temporär erhöhen (Server-Konfiguration).
  - Stelle sicher, dass keine unnötigen Prozesse die Platte stark auslasten.

- Scriptpfad in `010_import.sh`:
  - Das Skript ist für `/docker-entrypoint-initdb.d/` geschrieben. Für lokale Läufe kannst du analog die `mysql`-Befehle oben verwenden oder das Skript anpassen.
  - Falls erforderlich: `chmod +x DB/game/servers/${SERVER}/010_import.sh`

## Hinweise zur Struktur

- `db_auth`: Account/Auth-Tabellen (großer Dump, Inhalt nicht angezeigt aufgrund Dateigröße).
- `db_data`: Referenz-/Stammdaten (z. B. Aktionen, Affinity, Pets). MyISAM-Tabellen, viele Sprachen.
- `db_db`: Persistente Spiel-/Runtime-Daten (großer Dump).
- `db_post`: Optional/Nachgelagert (derzeit leerer Dump).
- Web/Portal: Historisch existiert(e) eine SQLite-Datenbank (WEB.db/WEB2.db). Diese wird hier NICHT abgelegt. Details und spätere Migration siehe `LEGACY_ANALYSIS.md`.

## Web (nur Doku)

Im Ordner `DB/web/` liegen aktuell nur Dokumente. Keine Datenbankdateien ablegen. Die künftige Migration der historischen WEB.db (SQLite) auf PostgreSQL wird separat erfolgen.

## Nächste Schritte

- Optional: `docker-compose.yml` bereitstellen, um MySQL, Volumes und Import reproduzierbar zu starten.
- `010_import.sh` portabler machen (ENV für Host/User/Pass, Pfadvariablen, Fehlerchecks).
- Sanity Checks/Smoke Tests: Einige Kern-Tabellen zählen; `SELECT`-Proben absetzen.
 - Legacy-Struktur, Risiken und Migrations-Empfehlungen: Siehe `LEGACY_ANALYSIS.md`.
