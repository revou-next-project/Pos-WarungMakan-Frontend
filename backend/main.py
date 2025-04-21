from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db, configure_db
import models
from datetime import datetime
import uuid
import os
from sqlalchemy import desc

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app)

# Configure database
configure_db(app)

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return jsonify({"message": "Welcome to Food POS API"})

# Product endpoints
@app.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    
    if category:
        products = db.session.query(models.Product).filter(models.Product.category == category).all()
    else:
        products = db.session.query(models.Product).all()
    
    return jsonify([{
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'category': product.category,
        'unit': product.unit,
        'is_package': product.is_package,
        'image': product.image
    } for product in products])

@app.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = db.session.query(models.Product).filter(models.Product.id == product_id).first()
    
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    return jsonify({
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'category': product.category,
        'unit': product.unit,
        'is_package': product.is_package,
        'image': product.image
    })

@app.route('/products', methods=['POST'])
def create_product():
    data = request.json
    
    product = models.Product(
        name=data['name'],
        price=data['price'],
        category=data['category'],
        unit=data['unit'],
        is_package=data.get('is_package', False),
        image=data.get('image')
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'category': product.category,
        'unit': product.unit,
        'is_package': product.is_package,
        'image': product.image
    }), 201

@app.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = db.session.query(models.Product).filter(models.Product.id == product_id).first()
    
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    data = request.json
    
    if 'name' in data:
        product.name = data['name']
    if 'price' in data:
        product.price = data['price']
    if 'category' in data:
        product.category = data['category']
    if 'unit' in data:
        product.unit = data['unit']
    if 'is_package' in data:
        product.is_package = data['is_package']
    if 'image' in data:
        product.image = data['image']
    
    db.session.commit()
    
    return jsonify({
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'category': product.category,
        'unit': product.unit,
        'is_package': product.is_package,
        'image': product.image
    })

@app.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = db.session.query(models.Product).filter(models.Product.id == product_id).first()
    
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    db.session.delete(product)
    db.session.commit()
    
    return "", 204

# Order endpoints
@app.route('/orders', methods=['GET'])
def get_orders():
    status = request.args.get('status')
    
    if status:
        orders = db.session.query(models.Order).filter(models.Order.status == status).all()
    else:
        orders = db.session.query(models.Order).all()
    
    result = []
    for order in orders:
        order_items = []
        for item in order.items:
            order_items.append({
                'id': item.id,
                'product_id': item.product_id,
                'quantity': item.quantity,
                'price': item.price,
                'note': getattr(item, 'note', None)  # Add note if it exists
            })
        
        result.append({
            'id': order.id,
            'order_number': order.order_number,
            'timestamp': order.timestamp.isoformat(),
            'status': order.status,
            'order_type': order.order_type,
            'total_amount': order.total_amount,
            'items': order_items
        })
    
    return jsonify(result)

@app.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = db.session.query(models.Order).filter(models.Order.id == order_id).first()
    
    if not order:
        return jsonify({"error": "Order not found"}), 404
    
    order_items = []
    for item in order.items:
        order_items.append({
            'id': item.id,
            'product_id': item.product_id,
            'quantity': item.quantity,
            'price': item.price,
            'note': getattr(item, 'note', None)  # Add note if it exists
        })
    
    return jsonify({
        'id': order.id,
        'order_number': order.order_number,
        'timestamp': order.timestamp.isoformat(),
        'status': order.status,
        'order_type': order.order_type,
        'total_amount': order.total_amount,
        'items': order_items
    })

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    
    # Generate order number if not provided
    if not data.get('order_number'):
        data['order_number'] = f"ORD-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8]}"
    
    # Create order
    order = models.Order(
        order_number=data['order_number'],
        timestamp=datetime.now(),
        status=data.get('status', 'waiting'),
        order_type=data['order_type'],
        total_amount=data['total_amount']
    )
    
    db.session.add(order)
    db.session.commit()
    
    # Create order items
    for item_data in data['items']:
        item = models.OrderItem(
            order_id=order.id,
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
            price=item_data['price']
        )
        
        # Add note if it exists
        if 'note' in item_data:
            setattr(item, 'note', item_data['note'])
            
        db.session.add(item)
    
    db.session.commit()
    
    # Refresh to get the items
    db.session.refresh(order)
    
    # Prepare response
    order_items = []
    for item in order.items:
        order_items.append({
            'id': item.id,
            'product_id': item.product_id,
            'quantity': item.quantity,
            'price': item.price,
            'note': getattr(item, 'note', None)  # Add note if it exists
        })
    
    return jsonify({
        'id': order.id,
        'order_number': order.order_number,
        'timestamp': order.timestamp.isoformat(),
        'status': order.status,
        'order_type': order.order_type,
        'total_amount': order.total_amount,
        'items': order_items
    }), 201

