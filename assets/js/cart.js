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
    return JSON.parse(localStorage.getItem('products')) || [];
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
}

// Function to calculate cart subtotal
function calculateSubtotal(cartItems) {
    const products = getProducts();
    return cartItems.reduce((total, item) => {
        const product = products.find(p => p.id === item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
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
        cartItemsContainer.parentElement.classList.add('hidden');
        emptyCartMessage.classList.remove('hidden');
        return;
    }
    
    cartItemsContainer.parentElement.classList.remove('hidden');
    emptyCartMessage.classList.add('hidden');
    
    cartItemsContainer.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';
        
        return `
            <div class="p-4 sm:p-6 flex items-center" data-product-id="${item.id}">
                <div class="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-center object-cover">
                </div>
                <div class="ml-6 flex-1">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-medium text-gray-900">${product.name}</h3>
                        <p class="ml-4 text-lg font-medium text-gray-900">${formatPrice(product.price * item.quantity)}</p>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                    <div class="mt-4 flex items-center justify-between">
                        <div class="flex items-center">
                            <button class="text-gray-500 hover:text-gray-700" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-4 text-gray-900">${item.quantity}</span>
                            <button class="text-gray-500 hover:text-gray-700" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
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
    document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
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
    document.getElementById('checkoutButton').addEventListener('click', handleCheckout);
});