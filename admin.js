import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://pccdkzzaeimkdttvkota.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjY2RrenphZWlta2R0dHZrb3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjEwMjgsImV4cCI6MjA5MTI5NzAyOH0.KACVKSDVJTL9FXPK49oV_biJWbQ0STnmcdyx04qP1-A';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchSupabaseOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) {
      console.error(error);
      return [];
  }
  return data || [];
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

async function renderDashboard() {
  const orders = await fetchSupabaseOrders();
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

