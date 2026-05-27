# DERBII Senegal Premium E-commerce

Next.js 15 + Tailwind + Supabase architecture for a luxury leather accessories storefront with hidden super admin (`/super-admin`).

## Design direction
- Premium, editorial, **light** visual style inspired by modern fashion e-commerce.
- Focused product cards, clean spacing, warm leather-inspired palette.

## Super Admin access
No login button is shown publicly.
Access only via `/super-admin/login`.

1) Create user in Supabase Auth (email + password).
2) Insert same email in `admins` table:
```sql
insert into admins (email) values ('admin@derbii.sn');
```

> Le mot de passe super admin = le mot de passe du compte créé dans Supabase Auth.

## Features
- Dynamic homepage CMS blocks (reorder/activate)
- Product/catalog/collection management
- Order workflow with unique order numbers (`DRB-XXXX`)
- WhatsApp prefilled checkout confirmation and validation templates
- Protected admin routes with middleware + Supabase admin login action
- Supabase schema for products, orders, settings, and media assets
