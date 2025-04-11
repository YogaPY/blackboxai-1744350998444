// Function to initialize products in localStorage
function initializeProducts() {
    const products = [
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
        // Add more products as needed
    ];
    localStorage.setItem('products', JSON.stringify(products));
}

// Call the function to initialize products
initializeProducts();