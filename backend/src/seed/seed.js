require('dotenv').config()
const { connectDB } = require('../config/db')
const Category = require('../models/Category')
const Supplier = require('../models/Supplier')
const Product = require('../models/Product')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

async function run() {
  await connectDB()
  await Category.deleteMany({})
  await Supplier.deleteMany({})
  await Product.deleteMany({})
  await User.deleteMany({})

  const categories = await Category.insertMany([
    { name: 'Electronics', description: 'Electronic devices' },
    { name: 'Office', description: 'Office supplies' },
  ])

  const suppliers = await Supplier.insertMany([
    { name: 'Acme Corp', email: 'sales@acme.com', phone: '555-1000', address: '123 Main St' },
    { name: 'Globex Inc', email: 'contact@globex.com', phone: '555-2000', address: '456 Market St' },
  ])

  const products = await Product.insertMany([
    { name: 'Laptop Pro', sku: 'LTP100', description: 'High-end laptop', price: 1299.99, category: categories[0]._id, supplier: suppliers[0]._id, stockQuantity: 25, reorderLevel: 10, status: 'active' },
    { name: 'Wireless Mouse', sku: 'MS200', description: 'Ergonomic mouse', price: 29.99, category: categories[0]._id, supplier: suppliers[1]._id, stockQuantity: 200, reorderLevel: 50, status: 'active' },
    { name: 'Printer Paper', sku: 'PP500', description: 'A4 paper 500 sheets', price: 8.99, category: categories[1]._id, supplier: suppliers[1]._id, stockQuantity: 500, reorderLevel: 100, status: 'active' },
  ])

  await Supplier.updateOne({ _id: suppliers[0]._id }, { $set: { productsSupplied: [products[0]._id] } })
  await Supplier.updateOne({ _id: suppliers[1]._id }, { $set: { productsSupplied: [products[1]._id, products[2]._id] } })

  const adminHash = await bcrypt.hash('Admin123!', 10)
  await User.create({ name: 'Admin', email: 'admin@example.com', password: adminHash, role: 'admin' })

  process.stdout.write('Seed data inserted\n')
  process.exit(0)
}

run().catch(err => {
  process.stderr.write(err.message + '\n')
  process.exit(1)
})
