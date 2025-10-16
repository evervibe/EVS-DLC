# Migration: WEB.db (SQLite) -> PostgreSQL (Plan, später umsetzen)

Ziel (zukünftig): Ersetzen der Legacy-SQLite-Webdatenbank durch eine moderne PostgreSQL-Instanz.

## Überblick

- Neue Postgres-Instanz via `DB/web/postgres/docker-compose.yml`
- Initiales Schema unter `DB/web/postgres/init/001_schema.sql`
- Migration erfolgt tabellenweise mit einem Skript (z. B. Python), das:
  1) aus `WEB.db` liest,
  2) Datensätze transformiert (Felder/Typen, Zeitformate),
  3) in Postgres einfügt (COPY/Batch Inserts)

## Schritte

1. Postgres starten (später):
   ```bash
   docker compose -f DB/web/postgres/docker-compose.yml up -d
   ```

2. (Optional) Testen, ob Schema geladen wurde:
   ```bash
   docker exec -it evs-postgres psql -U ${POSTGRES_USER:-evs} -d ${POSTGRES_DB:-evs_web} -c "\dt"
   ```

3. Migration ausführen (später): Skript unter `web/scripts/` ist aktuell nur ein Platzhalter.

## Tabellen-Mapping (Auszug)

- news(title, content, date, author, category)
- donate(account_id, code, type, status)
- payments(txn_id unique, payment_amount numeric, payment_currency)
- auctions / bids / auctions_log
- market (Item-Felder 1:1 übernommen, plus created/list_date)
- vote4coins / vote4coins_log / xtremetop100
- referrals
- redeem(code unique)
- tickets
- ban_log
- events
- launcher_log
- vip_subscribers

Hinweise:
- Zeitstempel werden zu `timestamptz` migriert.
- IPs zu `inet` konvertiert (sofern möglich), sonst als Text übernehmen.
- JSON-Strukturen (z. B. `web_vault.payload`) als `jsonb`.

## Datenvalidierung

- Row-Counts je Tabelle vergleichen.
- Stichprobenhafte Feldvalidierung (z. B. Zahlensummen, NULL-Werte).

## Betrieb

- App/Portal-Config auf Postgres-DSN umstellen (z. B. `postgres://evs:secret@localhost:5432/evs_web`).
- Backups via `pg_dump`/`pg_basebackup`.

## Nächste Schritte

- Python-Migrationsskript hinzufügen und für Kern-Tabellen implementieren.
- Indizes/Constraints nach Datenfüllung finalisieren (Performance).
- Optional: Views/Materialized Views für häufige Abfragen.
