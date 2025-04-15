# API Documentation

This document provides details on the available API endpoints for the Beans Coffee Shop website.

## Base URL

```
http://localhost:5000/api
```

In production, this will be replaced with your domain.

## Authentication

### Register a new user

```
POST /auth/register
```

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "1234567890" // Optional
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2023-05-01T12:00:00Z"
  },
  "token": "jwt_token"
}
```

### Login

```
POST /auth/login
```

Request body:
```json
{
  "email": "john@example.com", // Can also use username or phone
  "password": "securepassword123"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2023-05-01T12:00:00Z"
  },
  "token": "jwt_token"
}
```

### Get current user

```
GET /auth/me
```

Headers:
```
Authorization: Bearer jwt_token
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2023-05-01T12:00:00Z"
  }
}
```

## Products

### Get all products

```
GET /products
```

Query parameters:
- `category` (optional): Filter by category
- `sort` (optional): Sort products by price, name, or date
- `page` (optional): Page number for pagination
- `limit` (optional): Number of products per page

Response:
```json
{
  "success": true,
  "count": 20,
  "pagination": {
    "current": 1,
    "total": 2,
    "limit": 10
  },
  "data": [
    {
      "id": "product_id",
      "name": "Ethiopian Yirgacheffe",
      "description": "Light roast with fruity notes",
      "price": 14.99,
      "category": "coffee_beans",
      "imageUrl": "/images/products/ethiopian.jpg",
      "inStock": true,
      "featured": true,
      "attributes": {
        "origin": "Ethiopia",
        "roastLevel": "Light",
        "flavor": ["Fruity", "Floral", "Citrus"]
      },
      "createdAt": "2023-05-01T12:00:00Z"
    },
    // More products...
  ]
}
```

### Get a single product

```
GET /products/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "product_id",
    "name": "Ethiopian Yirgacheffe",
    "description": "Light roast with fruity notes",
    "price": 14.99,
    "category": "coffee_beans",
    "imageUrl": "/images/products/ethiopian.jpg",
    "inStock": true,
    "featured": true,
    "attributes": {
      "origin": "Ethiopia",
      "roastLevel": "Light",
      "flavor": ["Fruity", "Floral", "Citrus"]
    },
    "createdAt": "2023-05-01T12:00:00Z",
    "reviews": [
      {
        "id": "review_id",
        "user": {
          "id": "user_id",
          "name": "John Doe"
        },
        "rating": 5,
        "text": "Amazing flavor profile!",
        "createdAt": "2023-05-05T14:00:00Z"
      }
    ]
  }
}
```

### Create a product (Admin only)

```
POST /products
```

Headers:
```
Authorization: Bearer jwt_token
```

Request body:
```json
{
  "name": "Colombian Supremo",
  "description": "Medium roast with chocolate notes",
  "price": 13.99,
  "category": "coffee_beans",
  "imageUrl": "/images/products/colombian.jpg",
  "inStock": true,
  "featured": false,
  "attributes": {
    "origin": "Colombia",
    "roastLevel": "Medium",
    "flavor": ["Chocolate", "Nutty", "Caramel"]
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "new_product_id",
    "name": "Colombian Supremo",
    // Other product fields
  }
}
```

### Update a product (Admin only)

```
PUT /products/:id
```

Headers:
```
Authorization: Bearer jwt_token
```

Request body:
```json
{
  "price": 15.99,
  "inStock": false
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "product_id",
    "name": "Colombian Supremo",
    "price": 15.99,
    "inStock": false,
    // Other product fields
  }
}
```

### Delete a product (Admin only)

```
DELETE /products/:id
```

Headers:
```
Authorization: Bearer jwt_token
```

Response:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Shopping Cart

### Get user's cart

```
GET /cart
```

Headers:
```
Authorization: Bearer jwt_token
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "product": {
          "id": "product_id",
          "name": "Ethiopian Yirgacheffe",
          "price": 14.99,
          "imageUrl": "/images/products/ethiopian.jpg"
        },
        "quantity": 2,
        "price": 29.98
      }
    ],
    "totalItems": 2,
    "subtotal": 29.98
  }
}
```

### Add item to cart

```
POST /cart/items
```

Headers:
```
Authorization: Bearer jwt_token
```

Request body:
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "cart_id",
    "user": "user_id",
    "items": [
      // Cart items
    ],
    "totalItems": 3,
    "subtotal": 44.97
  }
}
```

