require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Food = require('./models/Food');

const foods = [
  { name: 'Steamed Momo', description: 'Classic steamed dumplings with juicy filling', price: 120, category: 'Momo', isVeg: true, isFeatured: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400' },
  { name: 'Fried Momo', description: 'Crispy golden fried momos with spicy sauce', price: 140, category: 'Momo', isVeg: true, isFeatured: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400' },
  { name: 'Chicken Momo', description: 'Tender chicken filled steamed dumplings', price: 160, category: 'Momo', isVeg: false, isFeatured: true, rating: 4.9, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400' },
  { name: 'Veg Spring Roll', description: 'Crispy rolls stuffed with fresh vegetables', price: 100, category: 'Spring Rolls', isVeg: true, isFeatured: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
  { name: 'Chicken Wings', description: 'Spicy buffalo chicken wings with dip', price: 220, category: 'Wings', isVeg: false, isFeatured: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400' },
  { name: 'Masala Fries', description: 'Crispy fries tossed in spicy masala', price: 90, category: 'Fries', isVeg: true, isFeatured: false, rating: 4.4, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' },
  { name: 'Veg Burger', description: 'Juicy veggie patty with fresh veggies', price: 130, category: 'Burger', isVeg: true, isFeatured: false, rating: 4.3, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { name: 'Chicken Burger', description: 'Crispy chicken fillet burger with sauce', price: 180, category: 'Burger', isVeg: false, isFeatured: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { name: 'Chocolate Brownie', description: 'Warm fudgy brownie with ice cream', price: 150, category: 'Desserts', isVeg: true, isFeatured: false, rating: 4.8, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400' },
  { name: 'Mango Lassi', description: 'Refreshing mango yogurt drink', price: 80, category: 'Beverages', isVeg: true, isFeatured: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400' },
  { name: 'Cold Coffee', description: 'Chilled coffee with cream and ice', price: 100, category: 'Beverages', isVeg: true, isFeatured: false, rating: 4.6, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
  { name: 'Paneer Momo', description: 'Soft paneer stuffed steamed momos', price: 150, category: 'Momo', isVeg: true, isFeatured: false, rating: 4.6, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create admin
  const adminExists = await User.findOne({ email: 'admin@mdbrestrocafe.com' });
  if (!adminExists) {
    await User.create({ name: 'Admin', email: 'admin@mdbrestrocafe.com', password: 'admin123', role: 'admin' });
    console.log('✅ Admin created: admin@mdbrestrocafe.com / admin123');
  } else console.log('ℹ️  Admin already exists');

  // Seed foods
  await Food.deleteMany({});
  await Food.insertMany(foods);
  console.log(`✅ ${foods.length} food items seeded`);

  mongoose.disconnect();
  console.log('Done! 🎉');
}

seed().catch(console.error);
