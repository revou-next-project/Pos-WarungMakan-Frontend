# Food POS System API Endpoints

## Authentication

### POST /api/auth/login
Authenticate a user and get access token.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

## Products

### GET /api/products
Get all products with optional filtering.

**Query Parameters:**
- `category` - Filter by category name
- `search` - Search in product name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Rice Box Chicken",
      "price": 20000,
      "category": "Food",
      "unit": "box",
      "isPackage": false,
      "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&q=80"
    },
    // More products...
  ]
}
```

### POST /api/products
Create a new product.

**Request:**
```json
{
  "name": "New Product",
  "price": 15000,
  "categoryId": 1,
  "unit": "portion",
  "isPackage": false,
  "image": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 9,
    "name": "New Product",
    "price": 15000,
    "category": "Food",
    "unit": "portion",
    "isPackage": false,
    "image": "https://example.com/image.jpg"
  }
}
```

### PUT /api/products/{id}
Update an existing product.

**Request:**
```json
{
  "name": "Updated Product",
  "price": 18000,
  "categoryId": 1,
  "unit": "portion",
  "isPackage": false,
  "image": "https://example.com/new-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 9,
    "name": "Updated Product",
    "price": 18000,
    "category": "Food",
    "unit": "portion",
    "isPackage": false,
    "image": "https://example.com/new-image.jpg"
  }
}
```

### DELETE /api/products/{id}
Delete a product.

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Orders

### POST /api/orders
Create a new order.

**Request:**
```json
{
  "customerType": "dine-in",
  "paymentMethod": "cash",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 20000,
      "note": "Extra spicy",
      "discount": 0
    },
    {
      "productId": 3,
      "quantity": 2,
      "price": 5000,
      "note": "",
      "discount": 0
    }
  ],
  "discountType": "percentage",
  "discountValue": "10",
  "cashAmount": 50000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-20230615-001",
    "customerType": "dine-in",
    "status": "waiting",
    "paymentMethod": "cash",
    "subtotal": 50000,
    "discountType": "percentage",
    "discountValue": 10,
    "discountAmount": 5000,
    "tax": 4500,
    "total": 49500,
    "cashAmount": 50000,
    "changeAmount": 500,
    "items": [
      {
        "id": 1,
        "productId": 1,
        "name": "Rice Box Chicken",
        "quantity": 2,
        "price": 20000,
        "discount": 0,
        "subtotal": 40000,
        "note": "Extra spicy"
      },
      {
        "id": 2,
        "productId": 3,
        "name": "Iced Tea",
        "quantity": 2,
        "price": 5000,
        "discount": 0,
        "subtotal": 10000,
        "note": ""
      }
    ],
    "createdAt": "2023-06-15T14:30:45Z"
  }
}
```

### GET /api/orders
Get all orders with optional filtering.

**Query Parameters:**
- `status` - Filter by order status
- `date` - Filter by date (YYYY-MM-DD)
- `customerType` - Filter by customer type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-20230615-001",
      "customerType": "dine-in",
      "status": "completed",
      "total": 49500,
      "createdAt": "2023-06-15T14:30:45Z",
      "completedAt": "2023-06-15T14:45:12Z"
    },
    // More orders...
  ]
}
```

### GET /api/orders/{id}
Get a specific order with details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-20230615-001",
    "customerType": "dine-in",
    "status": "completed",
    "paymentMethod": "cash",
    "subtotal": 50000,
    "discountType": "percentage",
    "discountValue": 10,
    "discountAmount": 5000,
    "tax": 4500,
    "total": 49500,
    "cashAmount": 50000,
    "changeAmount": 500,
    "items": [
      {
        "id": 1,
        "productId": 1,
        "name": "Rice Box Chicken",
        "quantity": 2,
        "price": 20000,
        "discount": 0,
        "subtotal": 40000,
        "note": "Extra spicy"
      },
      {
        "id": 2,
        "productId": 3,
        "name": "Iced Tea",
        "quantity": 2,
        "price": 5000,
        "discount": 0,
        "subtotal": 10000,
        "note": ""
      }
    ],
    "createdAt": "2023-06-15T14:30:45Z",
    "completedAt": "2023-06-15T14:45:12Z",
    "createdBy": {
      "id": 1,
      "name": "Admin User"
    }
  }
}
```

### PUT /api/orders/{id}/status
Update order status.

**Request:**
```json
{
  "status": "cooking"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-20230615-001",
    "status": "cooking"
  }
}
```

## Inventory

### GET /api/inventory
Get all inventory items.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Rice",
      "quantity": 50,
      "unit": "kg",
      "minStock": 10,
      "costPerUnit": 12000,
      "lastRestocked": "2023-06-10T09:30:00Z"
    },
    // More items...
  ]
}
```

