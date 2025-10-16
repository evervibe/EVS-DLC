# Game Databases (MySQL)

Dieser Ordner umfasst die vier MySQL-Datenbanken des Spiels:

- `db_auth` – Account-Management/Authentifizierung
- `db_db` – Spiel-/Runtime-Daten (Charaktere, Gilden, Castle, Inventare …)
- `db_data` – Statische Spiel-Daten (Items, Skills, Optionen …)
- `db_post` – Optional/Nachgelagert

## Multi-Server Setup

Unter `servers/` können mehrere Serverumgebungen angelegt werden, die dieselbe DB-Struktur nutzen, aber unterschiedliche Daten (Dumps) enthalten.

- `servers/dev/` – aktuelle Dev/Test-Umgebung (aus dem bisherigen `init/` verschoben)
- `servers/template/` – Vorlage, um neue Server schneller anzulegen
- `scripts/new-server.sh` – Helfer, um `servers/<name>` aus der Vorlage zu erzeugen

Docker Compose ist parametrisiert:

- Containername: `evs-lc-${SERVER:-dev}-mysql`
- Volume: `evs-lc-${SERVER:-dev}-mysql-data`
- Port: `${MYSQL_PORT:-3306}`
- Mount: `./servers/${SERVER:-dev} -> /docker-entrypoint-initdb.d`

Start Beispiel (dev):

```bash
SERVER=dev MYSQL_PORT=3306 docker compose -f DB/game/docker-compose.yml up -d
```

Neuen Server anlegen und mit eigenen Dumps befüllen:

```bash
DB/game/scripts/new-server.sh myserver
# Danach Dumps ablegen in: DB/game/servers/myserver/dumps/
# Starten:
SERVER=myserver MYSQL_PORT=3307 docker compose -f DB/game/docker-compose.yml up -d
```

Import-Reihenfolge im Container:

1. `/docker-entrypoint-initdb.d/000_create_databases.sql`
2. `/docker-entrypoint-initdb.d/010_import.sh` (importiert aus `dumps/`)

Für Details siehe `../docs/IMPORT.md`.
