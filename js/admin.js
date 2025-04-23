async function fetchProducts() {
    const res = await fetch('http://localhost:3000/api/products');
    return await res.json();
  }
  
  function renderProducts(products) {
  const list = document.getElementById('productList');
  list.innerHTML = products.map(p => `
    <div class="bg-white p-4 rounded shadow">
      <img src="http://localhost:3000${p.img}" class="rounded mb-2" />
      <p class="text-sm text-gray-500">ID: ${p.id || 'N/A'}</p>
      <h3 class="font-semibold">${p.name || 'Unnamed Product'}</h3>
      <p class="text-yellow-600 font-bold">
        $${(p.priceUsd ?? 0).toFixed(2)} &nbsp; KHR ${(p.priceKhr ?? 0).toLocaleString()}
      </p>
    </div>
  `).join('');
}

  
  async function loadProducts() {
    const products = await fetchProducts();
    renderProducts(products);
  }
  
  document.getElementById('productForm')
    .addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const res = await fetch('http://localhost:3000/api/admin/upload', {
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
  