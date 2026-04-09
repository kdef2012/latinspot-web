// Mock Supabase Controller
// In production on Vercel, this will be replaced with:
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function fetchSupabaseOrders() {
  // Simulating a Supabase SELECT query
  // Let { data, error } = await supabase.from('orders').select('*')
  const data = localStorage.getItem('latinSpotMockOrders');
  return data ? JSON.parse(data) : [];
}

function processAnalytics(orders) {
  let totalRevenue = 0;
  let itemCounts = {};
  let hourCounts = {};

  orders.forEach(order => {
    // Revenue
    totalRevenue += order.total;
    
    // Items
    order.items.forEach(item => {
      if(!itemCounts[item.name]) itemCounts[item.name] = 0;
      itemCounts[item.name] += item.quantity;
    });

    // Time Frequency (mocking hours 0-23)
    const orderDate = new Date(order.timestamp);
    const hour = orderDate.getHours();
    if(!hourCounts[hour]) hourCounts[hour] = 0;
    hourCounts[hour] += 1;
  });

  return { totalRevenue, itemCounts, hourCounts, totalOrders: orders.length };
}

function renderDashboard() {
  const orders = fetchSupabaseOrders();
  const analytics = processAnalytics(orders);

  // Update Top Metrics
  document.getElementById('metric-revenue').textContent = `$${analytics.totalRevenue.toFixed(2)}`;
  document.getElementById('metric-orders').textContent = analytics.totalOrders;
  // Approximating unique customers by unique ETAs provided (mock logic)
  const uniqueEtas = new Set(orders.map(o => o.eta)).size;
  document.getElementById('metric-customers').textContent = uniqueEtas;

  // Render Live Orders Feed
  const ordersList = document.getElementById('ordersList');
  if(orders.length > 0) {
    ordersList.innerHTML = orders.reverse().slice(0, 10).map(order => `
      <div class="order-row">
        <div>
          <strong style="color:var(--white)">ETA: ${order.eta}</strong>
          <div style="color:#94a3b8; font-size:0.9rem; margin-top:4px;">
            ${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="color:var(--neon-green); font-weight:bold;">$${order.total.toFixed(2)}</div>
          <span class="status-badge">Received</span>
        </div>
      </div>
    `).join('');
  }

  // Render Charts
  const ctxItems = document.getElementById('itemsChart').getContext('2d');
  const itemsLabels = Object.keys(analytics.itemCounts);
  const itemsData = Object.values(analytics.itemCounts);

  new Chart(ctxItems, {
    type: 'bar',
    data: {
      labels: itemsLabels.length > 0 ? itemsLabels : ['No Data'],
      datasets: [{
        label: 'Quantity Sold',
        data: itemsData.length > 0 ? itemsData : [0],
        backgroundColor: 'rgba(206, 17, 38, 0.7)', // Dominican Red
        borderColor: '#ce1126',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: { display: false }
      }
    }
  });

  const ctxTraffic = document.getElementById('trafficChart').getContext('2d');
  // Sort hours map for chart
  const hours = Object.keys(analytics.hourCounts).sort((a,b) => Number(a)-Number(b));
  const counts = hours.map(h => analytics.hourCounts[h]);

  new Chart(ctxTraffic, {
    type: 'line',
    data: {
      labels: hours.length > 0 ? hours.map(h => `${h}:00`) : ['No Data'],
      datasets: [{
        label: 'Orders by Hour',
        data: counts.length > 0 ? counts : [0],
        borderColor: '#39ff14', // Neon Green
        tension: 0.3,
        fill: true,
        backgroundColor: 'rgba(57, 255, 20, 0.1)'
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

// Initialize
renderDashboard();