### Update cart item

```
PUT /cart/items/:productId
```

Headers:
```
Authorization: Bearer jwt_token
```

Request body:
```json
{
  "quantity": 3
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "cart_id",
    "user": "user_id",
    "items": [
      // Updated cart items
    ],
    "totalItems": 4,
    "subtotal": 59.96
  }
}
```

### Remove item from cart

```
DELETE /cart/items/:productId
```

Headers:
```
Authorization: Bearer jwt_token
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "cart_id",
    "user": "user_id",
    "items": [
      // Remaining cart items
    ],
    "totalItems": 1,
    "subtotal": 14.99
  }
}
```

## Orders

### Create an order

```
POST /orders
```

Headers:
```
Authorization: Bearer jwt_token
```

Request body:
```json
{
  "shippingAddress": {
    "street": "123 Coffee St",
    "city": "Seattle",
    "state": "WA",
    "zipCode": "98101",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "paymentDetails": {
    // Payment details
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "user": {
      "id": "user_id",
      "name": "John Doe"
    },
    "items": [
      {
        "product": {
          "id": "product_id",
          "name": "Ethiopian Yirgacheffe",
          "price": 14.99
        },
        "quantity": 2,
        "price": 29.98
      }
    ],
    "shippingAddress": {
      "street": "123 Coffee St",
      "city": "Seattle",
      "state": "WA",
      "zipCode": "98101",
      "country": "USA"
    },
    "paymentMethod": "credit_card",
    "subtotal": 29.98,
    "tax": 2.99,
    "shipping": 5.00,
    "total": 37.97,
    "status": "processing",
    "createdAt": "2023-05-10T15:30:00Z"
  }
}
```

### Get user's orders

```
GET /orders
```

Headers:
```
Authorization: Bearer jwt_token
```

Query parameters:
- `status` (optional): Filter by order status
- `page` (optional): Page number for pagination
- `limit` (optional): Number of orders per page

Response:
```json
{
  "success": true,
  "count": 5,
  "pagination": {
    "current": 1,
    "total": 1,
    "limit": 10
  },
  "data": [
    {
      "id": "order_id",
      "items": [
        // Order items
      ],
      "subtotal": 29.98,
      "total": 37.97,
      "status": "delivered",
      "createdAt": "2023-05-10T15:30:00Z"
    },
    // More orders...
  ]
}
```

### Get a single order

```
GET /orders/:id
```

Headers:
```
Authorization: Bearer jwt_token
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "user": {
      "id": "user_id",
      "name": "John Doe"
    },
    "items": [
      // Order items
    ],
    "shippingAddress": {
      // Shipping address
    },
    "paymentMethod": "credit_card",
    "subtotal": 29.98,
    "tax": 2.99,
    "shipping": 5.00,
    "total": 37.97,
    "status": "delivered",
    "createdAt": "2023-05-10T15:30:00Z",
    "updatedAt": "2023-05-12T10:00:00Z",
    "timeline": [
      {
        "status": "processing",
        "date": "2023-05-10T15:30:00Z"
      },
      {
        "status": "shipped",
        "date": "2023-05-11T09:15:00Z"
      },
      {
        "status": "delivered",
        "date": "2023-05-12T10:00:00Z"
      }
    ]
  }
}
```

### Update order status (Admin only)

```
PUT /orders/:id/status
```

Headers:
```
Authorization: Bearer jwt_token
```

Request body:
```json
{
  "status": "shipped"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "status": "shipped",
    "timeline": [
      {
        "status": "processing",
        "date": "2023-05-10T15:30:00Z"
      },
      {
        "status": "shipped",
        "date": "2023-05-11T09:15:00Z"
      }
    ],
    // Other order fields
  }
}
```

## Error Responses

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message describing the issue",
    "details": {} // Optional additional error details
  }
}
```

Common HTTP status codes:
- `400`: Bad Request (invalid input data)
- `401`: Unauthorized (missing or invalid authentication)
- `403`: Forbidden (not allowed to access the resource)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error (server issue)

## Rate Limiting

API requests are limited to 100 requests per IP address per 15-minute window. When the limit is exceeded, you'll receive a 429 status code with the following response:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    "details": {
      "retryAfter": 300 // Seconds until you can try again
    }
  }
}
``` 