@app.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    order = db.session.query(models.Order).filter(models.Order.id == order_id).first()
    
    if not order:
        return jsonify({"error": "Order not found"}), 404
    
    data = request.json
    order.status = data['status']
    
    db.session.commit()
    
    return jsonify({
        'id': order.id,
        'order_number': order.order_number,
        'timestamp': order.timestamp.isoformat(),
        'status': order.status,
        'order_type': order.order_type,
        'total_amount': order.total_amount
    })

# Inventory endpoints
@app.route('/inventory', methods=['GET'])
def get_inventory_items():
    category = request.args.get('category')
    low_stock = request.args.get('low_stock')
    
    query = db.session.query(models.InventoryItem)
    
    if category:
        query = query.filter(models.InventoryItem.category == category)
    
    if low_stock and low_stock.lower() == 'true':
        query = query.filter(models.InventoryItem.current_stock < models.InventoryItem.min_threshold)
    
    inventory_items = query.all()
    
    return jsonify([{
        'id': item.id,
        'name': item.name,
        'current_stock': item.current_stock,
        'unit': item.unit,
        'min_threshold': item.min_threshold,
        'last_updated': item.last_updated.isoformat(),
        'category': item.category
    } for item in inventory_items])

@app.route('/inventory/<int:item_id>', methods=['GET'])
def get_inventory_item(item_id):
    item = db.session.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    
    if not item:
        return jsonify({"error": "Inventory item not found"}), 404
    
    return jsonify({
        'id': item.id,
        'name': item.name,
        'current_stock': item.current_stock,
        'unit': item.unit,
        'min_threshold': item.min_threshold,
        'last_updated': item.last_updated.isoformat(),
        'category': item.category
    })

@app.route('/inventory', methods=['POST'])
def create_inventory_item():
    data = request.json
    
    item = models.InventoryItem(
        name=data['name'],
        current_stock=data['current_stock'],
        unit=data['unit'],
        min_threshold=data['min_threshold'],
        category=data['category']
    )
    
    db.session.add(item)
    db.session.commit()
    
    return jsonify({
        'id': item.id,
        'name': item.name,
        'current_stock': item.current_stock,
        'unit': item.unit,
        'min_threshold': item.min_threshold,
        'last_updated': item.last_updated.isoformat(),
        'category': item.category
    }), 201

@app.route('/inventory/<int:item_id>', methods=['PUT'])
def update_inventory_item(item_id):
    item = db.session.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    
    if not item:
        return jsonify({"error": "Inventory item not found"}), 404
    
    data = request.json
    
    if 'name' in data:
        item.name = data['name']
    if 'current_stock' in data:
        item.current_stock = data['current_stock']
    if 'unit' in data:
        item.unit = data['unit']
    if 'min_threshold' in data:
        item.min_threshold = data['min_threshold']
    if 'category' in data:
        item.category = data['category']
    
    db.session.commit()
    
    return jsonify({
        'id': item.id,
        'name': item.name,
        'current_stock': item.current_stock,
        'unit': item.unit,
        'min_threshold': item.min_threshold,
        'last_updated': item.last_updated.isoformat(),
        'category': item.category
    })

