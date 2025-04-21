from pydantic import BaseModel, Field
from typing import List, Optional, Union, Literal
from datetime import datetime
from enum import Enum

# Product schemas
class ProductBase(BaseModel):
    name: str
    price: float
    category: str
    unit: str
    is_package: bool = False
    image: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    is_package: Optional[bool] = None
    image: Optional[str] = None

class Product(ProductBase):
    id: int
    
    class Config:
        orm_mode = True

# Order item schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    
    class Config:
        orm_mode = True

# Order schemas
class OrderBase(BaseModel):
    order_number: str
    timestamp: datetime
    status: str  # waiting, cooking, completed, canceled
    order_type: str  # Dine In, GoFood, Grab, Shopee, Other
    total_amount: float

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: str

class Order(OrderBase):
    id: int
    items: List[OrderItem] = []
    
    class Config:
        orm_mode = True

# Inventory item schemas
class InventoryItemBase(BaseModel):
    name: str
    current_stock: float
    unit: str
    min_threshold: float
    category: str
    cost_per_unit: Optional[float] = None

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    current_stock: Optional[float] = None
    unit: Optional[str] = None
    min_threshold: Optional[float] = None
    category: Optional[str] = None
    cost_per_unit: Optional[float] = None

class InventoryItem(InventoryItemBase):
    id: int
    last_updated: datetime
    
    class Config:
        orm_mode = True

# Expense schemas
class ExpenseBase(BaseModel):
    date: datetime
    amount: float
    category: str
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    date: Optional[datetime] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None

class Expense(ExpenseBase):
    id: int
    
    class Config:
        orm_mode = True

# Employee schemas
class EmployeeBase(BaseModel):
    name: str
    role: str
    hourly_rate: Optional[float] = None
    monthly_salary: Optional[float] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    hourly_rate: Optional[float] = None
    monthly_salary: Optional[float] = None

class Employee(EmployeeBase):
    id: int
    
    class Config:
        orm_mode = True

# Payroll entry schemas
class PayrollEntryBase(BaseModel):
    employee_id: int
    period_start: datetime
    period_end: datetime
    hours_worked: Optional[float] = None
    amount_paid: float
    payment_date: Optional[datetime] = None
    status: str  # pending, paid

class PayrollEntryCreate(PayrollEntryBase):
    pass

class PayrollEntryUpdate(BaseModel):
    hours_worked: Optional[float] = None
    amount_paid: Optional[float] = None
    payment_date: Optional[datetime] = None
    status: Optional[str] = None

class PayrollEntry(PayrollEntryBase):
    id: int
    
    class Config:
        orm_mode = True

# User schemas
class UserBase(BaseModel):
    username: str
    email: str
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        orm_mode = True

# Recipe component schemas
class RecipeComponentBase(BaseModel):
    product_id: int
    inventory_item_id: int
    quantity: float

class RecipeComponentCreate(RecipeComponentBase):
    pass

class RecipeComponentUpdate(BaseModel):
    product_id: Optional[int] = None
    inventory_item_id: Optional[int] = None
    quantity: Optional[float] = None

class RecipeComponent(RecipeComponentBase):
    id: int
    
    class Config:
        orm_mode = True

# Cash balance schemas
class TransactionType(str, Enum):
    OPENING = "opening"
    CLOSING = "closing"
    SALE = "sale"
    EXPENSE = "expense"
    ADJUSTMENT = "adjustment"

class CashBalanceBase(BaseModel):
    transaction_type: TransactionType
    amount: float
    reference_id: Optional[int] = None
    notes: Optional[str] = None
    recorded_by: int

class CashBalanceCreate(CashBalanceBase):
    transaction_date: Optional[datetime] = None

class CashBalanceUpdate(BaseModel):
    transaction_type: Optional[TransactionType] = None
    amount: Optional[float] = None
    reference_id: Optional[int] = None
    notes: Optional[str] = None

class CashBalance(CashBalanceBase):
    id: int
    transaction_date: datetime
    
    class Config:
        orm_mode = True
