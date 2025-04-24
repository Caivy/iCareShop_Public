async function fetchProducts(query = '') {
  const res = await fetch(`https://icareshop-backend.onrender.com/api/products?q=${encodeURIComponent(query)}`);
  return await res.json();
}

async function fetchCategories() {
  const res = await fetch('https://icareshop-backend.onrender.com/api/categories');
  return await res.json();
}

function renderCategories(categories) {
  const container = document.querySelector('.inline-flex');
  container.innerHTML = categories.map(cat => `
    <button onclick="filterCategory('${cat.name}', this)"
      class="category-tab px-4 py-2 text-sm rounded-full border border-[#ff5718] text-[#ff5718] hover:bg-[#ffaa7f] transition whitespace-nowrap">
      ${cat.name}
    </button>
  `).join('');
}

function filterCategory(category, btn) {
  document.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active-category'));
  btn.classList.add('active-category');
  renderAllProducts('', category);
}

async function renderAllProducts(searchText = '', filterCategory = '') {
  const products = await fetchProducts(searchText);
  const container = document.getElementById('allProducts');
  const categories = [...new Set(products.map(p => p.category))];
  const filtered = filterCategory ? products.filter(p => p.category === filterCategory) : products;

  container.innerHTML = categories.map(cat => {
    const subcats = [...new Set(filtered.filter(p => p.category === cat).map(p => p.subcategory || cat))];
    return `
      <div id="${cat.replace(/\s+/g, '')}" class="mb-8">
        <h2 class="text-xl font-bold mt-4 mb-2">${cat}</h2>
        ${subcats.map(sub => {
          const matches = filtered.filter(p => (p.subcategory || p.category) === sub && p.name.toLowerCase().includes(searchText.toLowerCase()));
          if (!matches.length) return '';
          return `
            <div id="${sub}" class="mb-4">
              <h3 class="text-lg font-semibold mb-2">${sub.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                ${matches.map(p => `
                  <div onclick='showProductModal(${JSON.stringify(p)})' class="cursor-pointer bg-white p-4 rounded-xl shadow">
                    <img src="https://github.com/Caivy/iCareShop-Backend/blob/main${p.img}?raw=true" class="rounded mb-2" />
                    <p class="text-sm text-gray-500">ID: ${p.id}</p>
                    <h3 class="font-semibold">${p.name}</h3>
                    <p class="text-yellow-600 font-bold">$${p.priceUsd.toFixed(2)} &nbsp; KHR ${p.priceKhr.toLocaleString()}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');
}

function showProductModal(product) {
  document.getElementById('modalImg').src = "https://github.com/Caivy/iCareShop-Backend/blob/main${p.img}";
  document.getElementById('modalPrice').textContent = `$${product.priceUsd.toFixed(2)}   KHR ${product.priceKhr.toLocaleString()}`;
  document.getElementById('modalId').textContent = `ID: ${product.id}`;
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('productModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('productModal').classList.add('hidden');
}

// Event listeners
window.addEventListener('DOMContentLoaded', async () => {
  const categories = await fetchCategories();
  renderCategories(categories);
  renderAllProducts();
});

document.getElementById('searchInput').addEventListener('input', e => {
  const query = e.target.value;
  renderAllProducts(query);
});