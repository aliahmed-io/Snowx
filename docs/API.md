# API Reference

## Authentication

All admin API endpoints require authentication via Kinde. User must have `admin:access` permission.

## Server Actions

### Products

#### `getProducts(options)`
Fetch products with filtering.

```typescript
import { getProducts } from "@/actions/products";

const products = await getProducts({
  categorySlug: "streaming",
  platforms: ["Netflix", "Spotify"],
  duration: "1 Month",
  sort: "price-asc",
  page: 1
});
```

#### `createProduct(data)`
Create a new product (admin only).

```typescript
import { createProduct } from "@/actions/products";

await createProduct({
  name: "Netflix Premium",
  slug: "netflix-premium",
  description: "Premium Netflix subscription",
  price: 15.99,
  discountPercentage: 10,
  images: ["https://..."],
  categoryId: "...",
  inventory: 100,
  isActive: true,
  isFeatured: false,
  duration: "1 Month",
  platform: "Netflix"
});
```

#### `updateProduct(id, data)`
Update a product (admin only).

#### `deleteProduct(id)`
Delete a product (admin only).

---

### Categories

#### `getCategories()`
Fetch all categories.

#### `createCategory(data)`
Create a category (admin only).

#### `updateCategory(id, data)`
Update a category (admin only).

#### `deleteCategory(id)`
Delete a category (admin only).

---

### Orders

#### `createOrder(data)`
Create a new order after successful payment.

#### `getOrders()`
Get orders for current user.

#### `getOrderById(id)`
Get specific order details.

---

### Filters

#### `getFilterOptions(type)`
Get filter options by type ("duration" or "platform").

#### `createFilterOption(data)`
Create a new filter option (admin only).

---

## API Routes

### `/api/stripe/webhook`
Stripe webhook handler for payment events.

### `/api/uploadthing`
UploadThing routes for file uploads.

### `/api/auth/*`
Kinde authentication routes.

---

## Database Schema

See `prisma/schema.prisma` for complete database schema.

### Key Models
- `User` - User accounts
- `Product` - Products/subscriptions
- `Category` - Product categories
- `Order` - Customer orders
- `OrderItem` - Items in an order
- `Account` - Digital account credentials
- `FilterOption` - Duration/platform filters
