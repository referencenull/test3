# Inventory Management System

A modern web application for managing retail store inventory. Built with Node.js, Express, and vanilla JavaScript.

## Features

- 📦 Browse all products in an easy-to-read table
- ➕ Add new products to inventory
- ✏️ Edit existing products and update quantities
- 🗑️ Delete products from inventory
- 🔍 Search products by name, category, or SKU
- 📊 Real-time statistics dashboard
- ⚠️ Low stock alerts (items with quantity < 50)
- 💾 Local JSON database with 20 pre-populated products

## Prerequisites

- Node.js (version 12 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd test3
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Browse Products
- All products are displayed in a table on the main page
- Use the search bar to filter products by name, category, or SKU
- Products with low stock (< 50 units) are highlighted in red

### Add New Product
1. Click the "Add New Product" button
2. Fill in all required fields:
   - Product Name
   - Category
   - Price
   - Quantity
   - SKU
3. Click "Save Product"

### Edit Product
1. Click the "Edit" button on any product row
2. Modify the fields as needed
3. Click "Save Product"

### Delete Product
1. Click the "Delete" button on any product row
2. Confirm the deletion

### Statistics Dashboard
The dashboard shows:
- Total number of products
- Total inventory value
- Number of low-stock items

## Project Structure

```
test3/
├── server.js           # Express server and API endpoints
├── database.json       # Local JSON database
├── package.json        # Project dependencies
├── public/
│   ├── index.html     # Main HTML page
│   ├── styles.css     # Styling
│   └── app.js         # Frontend JavaScript
└── README.md          # This file
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Add a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Technology Stack

- **Backend**: Node.js with Express
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: JSON file storage
- **Styling**: Modern CSS with gradients and animations

## Pre-populated Products

The database comes with 20 products across various categories:
- Electronics (Mouse, Keyboard, Headphones, etc.)
- Stationery (Notebooks, Pens, Sticky Notes, etc.)
- Office (Desk Organizer, Laptop Stand, etc.)
- Kitchenware (Coffee Mug, Water Bottle)
- Accessories (Phone Holder, Cable Clips, etc.)

## License

MIT