// Function to generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Function to get products from localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// Function to save products to localStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Function to render products in admin panel
function renderProducts() {
    const productList = document.getElementById('productList');
    const products = getProducts();
    
    productList.innerHTML = products.map(product => `
        <div class="bg-white overflow-hidden shadow rounded-lg" data-product-id="${product.id}">
            <div class="aspect-w-4 aspect-h-3 bg-gray-200">
                <img src="${product.image}" alt="${product.name}" 
                    class="w-full h-48 object-cover"
                    onerror="this.src='https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'">
            </div>
            <div class="p-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-900">${product.name}</h3>
                    <p class="text-sm font-medium text-gray-900">${formatPrice(product.price)}</p>
                </div>
                <p class="mt-2 text-sm text-gray-500">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                <div class="mt-4 flex justify-between items-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'archived' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }">
                        ${product.status === 'archived' ? 'Archived' : 'Active'}
                    </span>
                    <div class="flex space-x-2">
                        <button class="edit-product inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            Edit
                        </button>
                        <button class="toggle-archive inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                            product.status === 'archived' 
                            ? 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200' 
                            : 'text-red-700 bg-red-100 hover:bg-red-200'
                        }">
                            ${product.status === 'archived' ? 'Unarchive' : 'Archive'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to product cards
    attachProductEventListeners();
}

// Function to handle form submission for new product
function handleProductUpload(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newProduct = {
        id: generateId(),
        name: formData.get('productName'),
        price: parseFloat(formData.get('productPrice')),
        image: formData.get('productImage'),
        description: formData.get('productDescription'),
        status: 'active'
    };

    const products = getProducts();
    products.push(newProduct);
    saveProducts(products);
    
    // Reset form and refresh product list
    e.target.reset();
    renderProducts();
    
    // Show success notification
    showNotification('Product added successfully!', 'success');
}

// Function to handle product update
function handleProductUpdate(e) {
    e.preventDefault();
    const productId = document.getElementById('updateProductId').value;
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            name: document.getElementById('updateProductName').value,
            price: parseFloat(document.getElementById('updateProductPrice').value),
            image: document.getElementById('updateProductImage').value,
            description: document.getElementById('updateProductDescription').value
        };

        saveProducts(products);
        closeUpdateModal();
        renderProducts();
        showNotification('Product updated successfully!', 'success');
    }
}

// Function to toggle product archive status
function toggleArchiveStatus(productId) {
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        products[productIndex].status = products[productIndex].status === 'archived' ? 'active' : 'archived';
        saveProducts(products);
        renderProducts();
        showNotification(
            `Product ${products[productIndex].status === 'archived' ? 'archived' : 'unarchived'} successfully!`,
            'success'
        );
    }
}

// Function to show update modal
function showUpdateModal(product) {
    const modal = document.getElementById('updateModal');
    document.getElementById('updateProductId').value = product.id;
    document.getElementById('updateProductName').value = product.name;
    document.getElementById('updateProductPrice').value = product.price;
    document.getElementById('updateProductImage').value = product.image;
    document.getElementById('updateProductDescription').value = product.description;
    modal.classList.remove('hidden');
}

// Function to close update modal
function closeUpdateModal() {
    const modal = document.getElementById('updateModal');
    modal.classList.add('hidden');
}

// Function to show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to attach event listeners to product cards
function attachProductEventListeners() {
    // Edit product buttons
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('[data-product-id]').dataset.productId;
            const product = getProducts().find(p => p.id === productId);
            if (product) {
                showUpdateModal(product);
            }
        });
    });

    // Archive/Unarchive buttons
    document.querySelectorAll('.toggle-archive').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('[data-product-id]').dataset.productId;
            toggleArchiveStatus(productId);
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize product list
    renderProducts();

    // Add form submission handler
    document.getElementById('uploadForm').addEventListener('submit', handleProductUpload);

    // Add update form submission handler
    document.getElementById('updateProductBtn').addEventListener('click', handleProductUpdate);

    // Add modal close handler
    document.getElementById('closeUpdateModal').addEventListener('click', closeUpdateModal);

    // Close modal when clicking outside
    document.getElementById('updateModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('updateModal')) {
            closeUpdateModal();
        }
    });
});