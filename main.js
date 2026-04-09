import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://pccdkzzaeimkdttvkota.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjY2RrenphZWlta2R0dHZrb3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjEwMjgsImV4cCI6MjA5MTI5NzAyOH0.KACVKSDVJTL9FXPK49oV_biJWbQ0STnmcdyx04qP1-A';
const supabase = createClient(supabaseUrl, supabaseKey);

// Shopping Cart State
let cart = [];
const cartToggle = document.getElementById('cartToggle');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const checkoutBtn = document.getElementById('checkoutBtn');
const etaInput = document.getElementById('etaInput');
const statusIndicator = document.getElementById('statusIndicator');

// The Full Latin Spot Menu Dataset
const menuData = [
  {
    category: "Pa' Picar",
    items: [
      { name: "10 Pechurinas (Chicken Tenders)", price: 17.99, desc: "6 pcs of tender with a side of your choice", img: "/menu/10 pechurinas.webp" },
      { name: "Quipes", price: 3.99, desc: "", img: "/menu/quipes.webp" },
      { name: "Pastelitos (Patties)", price: 3.99, desc: "", img: "/menu/Pastelitos (Patties).webp" },
      { name: "10 Alitas (Chicken Wings)", price: 17.99, desc: "", img: "/menu/10 Alitas (Chicken Wings).webp" },
      { name: "Patancon", price: 17.00, desc: "Fried plantain filled with chicken, lettuce and tomato", img: "/menu/Patancon.webp" },
      { name: "6 Pechurinas (Chicken Tenders)", price: 14.99, desc: "Con un acompañante", img: "/menu/6 Pechurinas (Chicken Tenders).webp" },
      { name: "Croquetas De Pollo (Chicken Croquettes)", price: 2.99, desc: "", img: "/menu/Croquetas De Pollo (Chicken Croquettes).webp" },
      { name: "6 Alitas Fritas (Chicken Wings)", price: 14.99, desc: "6 pcs of wing with a side of your choice", img: "/menu/6 Alitas Fritas (Chicken Wings.webp" },
      { name: "Bolas De Yuca (Yukka Ball)", price: 3.99, desc: "", img: "/menu/Bolas De Yuca (Yukka Ball).jpg" }
    ]
  },
  {
    category: "Yaroa",
    items: [
      { name: "Yaroa", price: 16.99, desc: "Pollo, queso, ketchup, mayonesa y papas fritas o maduros (chicken, cheese, ketchup, mayonnaise and french fries or sweet plantain)", img: "/menu/Yaroa.webp" }
    ]
  },
  {
    category: "Mofongo",
    items: [
      { name: "Mofongo With Chicharrón And Side Of Meat", price: 24.99, desc: "Choose a side of meat (fried chicken, pork belly, longaniza, carnitas, fried pork chops)", img: "/menu/Mofonga with Chicharron and a side of meat.webp" },
      { name: "Mofongo With Chicharrón Inside", price: 20.00, desc: "", img: "/menu/Mofonga with Chicharron.webp" },
      { name: "Plain Mofongo", price: 18.00, desc: "", img: "/mofongo_1775676311715.png" }
    ]
  },
  {
    category: "Desserts",
    items: [
      { name: "Choco Flan", price: 6.00, desc: "One layer of chocolate cake and one layer of flan", img: "/menu/choco flan.webp" },
      { name: "Tres Leche", price: 6.00, desc: "", img: "/menu/tres leche.webp" },
      { name: "Flan", price: 5.00, desc: "", img: "/menu/flan.webp" },
      { name: "Beso De Ángel", price: 8.00, desc: "Tres leche and flan together", img: "/menu/Beso de angel.webp" }
    ]
  },
  {
    category: "Chimis",
    items: [
      { name: "El Jefe", price: 17.99, desc: "Carne de res, salami, queso frito, repollo, cebolla, tomate, ketchup, mayonesa y salsa secreta. With a side of fries", img: "/menu/El Jefe.webp" },
      { name: "El Jibarito", price: 14.99, desc: "Pollo, repollo, tomate, cebolla y salsa secreta. With a side of fries", img: "/menu/el jibarito.webp" },
      { name: "Los Compadres Chimi", price: 17.00, desc: "Choose your combinations: Res + Pollo, Res + Pernil, Pernil + pollo. Repollo, tomate, cebolla, ketchup, mayonesa, mostaza, salsa secreta", img: "/menu/Los Compadres Chimi.webp" },
      { name: "El Tradicional", price: 14.99, desc: "Carne de res, repollo, cebolla, salsa secreta, ketchup y mayonesa. With a side of fries", img: "/menu/el tradicional.webp" },
      { name: "El Abusador", price: 19.00, desc: "Pernil, beef, cabbage, tomatoes, onions, ketchup, mayo, mustard and pink sauce. With a side of fries", img: "/menu/el abusador.webp" },
      { name: "El Primo", price: 14.99, desc: "Salami, queso frito, repollo, cebolla, tomate y salsa secreta. With a side of fries", img: "/menu/el primo.webp" },
      { name: "El Montro", price: 16.99, desc: "Cerdo ahumado, repollo, tomate y salsa secreta", img: "/menu/el montro.webp" }
    ]
  },
  {
    category: "Sides",
    items: [
      { name: "Yuca Frita (Fried Yukka)", price: 5.00, desc: "", img: "/menu/Yuca Frita (Fried Yukka).webp" },
      { name: "Tostones (Fried Plantain)", price: 4.99, desc: "", img: "/menu/Tostones (Fried Plantain).webp" },
      { name: "Plátano Maduro (Sweet Fried Plantain)", price: 4.99, desc: "", img: "/menu/Plátano Maduro (Sweet Fried Plantain).webp" },
      { name: "Papas Fritas (French Fries)", price: 4.99, desc: "", img: "/menu/Papas Fritas (French Fries).webp" },
      { name: "Batatas Fritas (Sweet Fried Potato)", price: 4.99, desc: "", img: "/menu/Batatas Fritas (Sweet Fried Potato).webp" }
    ]
  },
  {
    category: "Hot Dog",
    items: [
      { name: "El Simple 2 For", price: 4.99, desc: "Salchicha, ketchup y mayonesa salsa secreta", img: "/menu/El simple 2 for.webp" },
      { name: "El Fuerte", price: 4.99, desc: "Salchicha, repollo, queso derretido maiz, ketchup, mostaza, mayonesa y salsa secreta", img: "/menu/el fuerte.webp" }
    ]
  },
  {
    category: "Burgers",
    items: [
      { name: "La Patrona", price: 14.99, desc: "Carne de pollo, queso, lechuga, tomate, cebolla y salsa secreta. And a side of fries", img: "/chimi_burger_1775676264980.png" },
      { name: "El Patrón", price: 14.99, desc: "Carne de res, queso, bacon, cebolla, lechuga, tomates y salsa secreta. And side of fries", img: "/menu/el patron.webp" }
    ]
  },
  {
    category: "Beverages",
    items: [
      { name: "Country Club (Dominican Soda)", price: 4.00, desc: "Merengue, Piña-pineapple, fambruesa-raspberry, naranja-orange", img: "/menu/country club.webp" },
      { name: "Jugos Naturales (Natural Juice)", price: 5.00, desc: "", img: "/menu/jugos naturales.webp" },
      { name: "Sodas", price: 2.50, desc: "", img: "/actual_logo.webp" },
      { name: "Agua (Water)", price: 2.00, desc: "", img: "/menu/aqua.webp" },
      { name: "Malta", price: 2.50, desc: "", img: "/menu/malta goya.webp" }
    ]
  },
  {
    category: "Sandwich",
    items: [
      { name: "El Poppywa", price: 12.99, desc: "Pollo, queso, lechuga y tomate", img: "/menu/el poppywa.webp" },
      { name: "El Timido", price: 11.50, desc: "Jamón, queso lechuga, tomate, ketchup y mayonesa", img: "/menu/el timido.webp" },
      { name: "El Poppy", price: 12.99, desc: "Jamón, queso, pollo, lechuga, tomate y salsa secreta", img: "/menu/el poppy.webp" },
      { name: "El Cubanito With The Twist", price: 16.99, desc: "Pernil, jamon, platano maduro, mostaza y salsa secreta", img: "/menu/el cubanito with the twist.webp" }
    ]
  },
  {
    category: "Specials",
    items: [
      { name: "Lunch Specials", price: 18.00, desc: "Includes rice. Call the store to see what’s the lunch special", img: "/menu/Lunch Specials.jpg" },
      { name: "Fritura", price: 30.00, desc: "", img: "/menu/Fritura.jpg" },
      { name: "Papas Locas", price: 15.99, desc: "Salchichas, ketchup, mayonesa y papas fritas", img: "/menu/Papas Locas.jpg" }
    ]
  }
];

