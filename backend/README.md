# Food POS Backend API

This is the backend API for the Food POS (Point of Sale) system, built with FastAPI and MySQL.

## Setup Instructions

### Prerequisites
- Python 3.8+
- MySQL Server

### Installation

1. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Configure the database:
   - Create a MySQL database named `food_pos`
   - Copy `.env.example` to `.env` and update the database credentials

4. Run the application:
   ```
   python main.py
   ```

5. Access the API documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/{product_id}` - Get a specific product
- `POST /products` - Create a new product
- `PUT /products/{product_id}` - Update a product
- `DELETE /products/{product_id}` - Delete a product

### Orders
- `GET /orders` - Get all orders
- `GET /orders/{order_id}` - Get a specific order
- `POST /orders` - Create a new order
- `PUT /orders/{order_id}/status` - Update order status

### Inventory
- `GET /inventory` - Get all inventory items
- `GET /inventory/{item_id}` - Get a specific inventory item
- `POST /inventory` - Create a new inventory item
- `PUT /inventory/{item_id}` - Update an inventory item

## Database Schema

The database includes the following tables:
- products
- orders
- order_items
- inventory_items
- expenses
- employees
- payroll_entries
- users

## Integration with Frontend

To connect the frontend to this API:

1. Update the API base URL in your frontend code to point to this backend
2. Use the appropriate endpoints for each feature
3. Handle authentication and authorization as needed
