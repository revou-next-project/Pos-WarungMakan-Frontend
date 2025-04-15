import os
import sys
import pymysql
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection settings
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_NAME = os.getenv("DB_NAME", "food_pos")

def create_database():
    try:
        # Connect to MySQL server
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD
        )
        
        cursor = conn.cursor()
        
        # Create database if it doesn't exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print(f"Database '{DB_NAME}' created or already exists.")
        
        # Close connection
        cursor.close()
        conn.close()
        
        return True
    except Exception as e:
        print(f"Error creating database: {e}")
        return False

def seed_sample_data():
    try:
        # Import models after database is created
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from models import Base, engine, Product, InventoryItem
        from sqlalchemy.orm import sessionmaker
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("Tables created.")
        
        # Create session
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Check if products table is empty
        product_count = db.query(Product).count()
        if product_count == 0:
            # Sample products
            sample_products = [
                Product(
                    name="Rice Box Chicken",
                    price=20000,
                    category="Food",
                    unit="box",
                    is_package=False,
                    image="https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&q=80"
                ),
                Product(
                    name="Fishball Satay",
                    price=10000,
                    category="Food",
                    unit="stick",
                    is_package=False,
                    image="https://images.unsplash.com/photo-1529042410759-befb1204b468?w=300&q=80"
                ),
                Product(
                    name="Iced Tea",
                    price=5000,
                    category="Drinks",
                    unit="cup",
                    is_package=False,
                    image="https://images.unsplash.com/photo-1556679343-c1c1c9308e4e?w=300&q=80"
                ),
                Product(
                    name="Mineral Water",
                    price=3000,
                    category="Drinks",
                    unit="bottle",
                    is_package=False,
                    image="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&q=80"
                ),
                Product(
                    name="French Fries",
                    price=15000,
                    category="Snacks",
                    unit="portion",
                    is_package=False,
                    image="https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300&q=80"
                ),
                Product(
                    name="Package A",
                    price=25000,
                    category="Packages",
                    unit="package",
                    is_package=True,
                    image="https://images.unsplash.com/photo-1607877742574-a7d9a7449af3?w=300&q=80"
                ),
            ]
            
            db.add_all(sample_products)
            db.commit()
            print(f"Added {len(sample_products)} sample products.")
        
        # Check if inventory table is empty
        inventory_count = db.query(InventoryItem).count()
        if inventory_count == 0:
            # Sample inventory items
            sample_inventory = [
                InventoryItem(
                    name="Ayam Fillet",
                    current_stock=5.5,
                    unit="kg",
                    min_threshold=2,
                    category="Protein"
                ),
                InventoryItem(
                    name="Beras",
                    current_stock=25,
                    unit="kg",
                    min_threshold=10,
                    category="Carbs"
                ),
                InventoryItem(
                    name="Minyak Goreng",
                    current_stock=8,
                    unit="liter",
                    min_threshold=5,
                    category="Oil"
                ),
                InventoryItem(
                    name="Fish Ball",
                    current_stock=1.5,
                    unit="pack",
                    min_threshold=3,
                    category="Frozen"
                ),
                InventoryItem(
                    name="Gula",
                    current_stock=4,
                    unit="kg",
                    min_threshold=2,
                    category="Seasoning"
                ),
            ]
            
            db.add_all(sample_inventory)
            db.commit()
            print(f"Added {len(sample_inventory)} sample inventory items.")
        
        db.close()
        return True
    except Exception as e:
        print(f"Error seeding data: {e}")
        return False

if __name__ == "__main__":
    if create_database():
        seed_sample_data()