let activeCategory = "Pa' Picar";

function initMenu() {
  const filterContainer = document.getElementById('categoryFilters');
  const gridContainer = document.getElementById('menuGrid');
  
  if(!filterContainer || !gridContainer) return;

  // Build Filters
  filterContainer.innerHTML = '';
  menuData.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${cat.category === activeCategory ? 'active' : ''}`;
    btn.innerText = cat.category;
    btn.onclick = () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = cat.category;
      renderMenu();
    };
    filterContainer.appendChild(btn);
  });

  renderMenu();
}

function renderMenu() {
  const gridContainer = document.getElementById('menuGrid');
  if(!gridContainer) return;
  
  gridContainer.innerHTML = '';
  
  const categoryData = menuData.find(c => c.category === activeCategory);
  if(!categoryData) return;

  categoryData.items.forEach((item, index) => {
    // Escaping strings for onclick purely for safety
    const safeName = item.name.replace(/'/g, "\\'");
    
    gridContainer.innerHTML += `
      <div class="menu-item" style="animation-delay: ${index * 0.05}s">
        <div class="image-wrapper">
          <img src="${item.img}" alt="${item.name}" />
        </div>
        <div class="item-details">
          <h3>${item.name}</h3>
          ${item.desc ? `<p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.5rem; line-height: 1.2;">${item.desc}</p>` : ''}
          <p class="price">$${item.price.toFixed(2)}</p>
          <button onclick="addToCart('${safeName}', ${item.price})" class="add-btn">Add to Cart</button>
        </div>
      </div>
    `;
  });
}

// Call initially
document.addEventListener('DOMContentLoaded', initMenu);

// Event Listeners
cartToggle.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// Allow inline scripts to trigger cart add
window.addEventListener('cart-add', (e) => {
  addToCart(e.detail.name, e.detail.price);
});

function toggleCart() {
  cartSidebar.classList.toggle('open');
  cartOverlay.classList.toggle('open');
}

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  
  updateCartUI();
  
  // Micro-animation on cart toggle button
  cartToggle.style.transform = 'scale(1.1)';
  setTimeout(() => cartToggle.style.transform = 'scale(1)', 200);
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCartUI();
}

function updateCartUI() {
  // Update count badge
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalCount;
  
  // Empty state
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    cartTotalElement.textContent = '0.00';
    return;
  }
  
  // Render items
  cartItemsContainer.innerHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <div>
          <h4 style="margin: 0; font-size: 1.1rem">${item.name}</h4>
          <p style="margin: 0; color: var(--neon-green)">$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div>
          <button onclick="removeFromCart('${item.name}')" style="background:var(--red); color:white; border:none; border-radius:4px; padding:0.4rem 0.6rem; cursor:pointer">X</button>
        </div>
      </div>
    `;
  });
  
  // Update total
  cartTotalElement.textContent = total.toFixed(2);
  
  // Re-attach global handlers for dynamically created buttons
  window.removeFromCart = removeFromCart;
}

