const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'database.json');

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Helper function to read database
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    throw new Error('Failed to read database');
  }
}

// Helper function to write database
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw new Error('Failed to write database');
  }
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const db = readDatabase();
    res.json(db.products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const db = readDatabase();
    const product = db.products.find(p => p.id === parseInt(req.params.id));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

// Add new product
app.post('/api/products', (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.category || !req.body.sku) {
      return res.status(400).json({ error: 'Name, category, and SKU are required' });
    }
    
    const price = parseFloat(req.body.price);
    const quantity = parseInt(req.body.quantity);
    
    // Validate numeric fields
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ error: 'Price must be a valid positive number' });
    }
    
    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({ error: 'Quantity must be a valid positive number' });
    }
    
    const db = readDatabase();
    const newProduct = {
      id: db.nextId,
      name: req.body.name,
      category: req.body.category,
      price: price,
      quantity: quantity,
      sku: req.body.sku
    };
    
    db.products.push(newProduct);
    db.nextId++;
    writeDatabase(db);
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const db = readDatabase();
    const index = db.products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index !== -1) {
      // Validate numeric fields if provided
      let price = db.products[index].price;
      let quantity = db.products[index].quantity;
      
      if (req.body.price !== undefined) {
        price = parseFloat(req.body.price);
        if (isNaN(price) || price < 0) {
          return res.status(400).json({ error: 'Price must be a valid positive number' });
        }
      }
      
      if (req.body.quantity !== undefined) {
        quantity = parseInt(req.body.quantity);
        if (isNaN(quantity) || quantity < 0) {
          return res.status(400).json({ error: 'Quantity must be a valid positive number' });
        }
      }
      
      db.products[index] = {
        ...db.products[index],
        name: req.body.name || db.products[index].name,
        category: req.body.category || db.products[index].category,
        price: price,
        quantity: quantity,
        sku: req.body.sku || db.products[index].sku
      };
      
      writeDatabase(db);
      res.json(db.products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const db = readDatabase();
    const index = db.products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index !== -1) {
      const deletedProduct = db.products.splice(index, 1)[0];
      writeDatabase(db);
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Inventory Management Server running on http://localhost:${PORT}`);
});