# Expense endpoints
@app.route('/expenses', methods=['GET'])
def get_expenses():
    category = request.args.get('category')
    
    if category:
        expenses = db.session.query(models.Expense).filter(models.Expense.category == category).all()
    else:
        expenses = db.session.query(models.Expense).all()
    
    return jsonify([{
        'id': expense.id,
        'date': expense.date.isoformat(),
        'amount': expense.amount,
        'category': expense.category,
        'description': expense.description
    } for expense in expenses])

@app.route('/expenses/<int:expense_id>', methods=['GET'])
def get_expense(expense_id):
    expense = db.session.query(models.Expense).filter(models.Expense.id == expense_id).first()
    
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    return jsonify({
        'id': expense.id,
        'date': expense.date.isoformat(),
        'amount': expense.amount,
        'category': expense.category,
        'description': expense.description
    })

@app.route('/expenses', methods=['POST'])
def create_expense():
    data = request.json
    
    expense = models.Expense(
        date=datetime.now() if not data.get('date') else datetime.fromisoformat(data['date']),
        amount=data['amount'],
        category=data['category'],
        description=data.get('description')
    )
    
    db.session.add(expense)
    db.session.commit()
    
    return jsonify({
        'id': expense.id,
        'date': expense.date.isoformat(),
        'amount': expense.amount,
        'category': expense.category,
        'description': expense.description
    }), 201

# Employee endpoints
@app.route('/employees', methods=['GET'])
def get_employees():
    role = request.args.get('role')
    
    if role:
        employees = db.session.query(models.Employee).filter(models.Employee.role == role).all()
    else:
        employees = db.session.query(models.Employee).all()
    
    return jsonify([{
        'id': employee.id,
        'name': employee.name,
        'role': employee.role,
        'hourly_rate': employee.hourly_rate,
        'monthly_salary': employee.monthly_salary
    } for employee in employees])

@app.route('/employees/<int:employee_id>', methods=['GET'])
def get_employee(employee_id):
    employee = db.session.query(models.Employee).filter(models.Employee.id == employee_id).first()
    
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    
    return jsonify({
        'id': employee.id,
        'name': employee.name,
        'role': employee.role,
        'hourly_rate': employee.hourly_rate,
        'monthly_salary': employee.monthly_salary
    })

@app.route('/employees', methods=['POST'])
def create_employee():
    data = request.json
    
    employee = models.Employee(
        name=data['name'],
        role=data['role'],
        hourly_rate=data.get('hourly_rate'),
        monthly_salary=data.get('monthly_salary')
    )
    
    db.session.add(employee)
    db.session.commit()
    
    return jsonify({
        'id': employee.id,
        'name': employee.name,
        'role': employee.role,
        'hourly_rate': employee.hourly_rate,
        'monthly_salary': employee.monthly_salary
    }), 201

# User authentication endpoints
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # This is a placeholder. In a real application, you would verify the password
    # against a hashed version stored in the database
    user = db.session.query(models.User).filter(models.User.username == username).first()
    
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    
    # For demo purposes only - in production, use proper password verification
    # In a real app, you would use: check_password_hash(user.hashed_password, password)
    # For now, we'll just return success
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role
    })

# Recipe endpoints
@app.route('/recipes', methods=['GET'])
def get_recipes():
    product_id = request.args.get('product_id')
    
    if product_id:
        recipe_components = db.session.query(models.RecipeComponent).filter(models.RecipeComponent.product_id == product_id).all()
    else:
        recipe_components = db.session.query(models.RecipeComponent).all()
    
    result = []
    for component in recipe_components:
        result.append({
            'id': component.id,
            'product_id': component.product_id,
            'inventory_item_id': component.inventory_item_id,
            'quantity': component.quantity,
            'product_name': component.product.name if component.product else None,
            'inventory_item_name': component.inventory_item.name if component.inventory_item else None,
            'inventory_item_unit': component.inventory_item.unit if component.inventory_item else None
        })
    
    return jsonify(result)

