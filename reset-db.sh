wrangler d1 execute fastmatch --file=./db/reset.sql
wrangler d1 execute fastmatch --file=./db/migrations/001_init.sql
wrangler d1 execute fastmatch --file=./db/migrations/002_seed.sql