### POST /api/inventory
Add a new inventory item.

**Request:**
```json
{
  "name": "Salt",
  "quantity": 10,
  "unit": "kg",
  "minStock": 2,
  "costPerUnit": 8000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 9,
    "name": "Salt",
    "quantity": 10,
    "unit": "kg",
    "minStock": 2,
    "costPerUnit": 8000,
    "lastRestocked": "2023-06-15T16:20:30Z"
  }
}
```

### PUT /api/inventory/{id}
Update inventory item quantity.

**Request:**
```json
{
  "quantity": 15,
  "costPerUnit": 8500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 9,
    "name": "Salt",
    "quantity": 15,
    "unit": "kg",
    "minStock": 2,
    "costPerUnit": 8500,
    "lastRestocked": "2023-06-15T16:45:10Z"
  }
}
```

## Reports

### GET /api/reports/sales
Get sales report.

**Query Parameters:**
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `groupBy` - Group by (day, week, month)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 1250000,
    "totalOrders": 45,
    "averageOrderValue": 27777.78,
    "salesByDate": [
      {
        "date": "2023-06-15",
        "sales": 450000,
        "orders": 15
      },
      {
        "date": "2023-06-16",
        "sales": 380000,
        "orders": 12
      },
      {
        "date": "2023-06-17",
        "sales": 420000,
        "orders": 18
      }
    ],
    "salesByCategory": [
      {
        "category": "Food",
        "sales": 750000,
        "percentage": 60
      },
      {
        "category": "Drinks",
        "sales": 250000,
        "percentage": 20
      },
      {
        "category": "Snacks",
        "sales": 150000,
        "percentage": 12
      },
      {
        "category": "Packages",
        "sales": 100000,
        "percentage": 8
      }
    ],
    "topProducts": [
      {
        "id": 1,
        "name": "Rice Box Chicken",
        "quantity": 75,
        "sales": 1500000
      },
      {
        "id": 3,
        "name": "Iced Tea",
        "quantity": 100,
        "sales": 500000
      },
      {
        "id": 5,
        "name": "French Fries",
        "quantity": 50,
        "sales": 750000
      }
    ]
  }
}
```

### GET /api/reports/inventory
Get inventory report.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalItems": 8,
    "totalValue": 2450000,
    "lowStockItems": [
      {
        "id": 2,
        "name": "Chicken",
        "quantity": 4.5,
        "unit": "kg",
        "minStock": 5,
        "costPerUnit": 35000
      }
    ],
    "inventoryItems": [
      {
        "id": 1,
        "name": "Rice",
        "quantity": 50,
        "unit": "kg",
        "minStock": 10,
        "costPerUnit": 12000,
        "totalValue": 600000
      },
      // More items...
    ]
  }
}
```

## Settings

### GET /api/settings
Get store settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "storeName": "Warung Makan",
    "address": "Jl. Contoh No. 123, Jakarta",
    "phone": "021-1234567",
    "taxRate": 10.00,
    "currency": "IDR",
    "logoUrl": null
  }
}
```

### PUT /api/settings
Update store settings.

**Request:**
```json
{
  "storeName": "Warung Makan Enak",
  "address": "Jl. Contoh No. 123, Jakarta",
  "phone": "021-1234567",
  "taxRate": 10.00,
  "currency": "IDR",
  "logoUrl": "https://example.com/logo.png"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "storeName": "Warung Makan Enak",
    "address": "Jl. Contoh No. 123, Jakarta",
    "phone": "021-1234567",
    "taxRate": 10.00,
    "currency": "IDR",
    "logoUrl": "https://example.com/logo.png"
  }
}
```

## Users

### GET /api/users
Get all users (admin only).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "lastLogin": "2023-06-15T08:30:00Z"
    },
    {
      "id": 2,
      "name": "Cashier 1",
      "email": "cashier1@example.com",
      "role": "cashier",
      "lastLogin": "2023-06-14T17:45:00Z"
    }
  ]
}
```

### POST /api/users
Create a new user (admin only).

**Request:**
```json
{
  "name": "New Cashier",
  "email": "newcashier@example.com",
  "password": "password123",
  "role": "cashier"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "New Cashier",
    "email": "newcashier@example.com",
    "role": "cashier"
  }
}
```

### PUT /api/users/{id}
Update a user (admin only).

**Request:**
```json
{
  "name": "Updated Cashier",
  "email": "updatedcashier@example.com",
  "role": "cashier"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Updated Cashier",
    "email": "updatedcashier@example.com",
    "role": "cashier"
  }
}
```

### DELETE /api/users/{id}
Delete a user (admin only).

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```
