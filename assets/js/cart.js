// Function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Function to get cart items from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Function to get products from localStorage
function getProducts() {
    let products = JSON.parse(localStorage.getItem('products'));
    if (!products) {
        // Initialize products if they don't exist
        products = [
            {
                id: 'camera1',
                name: 'Canon EOS R5 Mirrorless Camera',
                price: 3899.99,
                image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                description: 'The Canon EOS R5 is a professional-grade mirrorless camera that sets new standards in photography.',
                status: 'active'
            },
            {
                id: 'camera2',
                name: 'Sony A7 III Mirrorless Camera',
                price: 1999.99,
                image: 'https://images.unsplash.com/photo-1516724562728-afc4865086e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                description: 'The Sony A7 III sets a new standard in full frame cameras.',
                status: 'active'
            }
        ];
        localStorage.setItem('products', JSON.stringify(products));
    }
    return products;
}

// Function to save cart items to localStorage
function saveCartItems(items) {
    localStorage.setItem('cart', JSON.stringify(items));
}

// Function to update cart count
function updateCartCount() {
    const cart = getCartItems();
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Function to calculate cart subtotal
function calculateSubtotal(cartItems) {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to update quantity
function updateQuantity(productId, newQuantity) {
    const cart = getCartItems();
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            cart.splice(itemIndex, 1);
        }
        
        saveCartItems(cart);
        renderCart();
        updateCartCount();
    }
}

// Function to remove item from cart
function removeFromCart(productId) {
    const cart = getCartItems();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCartItems(updatedCart);
    renderCart();
    updateCartCount();
}

// Function to render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cart = getCartItems();
    const products = getProducts();
    
    if (cart.length === 0) {
        if (cartItemsContainer.parentElement) {
            cartItemsContainer.parentElement.classList.add('hidden');
        }
        emptyCartMessage.classList.remove('hidden');
        return;
    }
    
    if (cartItemsContainer.parentElement) {
        cartItemsContainer.parentElement.classList.remove('hidden');
    }
    emptyCartMessage.classList.add('hidden');
    
    cartItemsContainer.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';
        
        return `
            <div class="p-4 sm:p-6 flex items-center border-b border-gray-200" data-product-id="${item.id}">
                <div class="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-center object-cover">
                </div>
                <div class="ml-6 flex-1">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-medium text-gray-900">${product.name}</h3>
                        <p class="ml-4 text-lg font-medium text-gray-900">${formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">${product.description}</p>
                    <div class="mt-4 flex items-center justify-between">
                        <div class="flex items-center border rounded-md">
                            <button class="px-3 py-1 text-gray-600 hover:text-gray-700" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="px-4 py-1 text-gray-900 border-x">${item.quantity}</span>
                            <button class="px-3 py-1 text-gray-600 hover:text-gray-700" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="text-red-600 hover:text-red-800" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Update subtotal
    const subtotal = calculateSubtotal(cart);
    const subtotalElement = document.getElementById('cartSubtotal');
    if (subtotalElement) {
        subtotalElement.textContent = formatPrice(subtotal);
    }
}

// Function to handle checkout
function handleCheckout() {
    // For now, just clear the cart and show a success message
    localStorage.removeItem('cart');
    alert('Thank you for your purchase! This is a demo, so no actual payment will be processed.');
    window.location.href = 'index.html';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCount();
    
    // Add checkout button handler
    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
});