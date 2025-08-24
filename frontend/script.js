// A simple in-memory store for sensor data
// This is for demonstration; in a production app, you'd use a database.
let sensorData = [
  { id: 'SNS-001', lat: 22.4064, lng: 88.9781, temp: 28.5, humidity: 65, smoke: 15, ldr: 850, status: 'online' },
];
// Add a new sensor at current location
function addSensor() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Generate new sensor ID
        const newId = `SNS-${String(sensorData.length + 1).padStart(3, '0')}`;

        // Create new sensor object
        const newSensor = {
          id: newId,
          lat: lat,
          lng: lng,
          temp: (20 + Math.random() * 10).toFixed(1),
          humidity: (40 + Math.random() * 20).toFixed(1),
          smoke: (5 + Math.random() * 10).toFixed(1),
          ldr: (300 + Math.random() * 700).toFixed(0),
          status: 'online'
        };

        // ✅ Push to sensorData array
        sensorData.push(newSensor);

        // ✅ Add marker on map
        const color = getStatusColor(newSensor.status);
        const marker = L.circleMarker([lat, lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.8,
          radius: 12,
          weight: 3
        }).addTo(map);

        marker.bindPopup(`<div style="padding: 12px; min-width: 220px; background: rgba(30, 41, 59, 0.95); border-radius: 12px; color: #e2e8f0; border: 1px solid rgba(34, 197, 94, 0.2);">
          <h4 style="margin-bottom: 10px; color: #10b981; font-size: 1.1rem;">${newSensor.id}</h4>
          <p style="margin: 6px 0; font-size: 0.9rem;"><strong>Status:</strong> <span style="color: ${color}; text-transform: uppercase; font-weight: 600;">${newSensor.status}</span></p>
          <p style="margin: 6px 0; font-size: 0.9rem;"><strong>Temperature:</strong> ${newSensor.temp}°C</p>
          <p style="margin: 6px 0; font-size: 0.9rem;"><strong>Humidity:</strong> ${newSensor.humidity}%</p>
          <p style="margin: 6px 0; font-size: 0.9rem;"><strong>Smoke:</strong> ${newSensor.smoke} ppm</p>
          <a href = "./pages/sensors.html" class="btn btn-primary" style="margin-top: 12px; padding: 6px 14px; font-size: 0.8rem;text-decoration:none;color:white;">View Details</a>
        </div>`);
        // Center map on new sensor
        map.setView([lat, lng], 15);

        // ✅ If you’re on sensors page → refresh grid
        if (currentPage === 'sensors') {
          loadSensorsPage();
        }
      },
      function (error) {
        console.error("Error getting location:", error);
        alert("Could not get your location. Please enable GPS.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}
 // Mock sensor data
       
        let map;
        let currentPage = 'home';

        // Initialize map
        function initMap() {
            map = L.map('map', {
        minZoom: 10,
        maxZoom: 16
    }).setView([22.4064, 88.9781], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add sensors to map
            sensorData.forEach(sensor => {
                const color = getStatusColor(sensor.status);
                const marker = L.circleMarker([sensor.lat, sensor.lng], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.8,
                    radius: 12,
                    weight: 3
                }).addTo(map);

                const popupContent = `
                    <div style="padding: 12px; min-width: 220px; background: rgba(30, 41, 59, 0.95); border-radius: 12px; color: #e2e8f0; border: 1px solid rgba(34, 197, 94, 0.2);">
                        <h4 style="margin-bottom: 10px; color: #10b981; font-size: 1.1rem;">${sensor.id}</h4>
                        <p style="margin: 6px 0; font-size: 0.9rem;"><strong>Status:</strong> <span style="color: ${color}; text-transform: uppercase; font-weight: 600;">${sensor.status}</span></p>
                        <p style="margin: 6px 0; font-size: 0.9rem;"><strong>Temperature:</strong> ${sensor.temp}°C</p>
                        <p style="margin: 6px 0; font-size: 0.9rem;"><strong>Humidity:</strong> ${sensor.humidity}%</p>
                        <p style="margin: 6px 0; font-size: 0.9rem;"><strong>Smoke:</strong> ${sensor.smoke} ppm</p>
                        <a href="./pages/sensors.html" class="btn btn-primary" style="margin-top: 12px; padding: 6px 14px; font-size: 0.8rem;text-decoration:none;">View Details</a>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
            });
        }

        function getStatusColor(status) {
            switch(status) {
                case 'online': return '#10b981';
                case 'warning': return '#f59e0b';
                case 'critical': return '#ef4444';
                case 'offline': return '#64748b';
                default: return '#64748b';
            }
        }

        // Load sensors page
        function loadSensorsPage() {
            const sensorGrid = document.getElementById('sensor-grid');
            sensorGrid.innerHTML = '';
            
            sensorData.forEach(sensor => {
                const sensorCard = document.createElement('div');
                sensorCard.className = 'sensor-card';
                sensorCard.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
                        <h3 style="color: #10b981; font-size: 1.2rem; font-weight: 600;">${sensor.id}</h3>
                        <span style="padding: 0.4rem 1rem; border-radius: 12px; font-size: 0.8rem; color: #0f1419; background: ${getStatusColor(sensor.status)}; font-weight: 600; box-shadow: 0 0 15px ${getStatusColor(sensor.status)}40;">
                            ${sensor.status.toUpperCase()}
                        </span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem;">
                        <div style="text-align: center; padding: 1.2rem; background: rgba(239, 68, 68, 0.15); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3);">
                            <div style="font-size: 1.5rem; font-weight: 600; color: #ef4444;">${sensor.temp}°C</div>
                            <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.2rem;">Temperature</div>
                        </div>
                        <div style="text-align: center; padding: 1.2rem; background: rgba(59, 130, 246, 0.15); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.3);">
                            <div style="font-size: 1.5rem; font-weight: 600; color: #3b82f6;">${sensor.humidity}%</div>
                            <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.2rem;">Humidity</div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem;">
                        <div style="text-align: center; padding: 1.2rem; background: rgba(168, 85, 247, 0.15); border-radius: 12px; border: 1px solid rgba(168, 85, 247, 0.3);">
                            <div style="font-size: 1.5rem; font-weight: 600; color: #a855f7;">${sensor.smoke}</div>
                            <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.2rem;">Smoke (ppm)</div>
                        </div>
                        <div style="text-align: center; padding: 1.2rem; background: rgba(245, 158, 11, 0.15); border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.3);">
                            <div style="font-size: 1.5rem; font-weight: 600; color: #f59e0b;">${sensor.ldr}</div>
                            <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.2rem;">Light</div>
                        </div>
                    </div>
                    
                    <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem;">
                        📍 ${sensor.lat}, ${sensor.lng}
                    </div>
                    
                    <button onclick="viewSensorDetails('${sensor.id}')" class="btn btn-primary" style="width: 100%;">
                        View Details
                    </button>
                `;
                sensorGrid.appendChild(sensorCard);
            });
        }

        

        // Sensor details modal
        function viewSensorDetails(sensorId) {
            const sensor = sensorData.find(s => s.id === sensorId);
            if (!sensor) return;

            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = `
                <h2 style="color: #10b981; margin-bottom: 1.5rem; font-weight: 600; text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);">Sensor ${sensor.id}</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="text-align: center; padding: 1.2rem; background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(249, 115, 22, 0.2)); color: #ef4444; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3);">
                        <div style="font-size: 2rem; font-weight: 600;">${sensor.temp}°C</div>
                        <div style="opacity: 0.8; font-size: 0.9rem;">Temperature</div>
                    </div>
                    
                    <div style="text-align: center; padding: 1.2rem; background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(129, 140, 248, 0.2)); color: #3b82f6; border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.3);">
                        <div style="font-size: 2rem; font-weight: 600;">${sensor.humidity}%</div>
                        <div style="opacity: 0.8; font-size: 0.9rem;">Humidity</div>
                    </div>
                    
                    <div style="text-align: center; padding: 1.2rem; background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(217, 70, 239, 0.2)); color: #a855f7; border-radius: 12px; border: 1px solid rgba(168, 85, 247, 0.3);">
                        <div style="font-size: 2rem; font-weight: 600;">${sensor.smoke}</div>
                        <div style="opacity: 0.8; font-size: 0.9rem;">Smoke (ppm)</div>
                    </div>
                    
                    <div style="text-align: center; padding: 1.2rem; background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.2)); color: #f59e0b; border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.3);">
                        <div style="font-size: 2rem; font-weight: 600;">${sensor.ldr}</div>
                        <div style="opacity: 0.8; font-size: 0.9rem;">Light</div>
                    </div>
                </div>
                
                <div style="background: rgba(34, 197, 94, 0.1); padding: 1.2rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid rgba(34, 197, 94, 0.2);">
                    <h3 style="margin-bottom: 1rem; color: #10b981; font-weight: 600;">Sensor Information</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.8rem; font-size: 0.9rem; color: #e2e8f0;">
                        <div><strong style="color: #10b981;">Location:</strong> ${sensor.lat}, ${sensor.lng}</div>
                        <div><strong style="color: #10b981;">Status:</strong> <span style="color: ${getStatusColor(sensor.status)}; font-weight: 600; text-transform: uppercase;">${sensor.status}</span></div>
                        <div><strong style="color: #10b981;">Last Updated:</strong> Just now</div>
                        <div><strong style="color: #10b981;">Battery:</strong> ${sensor.status === 'offline' ? '0%' : '85%'}</div>
                    </div>
                </div>
                
                <div style="background: rgba(34, 197, 94, 0.1); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.2);">
                    <h3 style="margin-bottom: 1rem; color: #10b981; font-weight: 600;">Risk Assessment</h3>
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #e2e8f0;">Fire Risk Level</span>
                            <span style="font-weight: 600; color: ${getStatusColor(sensor.status)};">
                                ${sensor.status === 'critical' ? 'HIGH' : sensor.status === 'warning' ? 'MEDIUM' : sensor.status === 'offline' ? 'UNKNOWN' : 'LOW'}
                            </span>
                        </div>
                        <div style="background: rgba(100, 116, 139, 0.3); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; background: ${getStatusColor(sensor.status)}; width: ${sensor.status === 'critical' ? '85%' : sensor.status === 'warning' ? '60%' : sensor.status === 'offline' ? '0%' : '25%'}; border-radius: 4px; transition: width 0.3s ease; box-shadow: 0 0 10px ${getStatusColor(sensor.status)}40;"></div>
                        </div>
                    </div>
                    
                    <div style="font-size: 0.9rem; color: #94a3b8;">
                        ${sensor.status === 'critical' ? '⚠️ Immediate attention required. High temperature and smoke detected.' : 
                          sensor.status === 'warning' ? '⚠️ Monitor closely. Elevated readings detected.' :
                          sensor.status === 'offline' ? '🔴 Sensor offline. Check connection and power supply.' : 
                          '✅ All parameters within normal range.'}
                    </div>
                </div>
            `;

            document.getElementById('sensor-modal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('sensor-modal').classList.remove('active');
        }

        // Real-time updates simulation
        function simulateRealTimeUpdates() {
            setInterval(() => {
                sensorData.forEach(sensor => {
                    if (sensor.status !== 'offline') {
                        // Small random variations
                        sensor.temp += (Math.random() - 0.5) * 1.5;
                        sensor.humidity += (Math.random() - 0.5) * 3;
                        sensor.smoke += (Math.random() - 0.5) * 2;
                        sensor.ldr += (Math.random() - 0.5) * 30;
                        
                        // Keep values realistic
                        sensor.temp = Math.max(20, Math.min(50, sensor.temp));
                        sensor.humidity = Math.max(30, Math.min(90, sensor.humidity));
                        sensor.smoke = Math.max(5, Math.min(100, sensor.smoke));
                        sensor.ldr = Math.max(100, Math.min(1000, sensor.ldr));
                        
                        // Update status based on readings
                        if (sensor.temp > 40 || sensor.smoke > 70) {
                            sensor.status = 'critical';
                        } else if (sensor.temp > 35 || sensor.smoke > 30) {
                            sensor.status = 'warning';
                        } else {
                            sensor.status = 'online';
                        }
                    }
                });
                
                updateStatusCounts();
                
                // Refresh current page if it's sensors
                if (currentPage === 'sensors') {
                    loadSensorsPage();
                }
            }, 10000); // Update every 10 seconds
        }

        function updateStatusCounts() {
            const online = sensorData.filter(s => s.status === 'online').length;
            const warning = sensorData.filter(s => s.status === 'warning').length;
            const critical = sensorData.filter(s => s.status === 'critical').length;
            const offline = sensorData.filter(s => s.status === 'offline').length;
            
            document.getElementById('online-count').textContent = online;
            document.getElementById('warning-count').textContent = warning;
            document.getElementById('critical-count').textContent = critical;
            document.getElementById('offline-count').textContent = offline;
        }

        // Initialize everything
        window.addEventListener('load', function() {
            initMap();
            
            simulateRealTimeUpdates();
        });

       
        // Close modal when clicking outside
        document.getElementById('sensor-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

  const temp = document.getElementById("temp").getContext("2d");
  const humidity = document.getElementById("humidity").getContext("2d");
  const ldr = document.getElementById("ldr").getContext("2d");
  const smoke = document.getElementById("smoke").getContext("2d");

  // Temperature Chart 
  const tempChart = new Chart(temp, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // X-axis labels
      datasets: [
        {
          label: "Sensor Data",
          data: [10, 20, 15, 25, 30, 40], // Y-axis values
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          fill: true,
          tension: 0.4, // makes the line smooth
          pointRadius: 5, // size of data points
          pointBackgroundColor: "red",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
      scales: {
        x: { title: { display: true, text: "Months" } },
        y: { title: { display: true, text: "Values" } },
      },
    },
  });