// Checkout and ETA Simulation (Supabase Mock)
checkoutBtn.addEventListener('click', async () => {
  if (cart.length === 0) {
    alert("Please add items to your cart first.");
    return;
  }
  
  const eta = etaInput.value.trim();
  if (!eta) {
    alert("Please let us know your Estimated Time of Arrival (ETA) so we can have your food hot and ready!");
    return;
  }
  
  checkoutBtn.textContent = 'Sending Order...';
  checkoutBtn.style.opacity = '0.7';
  
  const newOrder = {
    id: Date.now().toString(),
    items: [...cart],
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    eta: eta,
    timestamp: new Date().toISOString()
  };

  const { data, error } = await supabase.from('orders').insert([newOrder]);
  if (error) {
      console.error(error);
      alert("Error processing order. Please try again.");
      checkoutBtn.textContent = 'Pre-Order Now';
      checkoutBtn.style.opacity = '1';
      return;
  }

  setTimeout(() => {
    alert(`Success! Notification sent to Latin Spot. They expect you in ${eta}. ¡Buen provecho!`);
    cart = [];
    etaInput.value = '';
    updateCartUI();
    toggleCart();
    checkoutBtn.textContent = 'Pre-Order Now';
    checkoutBtn.style.opacity = '1';
  }, 1500);
});

// Simulated Admin connection for blinking open sign
// In a real app, this would poll an API or use WebSockets
setInterval(() => {
  // Randomly simulate a slight flicker in the neon sign for a realistic effect
  if(Math.random() > 0.95) {
    statusIndicator.style.opacity = '0.5';
    setTimeout(() => {
      statusIndicator.style.opacity = '1';
    }, 100);
  }
}, 2000);

// Global Onboarding Functionality
window.enterSite = function() {
  const overlay = document.getElementById('onboardingOverlay');
  const video = document.getElementById('onboardingVideo');
  
  if (overlay) {
    overlay.classList.add('fade-out');
    sessionStorage.setItem('hasSeenOnboarding', 'true');
    
    setTimeout(() => {
      overlay.style.display = 'none';
      if(video) video.pause(); // stop video playback to save memory
    }, 800); // Wait for fade-out
  }
};

// Check if user has already seen onboarding in this session
if (sessionStorage.getItem('hasSeenOnboarding') === 'true') {
  const overlay = document.getElementById('onboardingOverlay');
  if(overlay) {
    overlay.style.display = 'none';
  }
}




// Hidden Admin Login Setup
const logoElement = document.querySelector('.logo');
if(logoElement) {
    let logoClickCount = 0;
    let logoClickTimer;

    logoElement.addEventListener('click', () => {
        logoClickCount++;
        clearTimeout(logoClickTimer);
        
        if(logoClickCount === 3) {
            const code = prompt("Enter secret auth code:");
            if(code === "bronx2winstonDR") {
                window.location.href = "admin.html";
            } else if (code) {
                alert("Incorrect access code.");
            }
            logoClickCount = 0;
        } else {
            logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 800); // Allows 800ms between taps
        }
    });
}


