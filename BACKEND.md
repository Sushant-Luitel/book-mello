# Backend architecture

The application uses Next.js Route Handlers as its backend-for-frontend and Supabase for Auth, PostgreSQL, Storage, and row-level authorization. Browser code receives only the publishable key. `SUPABASE_SERVICE_ROLE_KEY` is optional and may only be imported through `lib/supabase/admin.ts` in trusted server code.

## Before applying the migration

The repository did not contain a database dump or generated Supabase types, so the remote `books` table could not be inspected from source. Run these read-only queries in the Supabase SQL editor and compare the result with the migration before applying it:

```sql
select column_name, data_type, is_nullable, column_default
from information_schema.columns where table_schema='public' and table_name='books'
order by ordinal_position;

select indexname, indexdef from pg_indexes where schemaname='public' and tablename='books';
select polname, pg_get_expr(polqual, polrelid) from pg_policy where polrelid='public.books'::regclass;
select id, name, public from storage.buckets;
```

The supporting migration assumes `books.id` is `uuid`. If the query shows another type, change each supporting `book_id` to that exact type before running the migration. The migration intentionally does not create, drop, or alter `books` and does not touch existing book rows.

After inspecting the actual publication/status column, add `books` RLS policies matching it (for example, public users may select published rows; admins may manage all rows). This is deliberately not guessed in the baseline migration.

## API

- `POST /api/v1/auth/register`, `/login`, `/logout`
- `GET|POST /api/v1/books` (writes require an active ADMIN profile)
- `GET|POST /api/v1/cart` (authenticated, user ID always comes from the session)
- `GET /api/v1/home`

All mutation bodies are validated with Zod. Database RLS remains the final authorization boundary even when route helpers perform an earlier check.
