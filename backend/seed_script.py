import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# This script creates a bunch of realistic Amazon fresh items
from orders.models import Category, Product

Category.objects.all().delete()
Product.objects.all().delete()

categories = [
    "Fruits & Vegetables", 
    "Atta, Rice & Dals", 
    "Oil & Ghee", 
    "Dairy & Bakery", 
    "Snacks & Biscuits", 
    "Beverages", 
    "Cleaning & Household"
]

cat_objs = {}
for c in categories:
    cat = Category.objects.create(name=c)
    cat_objs[c] = cat

products = [
    # Fruits & Veggies
    {"name": "Fresh Onion (Pyaz)", "price": 40.00, "cat": "Fruits & Vegetables", "desc": "1 kg - Freshly sourced red onions", "img": "https://images.unsplash.com/photo-1618512496248-a07ce83aa8cb?w=400&q=80"},
    {"name": "Fresh Tomato", "price": 65.00, "cat": "Fruits & Vegetables", "desc": "1 kg - Farm fresh red tomatoes", "img": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80"},
    {"name": "Potato (Aloo)", "price": 30.00, "cat": "Fruits & Vegetables", "desc": "1 kg - Regular potatoes", "img": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80"},
    {"name": "Green Chilli", "price": 15.00, "cat": "Fruits & Vegetables", "desc": "200 g - Spicy green chillies", "img": "https://images.unsplash.com/photo-1528643560114-61dd47bbbaea?w=400&q=80"},
    
    # Atta, Rice & Dals
    {"name": "Aashirvaad Select Premium Sharbati Atta", "price": 550.00, "cat": "Atta, Rice & Dals", "desc": "5 kg - Premium whole wheat flour", "img": "https://www.jiomart.com/images/product/original/491349660/aashirvaad-select-premium-sharbati-whole-wheat-atta-5-kg-product-images-o491349660-p491349660-0-202203150532.jpg"},
    {"name": "India Gate Basmati Rice", "price": 900.00, "cat": "Atta, Rice & Dals", "desc": "5 kg - Classic, long grain basmati rice", "img": "https://www.jiomart.com/images/product/original/490000085/india-gate-super-basmati-rice-5-kg-product-images-o490000085-p490000085-0-202203151048.jpg"},
    {"name": "Tata Sampann Toor Dal", "price": 170.00, "cat": "Atta, Rice & Dals", "desc": "1 kg - Unpolished arhar dal", "img": "https://www.jiomart.com/images/product/original/491176228/tata-sampann-unpolished-toor-dal-1-kg-product-images-o491176228-p491176228-0-202203151322.jpg"},
    
    # Oil & Ghee
    {"name": "Fortune Sunlite Refined Sunflower Oil", "price": 160.00, "cat": "Oil & Ghee", "desc": "1 L Pitcher - Light and healthy", "img": "https://www.jiomart.com/images/product/original/490000049/fortune-sunlite-refined-sunflower-oil-1-l-pouch-product-images-o490000049-p490000049-0-202203150036.jpg"},
    {"name": "Amul Pure Ghee", "price": 620.00, "cat": "Oil & Ghee", "desc": "1 L Pack - Authentic cow ghee", "img": "https://www.jiomart.com/images/product/original/490001307/amul-pure-ghee-1-l-pouch-product-images-o490001307-p490001307-0-202203150117.jpg"},
    
    # Dairy & Bakery
    {"name": "Amul Taaza Homogenised Toned Milk", "price": 68.00, "cat": "Dairy & Bakery", "desc": "1 L Tetra Pak", "img": "https://www.jiomart.com/images/product/original/490004128/amul-taaza-homogenised-toned-milk-1-l-tetra-pak-product-images-o490004128-p490004128-0-202203170535.jpg"},
    {"name": "Amul Butter - Pasteurized", "price": 50.00, "cat": "Dairy & Bakery", "desc": "100 g - Classic salted butter", "img": "https://www.jiomart.com/images/product/original/490001392/amul-pasteurised-butter-100-g-carton-product-images-o490001392-p490001392-0-202203150153.jpg"},
    {"name": "Britannia 100% Whole Wheat Bread", "price": 45.00, "cat": "Dairy & Bakery", "desc": "400 g Pack", "img": "https://www.jiomart.com/images/product/original/491560029/britannia-100-whole-wheat-bread-400-g-product-images-o491560029-p491560029-0-202305261541.jpg"},
    {"name": "Amul Cheese Slices", "price": 130.00, "cat": "Dairy & Bakery", "desc": "200 g Pack (10 Slices)", "img": "https://www.jiomart.com/images/product/original/490001402/amul-cheese-slices-200-g-carton-product-images-o490001402-p490001402-0-202203150242.jpg"},

    # Snacks & Biscuits
    {"name": "Lay's India's Magic Masala", "price": 20.00, "cat": "Snacks & Biscuits", "desc": "50 g - Potato chips", "img": "https://www.jiomart.com/images/product/original/491696081/lay-s-india-s-magic-masala-potato-chips-50-g-product-images-o491696081-p491696081-0-202302191500.jpg"},
    {"name": "Parle-G Gold Biscuits", "price": 25.00, "cat": "Snacks & Biscuits", "desc": "1 kg - Glucose biscuits", "img": "https://www.jiomart.com/images/product/original/491187285/parle-g-gold-biscuits-1-kg-product-images-o491187285-p491187285-0-202212081512.jpg"},
    {"name": "Haldiram's Bhujia Sev",  "price": 95.00, "cat": "Snacks & Biscuits", "desc": "400 g - Crispy indian snack", "img": "https://www.jiomart.com/images/product/original/490000782/haldiram-s-bhujia-sev-400-g-product-images-o490000782-p490000782-0-202203150537.jpg"},

    # Beverages
    {"name": "Coca-Cola Original Taste", "price": 40.00, "cat": "Beverages", "desc": "750 ml - Soft drink", "img": "https://www.jiomart.com/images/product/original/490001554/coca-cola-750-ml-product-images-o490001554-p490001554-0-202203150530.jpg"},
    {"name": "Taj Mahal Tea", "price": 320.00, "cat": "Beverages", "desc": "500 g - Rich tasting tea", "img": "https://www.jiomart.com/images/product/original/490001469/taj-mahal-tea-500-g-carton-product-images-o490001469-p490001469-0-202203150543.jpg"},
    {"name": "Nescafe Classic Coffee", "price": 270.00, "cat": "Beverages", "desc": "100 g - Instant coffee", "img": "https://www.jiomart.com/images/product/original/490001992/nescafe-classic-instant-coffee-100-g-jar-product-images-o490001992-p490001992-0-202203150502.jpg"},

    # Cleaning & Household
    {"name": "Surf Excel Matic Front Load Detergent",  "price": 490.00, "cat": "Cleaning & Household", "desc": "2 kg - Liquid wash", "img": "https://www.jiomart.com/images/product/original/490002235/surf-excel-matic-front-load-liquid-detergent-2-l-product-images-o490002235-p490002235-0-202306061453.jpg"},
    {"name": "Vim Dishwash Liquid Gel",  "price": 175.00, "cat": "Cleaning & Household", "desc": "750 ml - Lemon scent", "img": "https://www.jiomart.com/images/product/original/491336496/vim-lemon-dishwash-liquid-gel-750-ml-product-images-o491336496-p491336496-0-202306221102.jpg"},
    {"name": "Lizol Disinfectant Floor Cleaner",  "price": 180.00, "cat": "Cleaning & Household", "desc": "1 L - Citrus", "img": "https://www.jiomart.com/images/product/original/491515277/lizol-citrus-disinfectant-floor-cleaner-1-l-product-images-o491515277-p491515277-0-202306221059.jpg"}
]

for p in products:
    Product.objects.create(
        name=p['name'],
        description=p['desc'],
        price=p['price'],
        category=cat_objs[p['cat']],
        image_url=p['img']
    )

print("Database seeded with 22 Amazon fresh items!")
