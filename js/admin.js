function showSection(sectionId) {
  const sections = document.querySelectorAll('main section');
  sections.forEach(section => {
    if (section.id === sectionId) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
});

async function fetchCategories() {
  const res = await fetch('https://icareshop-backend.onrender.com/api/categories');
  return await res.json();
}

function populateCategoryDropdowns(categories) {
  const categorySelect = document.getElementById('categorySelect');
  const subcategorySelect = document.getElementById('subcategorySelect');
  categorySelect.innerHTML = '';
  subcategorySelect.innerHTML = '';

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.name;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  });

  categorySelect.addEventListener('change', e => {
    const selected = categories.find(c => c.name === e.target.value);
    subcategorySelect.innerHTML = '';
    if (selected && selected.subcategories.length > 0) {
      selected.subcategories.forEach(sub => {
        const option = document.createElement('option');
        option.value = sub;
        option.textContent = sub;
        subcategorySelect.appendChild(option);
      });
    }
  });

  categorySelect.dispatchEvent(new Event('change'));
}

async function loadProducts() {
  const products = await (await fetch('https://icareshop-backend.onrender.com/api/products')).json();
  const list = document.getElementById('productList');
  list.innerHTML = products.map(p => `
    <div class="bg-white p-4 rounded shadow">
      <img src="https://github.com/Caivy/iCareShop-Backend/blob/main/uploads/${p.img}" class="w-full h-40 object-cover mb-2 rounded" />
      <p class="text-sm text-gray-500">ID: ${p.id}</p>
      <h3 class="font-semibold">${p.name}</h3>
      <p class="text-yellow-600 font-bold">$${p.priceUsd.toFixed(2)} | KHR ${p.priceKhr.toLocaleString()}</p>
    </div>
  `).join('');
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const res = await fetch('https://icareshop-backend.onrender.com/api/admin/upload', {
    method: 'POST',
    body: formData
  });
  if (res.ok) {
    e.target.reset();
    await loadProducts();
  } else {
    alert('Upload failed');
  }
});

async function loadCategories() {
  const categories = await fetchCategories();
  populateCategoryDropdowns(categories);
  const categoryList = document.getElementById('categoryList');
  categoryList.innerHTML = categories.map(c => `
    <div class="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h4 class="font-bold text-orange-600">${c.name}</h4>
        <p class="text-sm text-gray-500">${c.subcategories.join(', ')}</p>
      </div>
      <button onclick="deleteCategory('${c._id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
    </div>
  `).join('');
}

document.getElementById('categoryForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const res = await fetch('https://icareshop-backend.onrender.com/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: form.name.value,
      subcategories: form.subcategories.value.split(',').map(s => s.trim())
    })
  });
  if (res.ok) {
    //work
    form.reset();
    await loadCategories();
    await populateCategoryDropdowns(await fetchCategories());
  } else {
    //doesn't work
    alert('Category creation failed');
  }
});

async function deleteCategory(id) {
  const confirmed = confirm('Are you sure you want to delete this category?');
  if (!confirmed) return;
  const res = await fetch(`https://icareshop-backend.onrender.com/api/categories/${id}`, {
    method: 'DELETE',
  });
  if (res.ok) {
    await loadCategories();
    await populateCategoryDropdowns(await fetchCategories());
  } else {
    alert('Deletion failed');
  }
}

loadProducts();
loadCategories();
