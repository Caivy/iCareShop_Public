async function fetchProducts() {
    const res = await fetch('https://icareshop-backend.onrender.com/api/products');
    return await res.json();
  }
  
  function renderProducts(products) {
  const list = document.getElementById('productList');
  list.innerHTML = products.map(p => `
    <div class="bg-white p-4 rounded shadow">
      <img src="https://icareshop-backend.onrender.com${p.img}" class="rounded mb-2" />
      <p class="text-sm text-gray-500">ID: ${p.id || 'N/A'}</p>
      <h3 class="font-semibold">${p.name || 'Unnamed Product'}</h3>
      <p class="text-yellow-600 font-bold">
        $${(p.priceUsd ?? 0).toFixed(2)} &nbsp; KHR ${(p.priceKhr ?? 0).toLocaleString()}
      </p>
    </div>
  `).join('');
}

function getTokenHeader() {
  const token = localStorage.getItem('admin_token');
  return { Authorization: `Bearer ${token}` };
}

// Update product upload fetch call
// Inside document.getElementById('productForm').addEventListener...
const res = await fetch('https://icareshop-backend.onrender.com/api/admin/upload', {
  method: 'POST',
  headers: getTokenHeader(),
  body: formData
});

// File: public/admin.html (add at top of <script> block)
if (!localStorage.getItem('admin_token')) {
  window.location.href = 'login.html';
}


  async function loadProducts() {
    const products = await fetchProducts();
    renderProducts(products);
  }
  
  document.getElementById('productForm')
    .addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const res = await fetch('https://icareshop-backend.onrender.com/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        e.target.reset();
        loadProducts();
      } else {
        alert('Upload failed');
      }
    });
  
  loadProducts();
  