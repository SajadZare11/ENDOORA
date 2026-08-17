# Endoora Backup and Restore Runbook — Day 01 Baseline

No database or user storage exists yet, so no backup is required today.

Before future risky changes:
1. identify database/storage affected;
2. stop relevant writes if required;
3. create backup;
4. verify backup is non-empty;
5. record path/time;
6. rehearse restore in a safe environment for high-risk migrations;
7. create Git checkpoint;
8. perform change;
9. verify data and regression tests.

Never treat an untested backup as sufficient for a high-risk production migration.
