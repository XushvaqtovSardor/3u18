# Recipe API

Node.js va Express yordamida yaratilgan Recipe Management API.

## Xususiyatlar

- ✅ User authentication (JWT)
- ✅ Email verification (OTP)
- ✅ Recipe CRUD operations
- ✅ Ingredient management
- ✅ Review system
- ✅ Role-based access control (user, admin)
- ✅ Logtail (Better Stack) logging integration
- ✅ ApiError unified error handling

## Texnologiyalar

- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **Knex.js** - Query builder & migrations
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Winston** - Logging
- **Logtail** - Cloud logging
- **Nodemailer** - Email sending

## O'rnatish

```bash
# Dependencies o'rnatish
pnpm install

# Database yaratish
createdb knex_loyiha1

# Migrations ishga tushirish
pnpm migrate

# Seed data yuklash (ixtiyoriy)
pnpm seed
```

## .env Konfiguratsiyasi

`.env` fayli allaqachon sozlangan. Kerak bo'lsa o'zgartirishlar kiriting:

```env
PORT=3002
DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=knex_loyiha1
DB_PORT=5432
JWT_SECRET=my_production
JWT_REFRESH_SECRET=my_refresh_secret_key_2024
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
BETTERSTACK_TOKEN=your_token_here
```

## Ishga Tushirish

```bash
# Development mode (hot reload)
pnpm start:dev

# Production mode
pnpm start
```

Server `http://localhost:3002` da ishga tushadi.

## API Endpoints

### Authentication

- `POST /api/users/register` - Ro'yxatdan o'tish
- `POST /api/users/verify-otp` - Email tasdiqlash
- `POST /api/users/login` - Tizimga kirish
- `POST /api/users/refresh-token` - Token yangilash
- `GET /api/users/me` - O'z profilni ko'rish
- `POST /api/users/logout` - Tizimdan chiqish

### Users (Admin only)

- `GET /api/users` - Barcha foydalanuvchilar
- `GET /api/users/:id` - Foydalanuvchi ma'lumotlari
- `PUT /api/users/:id` - Foydalanuvchi yangilash
- `DELETE /api/users/:id` - Foydalanuvchi o'chirish

### Recipes

- `GET /api/recipes` - Barcha retseptlar
- `GET /api/recipes/:id` - Retsept ma'lumotlari
- `POST /api/recipes` - Retsept yaratish (auth required)
- `PUT /api/recipes/:id` - Retsept yangilash (author/admin)
- `DELETE /api/recipes/:id` - Retsept o'chirish (author/admin)

### Ingredients (Admin only)

- `GET /api/ingredients` - Barcha ingredientlar
- `GET /api/ingredients/:id` - Ingredient ma'lumotlari
- `POST /api/ingredients` - Ingredient yaratish
- `PUT /api/ingredients/:id` - Ingredient yangilash
- `DELETE /api/ingredients/:id` - Ingredient o'chirish

### Reviews

- `GET /api/reviews` - Barcha reviewlar
- `GET /api/reviews/:id` - Review ma'lumotlari
- `POST /api/reviews` - Review yaratish (auth required)
- `PUT /api/reviews/:id/status` - Review statusini o'zgartirish (admin)
- `PUT /api/reviews/:id` - Review yangilash (author/admin)
- `DELETE /api/reviews/:id` - Review o'chirish (author/admin)

## Error Handling

Barcha errorlar `ApiError` class orqali boshqariladi:

```javascript
throw new ApiError('Error message', 400); // Bad Request
throw new ApiError('Unauthorized', 401);
throw new ApiError('Forbidden', 403);
throw new ApiError('Not found', 404);
throw new ApiError('Server error', 500);
```

## Logging

Winston va Logtail orqali barcha loglar avtomatik saqlanadi:

- Console logs (development)
- Logtail cloud logs (Better Stack)
- Error tracking
- User activity logs

Loglarni ko'rish: https://logs.betterstack.com

## Role-Based Access

- **user** - Oddiy foydalanuvchi (recipe, review yaratish)
- **admin** - Administrator (barcha operatsiyalar)

## License

MIT