@app.route('/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = db.session.query(models.RecipeComponent).filter(models.RecipeComponent.id == recipe_id).first()
    
    if not recipe:
        return jsonify({"error": "Recipe component not found"}), 404
    
    return jsonify({
        'id': recipe.id,
        'product_id': recipe.product_id,
        'inventory_item_id': recipe.inventory_item_id,
        'quantity': recipe.quantity,
        'product_name': recipe.product.name if recipe.product else None,
        'inventory_item_name': recipe.inventory_item.name if recipe.inventory_item else None,
        'inventory_item_unit': recipe.inventory_item.unit if recipe.inventory_item else None
    })

@app.route('/recipes', methods=['POST'])
def create_recipe():
    data = request.json
    
    recipe = models.RecipeComponent(
        product_id=data['product_id'],
        inventory_item_id=data['inventory_item_id'],
        quantity=data['quantity']
    )
    
    db.session.add(recipe)
    db.session.commit()
    
    return jsonify({
        'id': recipe.id,
        'product_id': recipe.product_id,
        'inventory_item_id': recipe.inventory_item_id,
        'quantity': recipe.quantity
    }), 201

@app.route('/recipes/<int:recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    recipe = db.session.query(models.RecipeComponent).filter(models.RecipeComponent.id == recipe_id).first()
    
    if not recipe:
        return jsonify({"error": "Recipe component not found"}), 404
    
    data = request.json
    
    if 'product_id' in data:
        recipe.product_id = data['product_id']
    if 'inventory_item_id' in data:
        recipe.inventory_item_id = data['inventory_item_id']
    if 'quantity' in data:
        recipe.quantity = data['quantity']
    
    db.session.commit()
    
    return jsonify({
        'id': recipe.id,
        'product_id': recipe.product_id,
        'inventory_item_id': recipe.inventory_item_id,
        'quantity': recipe.quantity
    })

@app.route('/recipes/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    recipe = db.session.query(models.RecipeComponent).filter(models.RecipeComponent.id == recipe_id).first()
    
    if not recipe:
        return jsonify({"error": "Recipe component not found"}), 404
    
    db.session.delete(recipe)
    db.session.commit()
    
    return "", 204

@app.route('/recipes/product/<int:product_id>', methods=['GET'])
def get_product_recipe(product_id):
    recipe_components = db.session.query(models.RecipeComponent).filter(models.RecipeComponent.product_id == product_id).all()
    
    if not recipe_components:
        return jsonify([]), 200
    
    result = []
    for component in recipe_components:
        result.append({
            'id': component.id,
            'product_id': component.product_id,
            'inventory_item_id': component.inventory_item_id,
            'quantity': component.quantity,
            'inventory_item_name': component.inventory_item.name if component.inventory_item else None,
            'inventory_item_unit': component.inventory_item.unit if component.inventory_item else None
        })
    
    return jsonify(result)

# Cash balance endpoints
@app.route('/cash-balance', methods=['GET'])
def get_cash_balance():
    transaction_type = request.args.get('transaction_type')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = db.session.query(models.CashBalance)
    
    if transaction_type:
        query = query.filter(models.CashBalance.transaction_type == transaction_type)
    
    if start_date:
        start_datetime = datetime.fromisoformat(start_date)
        query = query.filter(models.CashBalance.transaction_date >= start_datetime)
    
    if end_date:
        end_datetime = datetime.fromisoformat(end_date)
        query = query.filter(models.CashBalance.transaction_date <= end_datetime)
    
    cash_entries = query.order_by(desc(models.CashBalance.transaction_date)).all()
    
    result = []
    for entry in cash_entries:
        result.append({
            'id': entry.id,
            'transaction_date': entry.transaction_date.isoformat(),
            'transaction_type': entry.transaction_type.value,
            'amount': entry.amount,
            'reference_id': entry.reference_id,
            'notes': entry.notes,
            'recorded_by': entry.recorded_by
        })
    
    return jsonify(result)

@app.route('/cash-balance/<int:entry_id>', methods=['GET'])
def get_cash_balance_entry(entry_id):
    entry = db.session.query(models.CashBalance).filter(models.CashBalance.id == entry_id).first()
    
    if not entry:
        return jsonify({"error": "Cash balance entry not found"}), 404
    
    return jsonify({
        'id': entry.id,
        'transaction_date': entry.transaction_date.isoformat(),
        'transaction_type': entry.transaction_type.value,
        'amount': entry.amount,
        'reference_id': entry.reference_id,
        'notes': entry.notes,
        'recorded_by': entry.recorded_by
    })

@app.route('/cash-balance', methods=['POST'])
def create_cash_balance_entry():
    data = request.json
    
    transaction_type = getattr(models.TransactionType, data['transaction_type'].upper())
    
    entry = models.CashBalance(
        transaction_date=datetime.now() if not data.get('transaction_date') else datetime.fromisoformat(data['transaction_date']),
        transaction_type=transaction_type,
        amount=data['amount'],
        reference_id=data.get('reference_id'),
        notes=data.get('notes'),
        recorded_by=data['recorded_by']
    )
    
    db.session.add(entry)
    db.session.commit()
    
    return jsonify({
        'id': entry.id,
        'transaction_date': entry.transaction_date.isoformat(),
        'transaction_type': entry.transaction_type.value,
        'amount': entry.amount,
        'reference_id': entry.reference_id,
        'notes': entry.notes,
        'recorded_by': entry.recorded_by
    }), 201

@app.route('/cash-balance/<int:entry_id>', methods=['PUT'])
def update_cash_balance_entry(entry_id):
    entry = db.session.query(models.CashBalance).filter(models.CashBalance.id == entry_id).first()
    
    if not entry:
        return jsonify({"error": "Cash balance entry not found"}), 404
    
    data = request.json
    
    if 'transaction_type' in data:
        entry.transaction_type = getattr(models.TransactionType, data['transaction_type'].upper())
    if 'amount' in data:
        entry.amount = data['amount']
    if 'reference_id' in data:
        entry.reference_id = data['reference_id']
    if 'notes' in data:
        entry.notes = data['notes']
    
    db.session.commit()
    
    return jsonify({
        'id': entry.id,
        'transaction_date': entry.transaction_date.isoformat(),
        'transaction_type': entry.transaction_type.value,
        'amount': entry.amount,
        'reference_id': entry.reference_id,
        'notes': entry.notes,
        'recorded_by': entry.recorded_by
    })

@app.route('/cash-balance/<int:entry_id>', methods=['DELETE'])
def delete_cash_balance_entry(entry_id):
    entry = db.session.query(models.CashBalance).filter(models.CashBalance.id == entry_id).first()
    
    if not entry:
        return jsonify({"error": "Cash balance entry not found"}), 404
    
    db.session.delete(entry)
    db.session.commit()
    
    return "", 204

@app.route('/cash-balance/summary', methods=['GET'])
def get_cash_balance_summary():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = db.session.query(models.CashBalance)
    
    if start_date:
        start_datetime = datetime.fromisoformat(start_date)
        query = query.filter(models.CashBalance.transaction_date >= start_datetime)
    
    if end_date:
        end_datetime = datetime.fromisoformat(end_date)
        query = query.filter(models.CashBalance.transaction_date <= end_datetime)
    
    cash_entries = query.all()
    
    total_balance = 0
    summary_by_type = {}
    
    for entry in cash_entries:
        transaction_type = entry.transaction_type.value
        amount = entry.amount
        
        # Update total balance
        if transaction_type in ['opening', 'sale', 'adjustment']:
            total_balance += amount
        elif transaction_type in ['closing', 'expense']:
            total_balance -= amount
        
        # Update summary by type
        if transaction_type not in summary_by_type:
            summary_by_type[transaction_type] = 0
        
        summary_by_type[transaction_type] += amount
    
    return jsonify({
        'total_balance': total_balance,
        'summary_by_type': summary_by_type
    })

# Run the application
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
