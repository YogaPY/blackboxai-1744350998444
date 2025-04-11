// Function to initialize products in localStorage
function initializeProducts() {
    const products = [
        {
            id: 'camera1',
            name: 'Canon EOS R5 Mirrorless Camera',
            price: 3899.99,
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            description: 'The Canon EOS R5 is a professional-grade mirrorless camera that sets new standards in photography. Features include a groundbreaking 45MP full-frame CMOS sensor, up to 8K RAW video recording, advanced Dual Pixel CMOS AF II system with 1,053 AF points, and in-body image stabilization up to 8 stops.',
            status: 'active'
        },
        {
            id: 'camera2',
            name: 'Sony A7 III Mirrorless Camera',
            price: 1999.99,
            image: 'https://images.unsplash.com/photo-1516724562728-afc4865086e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            description: 'The Sony A7 III sets a new standard in full frame cameras with its advanced 24.2MP back-illuminated sensor, exceptional AF performance, and outstanding image quality even in low light conditions.',
            status: 'active'
        },
        {
            id: 'lens1',
            name: 'Canon RF 24-70mm f/2.8L IS USM',
            price: 2299.99,
            image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            description: 'A professional-grade standard zoom lens for the RF mount system. Features advanced image stabilization, fast and precise autofocus, and exceptional optical quality throughout the zoom range.',
            status: 'active'
        },
        {
            id: 'accessory1',
            name: 'Peak Design Camera Strap',
            price: 69.99,
            image: 'https://images.unsplash.com/photo-1525459819821-1c2d33189e23?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            description: 'Quick-connecting camera strap with unique Anchor Link system. Adjustable length, comfortable padding, and stylish design make it perfect for any photographer.',
            status: 'active'
        },
        {
            id: 'tripod1',
            name: 'Manfrotto MT055CXPRO4 Carbon Fiber Tripod',
            price: 599.99,
            image: 'https://images.unsplash.com/photo-1582994254571-52c62d96ebab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            description: 'Professional carbon fiber tripod with 90° center column mechanism. Features Quick Power Lock System, easy link connector, and bubble level for precise positioning.',
            status: 'active'
        },
        {
            id: 'bag1',
            name: 'Peak Design Everyday Backpack',
            price: 259.99,
            image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            description: 'Versatile camera backpack with innovative FlexFold dividers, multiple access points, and expandable storage. Perfect for photographers on the go.',
            status: 'active'
        }
    ];
    localStorage.setItem('products', JSON.stringify(products));
    return products;
}

// Function to get products from localStorage
function getProducts() {
    let products = JSON.parse(localStorage.getItem('products'));
    if (!products) {
        products = initializeProducts();
    }
    return products.filter(product => product.status !== 'archived');
}

// Function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Function to render products
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    const products = getProducts();
    
    productGrid.innerHTML = products.map(product => `
        <div class="group relative p-4 bg-white rounded-lg shadow-lg" data-product-id="${product.id}">
            <div class="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                <img src="${product.image}" alt="${product.name}" 
                    class="w-full h-full object-center object-cover group-hover:opacity-75"
                    onerror="this.src='https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'">
            </div>
            <div class="mt-4 flex justify-between">
                <div>
                    <h3 class="text-lg font-medium text-gray-900">
                        <button class="view-product hover:text-indigo-600">
                            ${product.name}
                        </button>
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                </div>
                <p class="text-lg font-bold text-gray-900">${formatPrice(product.price)}</p>
            </div>
            <button class="mt-4 w-full bg-indigo-600 text-white py-3 px-4 text-lg font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 add-to-cart">
                Add to Cart
            </button>
        </div>
    `).join('');

    console.log('Products rendered, attaching event listeners...');
    attachProductEventListeners();
}

// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to show product modal
function showProductModal(product) {
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');

    modalContent.innerHTML = `
        <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div class="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <img src="${product.image}" alt="${product.name}" 
                        class="w-full h-full object-center object-cover"
                        onerror="this.src='https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'">
                </div>
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    ${product.name}
                </h3>
                <div class="mt-2">
                    <p class="text-sm text-gray-500">
                        ${product.description}
                    </p>
                    <p class="mt-4 text-lg font-bold text-gray-900">
                        ${formatPrice(product.price)}
                    </p>
                </div>
            </div>
        </div>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm add-to-cart-modal" data-product-id="${product.id}">
                Add to Cart
            </button>
            <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm close-modal">
                Close
            </button>
        </div>
    `;

    modal.classList.remove('hidden');

    // Add event listeners for modal buttons
    const closeButton = modalContent.querySelector('.close-modal');
    closeButton.addEventListener('click', () => modal.classList.add('hidden'));

    const addToCartButton = modalContent.querySelector('.add-to-cart-modal');
    addToCartButton.addEventListener('click', () => {
        addToCart(product);
        modal.classList.add('hidden');
    });
}

// Function to get cart items from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Function to save cart items to localStorage
function saveCartItems(items) {
    localStorage.setItem('cart', JSON.stringify(items));
}

// Function to update cart count
function updateCartCount() {
    const cart = getCartItems();
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = cart.length;
    console.log('Cart updated, new count:', cart.length);
}

// Function to add item to cart
function addToCart(product) {
    const cart = getCartItems();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            price: product.price,  // Include the price when adding to cart
            quantity: 1
        });
    }
    
    saveCartItems(cart);
    updateCartCount();
    showNotification('Product added to cart!');
}

// Function to attach event listeners to product cards
function attachProductEventListeners() {
    const products = getProducts();
    
    // View product details
    document.querySelectorAll('.view-product').forEach(button => {
        button.addEventListener('click', (e) => {
            console.log('View product clicked');
            e.preventDefault();
            e.stopPropagation();
            const productId = e.target.closest('[data-product-id]').dataset.productId;
            const product = products.find(p => p.id === productId);
            if (product) {
                showProductModal(product);
            }
        });
    });

    // Add to cart from product card
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            console.log('Add to cart clicked');
            e.preventDefault();
            e.stopPropagation();
            const productId = e.target.closest('[data-product-id]').dataset.productId;
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product);
            }
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...');
    renderProducts();
    updateCartCount();
});