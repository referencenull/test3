// State
let products = [];
let editingProductId = null;

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  
  // Search functionality
  document.getElementById('searchInput').addEventListener('input', (e) => {
    filterProducts(e.target.value);
  });
  
  // Form submission
  document.getElementById('productForm').addEventListener('submit', handleFormSubmit);
});

// Load all products from API
async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    products = await response.json();
    displayProducts(products);
    updateStatistics(products);
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Failed to load products. Please refresh the page.');
  }
}

// Display products in table
function displayProducts(productsToDisplay) {
  const tbody = document.getElementById('productTableBody');
  
  if (productsToDisplay.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">No products found</td></tr>';
    return;
  }
  
  tbody.innerHTML = productsToDisplay.map(product => {
    const totalValue = (product.price * product.quantity).toFixed(2);
    const lowStockClass = product.quantity < 50 ? 'low-stock' : '';
    
    return `
      <tr>
        <td>${product.sku}</td>
        <td><strong>${product.name}</strong></td>
        <td>${product.category}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td class="${lowStockClass}">${product.quantity}</td>
        <td>$${totalValue}</td>
        <td>
          <button class="btn btn-small btn-edit" onclick="editProduct(${product.id})">Edit</button>
          <button class="btn btn-small btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Update statistics
function updateStatistics(products) {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const lowStock = products.filter(p => p.quantity < 50).length;
  
  document.getElementById('totalProducts').textContent = totalProducts;
  document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
  document.getElementById('lowStock').textContent = lowStock;
}

// Filter products based on search
function filterProducts(searchTerm) {
  const filtered = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayProducts(filtered);
}

// Show add product modal
function showAddProductModal() {
  editingProductId = null;
  document.getElementById('modalTitle').textContent = 'Add New Product';
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('productModal').style.display = 'block';
}

// Edit product
function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  editingProductId = id;
  document.getElementById('modalTitle').textContent = 'Edit Product';
  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productQuantity').value = product.quantity;
  document.getElementById('productSku').value = product.sku;
  document.getElementById('productModal').style.display = 'block';
}

// Close modal
function closeModal() {
  document.getElementById('productModal').style.display = 'none';
  document.getElementById('productForm').reset();
  editingProductId = null;
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const productData = {
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    price: parseFloat(document.getElementById('productPrice').value),
    quantity: parseInt(document.getElementById('productQuantity').value),
    sku: document.getElementById('productSku').value
  };
  
  try {
    if (editingProductId) {
      // Update existing product
      const response = await fetch(`/api/products/${editingProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        closeModal();
        loadProducts();
        alert('Product updated successfully!');
      } else {
        alert('Failed to update product');
      }
    } else {
      // Add new product
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        closeModal();
        loadProducts();
        alert('Product added successfully!');
      } else {
        alert('Failed to add product');
      }
    }
  } catch (error) {
    console.error('Error saving product:', error);
    alert('An error occurred while saving the product');
  }
}

// Delete product
async function deleteProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
    return;
  }
  
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      loadProducts();
      alert('Product deleted successfully!');
    } else {
      alert('Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('An error occurred while deleting the product');
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('productModal');
  if (event.target === modal) {
    closeModal();
  }
}
