async function fetchProducts() {
    const res = await fetch('https://icareshop-backend.onrender.com/api/products');
    return await res.json();
  }
  
  async function renderAllProducts() {
    const products = await fetchProducts();
    const container = document.getElementById('allProducts');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const categories = [...new Set(products.map(p => p.category))];
    container.innerHTML = categories.map(cat => {
      const subcats = [...new Set(
        products
          .filter(p => p.category === cat)
          .map(p => p.subcategory || cat)
      )];
      return `
        <div id="${cat.replace(/\s+/g, '')}" class="mb-8">
          <h2 class="text-xl font-bold mt-4 mb-2">${cat}</h2>
          ${subcats.map(sub => {
            const filtered = products.filter(p =>
              (p.subcategory || p.category) === sub &&
              p.name.toLowerCase().includes(search)
            );
            if (!filtered.length) return '';
            return `
              <div id="${sub}" class="mb-4">
                <h3 class="text-lg font-semibold mb-2">
                  ${sub.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  ${filtered.map(p => `
                    <div onclick='showProductModal(${JSON.stringify(p)})'
                         class="cursor-pointer bg-white p-4 rounded-xl shadow">
                      <img src="https://icareshop-backend.onrender.com${p.img}" class="rounded mb-2" />
                      <p class="text-sm text-gray-500">ID: ${p.id}</p>
                      <h3 class="font-semibold">${p.name}</h3>
                      <p class="text-yellow-600 font-bold">
                        $${p.priceUsd.toFixed(2)} &nbsp; KHR ${p.priceKhr.toLocaleString()}
                      </p>
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
  
  function scrollToCategory(id, btn) {
    if (btn) {
      document.querySelectorAll('.category-tab')
        .forEach(b => b.classList.remove('active-category'));
      btn.classList.add('active-category');
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
  
  function showProductModal(product) {
    document.getElementById('modalImg').src = `https://icareshop-backend.onrender.com${product.img}`;
    document.getElementById('modalPrice').textContent =
      `$${product.priceUsd.toFixed(2)}   KHR ${product.priceKhr.toLocaleString()}`;
    document.getElementById('modalId').textContent = `ID: ${product.id}`;
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('productModal').classList.remove('hidden');
  }
  
  function closeModal() {
    document.getElementById('productModal').classList.add('hidden');
  }
  
  renderAllProducts();
  