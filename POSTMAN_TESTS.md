# Postman Test Collection - Recipe Management API

## Base URL
```
http://localhost:3002/api
```

---

## 1. USER ENDPOINTS

### 1.1 Register User
**POST** `/users/register`
```json
{
  "email": "test@gmail.com",
  "username": "testuser",
  "password": "password123",
  "role": "user"
}
```
**Expected Response:**
```json
{
  "success": true,
  "message": "verify your email with OTP",
  "email": "test@gmail.com",
  "otp": "123456"
}
```

### 1.2 Verify OTP
**POST** `/users/verify-otp`
```json
{
  "email": "test@gmail.com",
  "otp": "123456"
}
```

### 1.3 Login
**POST** `/users/login`
```json
{
  "email": "test@gmail.com",
  "password": "password123"
}
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "test@gmail.com",
    "username": "testuser",
    "role": "user",
    "status": "active"
  }
}
```
**Save accessToken for next requests!**

### 1.4 Get Me
**GET** `/users/me`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 1.5 Refresh Token
**POST** `/users/refresh`
**Note:** Cookie automatically sent

### 1.6 Logout
**POST** `/users/logout`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 1.7 Get All Users (Admin Only)
**GET** `/users`
**Headers:**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

### 1.8 Get User By ID
**GET** `/users/:id`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 1.9 Update User
**PUT** `/users/:id`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```
```json
{
  "username": "newusername"
}
```

### 1.10 Delete User (Admin Only)
**DELETE** `/users/:id`
**Headers:**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

---

## 2. INGREDIENT ENDPOINTS

### 2.1 Create Ingredient (Admin Only)
**POST** `/ingredients`
**Headers:**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```
```json
{
  "name": "Tomato",
  "category": "Vegetable",
  "unit": "kg"
}
```

### 2.2 Get All Ingredients
**GET** `/ingredients`

### 2.3 Get Ingredient By ID
**GET** `/ingredients/:id`

### 2.4 Update Ingredient (Admin Only)
**PUT** `/ingredients/:id`
**Headers:**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```
```json
{
  "name": "Cherry Tomato",
  "category": "Vegetable"
}
```

### 2.5 Delete Ingredient (Admin Only)
**DELETE** `/ingredients/:id`
**Headers:**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

---

## 3. RECIPE ENDPOINTS

### 3.1 Create Recipe
**POST** `/recipes`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```
```json
{
  "title": "Pasta Carbonara",
  "description": "Classic Italian pasta dish",
  "category": "Main Course",
  "cookingTime": 30,
  "difficulty": "Medium",
  "instructions": "1. Boil pasta\n2. Cook bacon\n3. Mix with eggs and cheese",
  "imageUrl": "https://example.com/pasta.jpg",
  "ingredients": [
    {
      "ingredientId": "INGREDIENT_UUID",
      "quantity": "500",
      "unit": "g"
    },
    {
      "ingredientId": "INGREDIENT_UUID_2",
      "quantity": "200",
      "unit": "g"
    }
  ]
}
```

### 3.2 Get All Recipes
**GET** `/recipes`
**Query Params (optional):**
- `category=Main Course`
- `difficulty=Easy`

### 3.3 Get Recipe By ID
**GET** `/recipes/:id`

### 3.4 Update Recipe
**PUT** `/recipes/:id`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```
```json
{
  "title": "Updated Pasta Carbonara",
  "cookingTime": 25
}
```

### 3.5 Delete Recipe
**DELETE** `/recipes/:id`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 4. RECIPE INGREDIENTS ENDPOINTS

### 4.1 Add Ingredient to Recipe
**POST** `/recipe-ingredients`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```
```json
{
  "recipeId": "RECIPE_UUID",
  "ingredientId": "INGREDIENT_UUID",
  "quantity": "100",
  "unit": "g"
}
```

### 4.2 Get Recipe Ingredients
**GET** `/recipe-ingredients/:recipeId`

### 4.3 Update Recipe Ingredient
**PUT** `/recipe-ingredients/:id`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```
```json
{
  "quantity": "150",
  "unit": "g"
}
```

### 4.4 Delete Recipe Ingredient
**DELETE** `/recipe-ingredients/:id`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 5. REVIEW ENDPOINTS

### 5.1 Create Review
**POST** `/reviews`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```
```json
{
  "recipeId": "RECIPE_UUID",
  "rating": 5,
  "comment": "Amazing recipe! Very delicious!"
}
```

### 5.2 Get All Reviews
**GET** `/reviews`
**Query Params (optional):**
- `status=approved`
- `recipeId=RECIPE_UUID`

### 5.3 Get Review By ID
**GET** `/reviews/:id`

### 5.4 Update Review Status (Admin Only)
**PUT** `/reviews/:id/status`
**Headers:**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```
```json
{
  "status": "approved"
}
```

### 5.5 Delete Review
**DELETE** `/reviews/:id`
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Testing Workflow

### Step 1: Create Admin User
1. Register admin: `/users/register` with `"role": "admin"`
2. Verify OTP: `/users/verify-otp`
3. Login: `/users/login`
4. Save admin accessToken

### Step 2: Create Regular User
1. Register user: `/users/register` with `"role": "user"`
2. Verify OTP: `/users/verify-otp`
3. Login: `/users/login`
4. Save user accessToken

### Step 3: Test Ingredients (Admin)
1. Create ingredients: `/ingredients` (use admin token)
2. Get all ingredients: `/ingredients`
3. Save ingredient IDs

### Step 4: Test Recipes (User)
1. Create recipe: `/recipes` (use user token + ingredient IDs)
2. Get all recipes: `/recipes`
3. Get recipe by ID: `/recipes/:id`
4. Save recipe ID

### Step 5: Test Recipe Ingredients
1. Add ingredient: `/recipe-ingredients`
2. Get ingredients: `/recipe-ingredients/:recipeId`
3. Update ingredient: `/recipe-ingredients/:id`

### Step 6: Test Reviews (User)
1. Create review: `/reviews`
2. Get all reviews: `/reviews`
3. Admin approve review: `/reviews/:id/status` (use admin token)

### Step 7: Test Permissions
1. Try admin endpoint with user token (should fail)
2. Try update other user's recipe (should fail)
3. Try delete with wrong role (should fail)

---

## Postman Environment Variables

Create these variables in Postman:
```
baseUrl: http://localhost:3002/api
userToken: (save from login)
adminToken: (save from admin login)
ingredientId: (save from create ingredient)
recipeId: (save from create recipe)
reviewId: (save from create review)
```

## Common Error Responses

### 400 - Validation Error
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```
