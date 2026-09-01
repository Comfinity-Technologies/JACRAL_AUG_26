from app.database import engine
from sqlalchemy import text

with engine.begin() as conn:
    sqls = [
        "ALTER TABLE products ALTER COLUMN created_at SET DEFAULT now()",
        "ALTER TABLE products ALTER COLUMN updated_at SET DEFAULT now()",
        "ALTER TABLE products ALTER COLUMN is_active SET DEFAULT true",
        "ALTER TABLE products ALTER COLUMN featured SET DEFAULT false",
        "ALTER TABLE products ALTER COLUMN stock SET DEFAULT 0",
        # Also fix users table
        "ALTER TABLE users ALTER COLUMN created_at SET DEFAULT now()",
        "ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT now()",
        "ALTER TABLE users ALTER COLUMN is_active SET DEFAULT true",
        # Fix categories table
        "ALTER TABLE categories ALTER COLUMN created_at SET DEFAULT now()",
        "ALTER TABLE categories ALTER COLUMN updated_at SET DEFAULT now()",
        "ALTER TABLE categories ALTER COLUMN is_active SET DEFAULT true",
        # Fix orders table
        "ALTER TABLE orders ALTER COLUMN created_at SET DEFAULT now()",
        "ALTER TABLE orders ALTER COLUMN updated_at SET DEFAULT now()",
        "ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending'",
        "ALTER TABLE orders ALTER COLUMN payment_status SET DEFAULT 'pending'",
        "ALTER TABLE orders ALTER COLUMN discount_amount SET DEFAULT 0",
    ]
    for sql in sqls:
        try:
            conn.execute(text(sql))
            print(f"OK: {sql}")
        except Exception as e:
            print(f"SKIP ({e}): {sql}")

print("Done!")
