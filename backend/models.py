from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import datetime
from database import db
import enum

class Product(db.Model):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    unit = Column(String(20), nullable=False)
    is_package = Column(Boolean, default=False)
    image = Column(String(255), nullable=True)
    
    # Relationship with OrderItem
    order_items = relationship("OrderItem", back_populates="product")
    
    # Relationship with RecipeComponent
    recipe_components = relationship("RecipeComponent", back_populates="product", cascade="all, delete-orphan")

class Order(db.Model):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), nullable=False, unique=True)
    timestamp = Column(DateTime, default=func.now())
    status = Column(String(20), nullable=False)  # waiting, cooking, completed, canceled
    order_type = Column(String(20), nullable=False)  # Dine In, GoFood, Grab, Shopee, Other
    total_amount = Column(Float, nullable=False)
    
    # Relationship with OrderItem
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(db.Model):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # Price at the time of order
    note = Column(Text, nullable=True)  # Added note field for order items
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

class InventoryItem(db.Model):
    __tablename__ = "inventory_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    current_stock = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    min_threshold = Column(Float, nullable=False)
    last_updated = Column(DateTime, default=func.now(), onupdate=func.now())
    category = Column(String(50), nullable=False)
    cost_per_unit = Column(Float, nullable=True)
    
    # Relationship with RecipeComponent
    recipe_components = relationship("RecipeComponent", back_populates="inventory_item")

class Expense(db.Model):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=func.now())
    amount = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    
class Employee(db.Model):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False)
    hourly_rate = Column(Float, nullable=True)
    monthly_salary = Column(Float, nullable=True)
    
    # Relationship with PayrollEntry
    payroll_entries = relationship("PayrollEntry", back_populates="employee")

class PayrollEntry(db.Model):
    __tablename__ = "payroll_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    hours_worked = Column(Float, nullable=True)
    amount_paid = Column(Float, nullable=False)
    payment_date = Column(DateTime, nullable=True)
    status = Column(String(20), nullable=False)  # pending, paid
    
    # Relationship with Employee
    employee = relationship("Employee", back_populates="payroll_entries")

class TransactionType(enum.Enum):
    OPENING = "opening"
    CLOSING = "closing"
    SALE = "sale"
    EXPENSE = "expense"
    ADJUSTMENT = "adjustment"

class CashBalance(db.Model):
    __tablename__ = "cash_balance"
    
    id = Column(Integer, primary_key=True, index=True)
    transaction_date = Column(DateTime, default=func.now())
    transaction_type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Float, nullable=False)
    reference_id = Column(Integer, nullable=True)  # Can reference order_id or expense_id
    notes = Column(Text, nullable=True)
    recorded_by = Column(Integer, ForeignKey("users.id"))
    
    # Relationship with User
    user = relationship("User", back_populates="cash_transactions")

class RecipeComponent(db.Model):
    __tablename__ = "recipe_components"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    inventory_item_id = Column(Integer, ForeignKey("inventory_items.id"))
    quantity = Column(Float, nullable=False)  # Amount of inventory item needed for one product
    
    # Relationships
    product = relationship("Product", back_populates="recipe_components")
    inventory_item = relationship("InventoryItem", back_populates="recipe_components")

class User(db.Model):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # admin, cashier
    is_active = Column(Boolean, default=True)
    
    # Relationship with CashBalance
    cash_transactions = relationship("CashBalance", back_populates="user")
