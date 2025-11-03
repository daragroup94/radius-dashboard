// Google Maps Network Maps JavaScript dengan AdvancedMarkerElement
let map;
let customerMarkers = [];
let odpMarkers = [];
let odcMarkers = [];
let isODPLayerVisible = true;
let isCustomerLayerVisible = true;

// Initialize Google Map
function initGoogleMap() {
    console.log('Initializing Google Maps with AdvancedMarkerElement...');
    
    // Default center (Indonesia)
    const defaultCenter = { lat: -7.7956, lng: 110.3695 }; // Yogyakarta
    
    // Map options
    const mapOptions = {
        zoom: 12,
        center: defaultCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#444444"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#f2f2f2"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": 45}]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
            }
        ]
    };
    
    // Create map
    map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
    
    console.log('Google Maps initialized successfully with AdvancedMarkerElement');
    
    // Load initial data setelah map siap
    google.maps.event.addListenerOnce(map, 'idle', function() {
        loadInitialData();
    });
}

function loadInitialData() {
    console.log('Loading initial data...');
    
    // Load network status
    loadNetworkStatus();
    
    // Load customers for map
    loadCustomersMap();
    
    // Load ODP data
    loadODP();
    
    // Load ODC data
    loadODC();
}

// === FUNGSI UNTUK HTML ONCLICK ===

function toggleODPLayer() {
    console.log('Toggle ODP Layer clicked');
    const btn = document.getElementById('toggleODPBtn');
    
    isODPLayerVisible = !isODPLayerVisible;
    
    if (isODPLayerVisible) {
        // Activate
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-primary');
        showODPMarkers();
        showToast('ODP ditampilkan', 'success');
    } else {
        // Deactivate
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
        hideODPMarkers();
        showToast('ODP disembunyikan', 'info');
    }
}

function toggleCustomerLayer() {
    console.log('Toggle Customer Layer clicked');
    const btn = document.getElementById('toggleCustomerBtn');
    
    isCustomerLayerVisible = !isCustomerLayerVisible;
    
    if (isCustomerLayerVisible) {
        // Activate
        btn.classList.remove('btn-outline-success');
        btn.classList.add('btn-success');
        showCustomerMarkers();
        showToast('Pelanggan ditampilkan', 'success');
    } else {
        // Deactivate
        btn.classList.remove('btn-success');
        btn.classList.add('btn-outline-success');
        hideCustomerMarkers();
        showToast('Pelanggan disembunyikan', 'info');
    }
}

function refreshMap() {
    console.log('Refresh Map clicked');
    
    // Show loading state
    const btn = document.getElementById('refreshBtn');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    btn.disabled = true;
    
    // Show loading spinner
    document.getElementById('loadingSpinner').style.display = 'block';
    
    // Reload all data
    Promise.all([
        loadNetworkStatus(),
        loadCustomersMap(),
        loadODP(),
        loadODC()
    ]).then(() => {
        showToast('Data berhasil diperbarui', 'success');
    }).catch(error => {
        console.error('Error refreshing data:', error);
        showToast('Error memperbarui data', 'error');
    }).finally(() => {
        // Restore button state
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
            document.getElementById('loadingSpinner').style.display = 'none';
        }, 1000);
    });
}

// Filter Functions
function filterByStatus(status) {
    console.log('Filter by Status:', status);
    
    // Hide all customer markers first
    customerMarkers.forEach(marker => marker.map = null);
    
    // Show only filtered markers
    if (status === 'all') {
        customerMarkers.forEach(marker => {
            if (isCustomerLayerVisible) marker.map = map;
        });
    } else {
        // Filter berdasarkan status
        customerMarkers.forEach(marker => {
            const customerStatus = marker.element?.getAttribute('data-status') || 'unknown';
            if (status === 'online' && customerStatus === 'active') {
                marker.map = isCustomerLayerVisible ? map : null;
            } else if (status === 'offline' && customerStatus !== 'active') {
                marker.map = isCustomerLayerVisible ? map : null;
            } else {
                marker.map = null;
            }
        });
    }
    
    showToast(`Filter Status: ${status}`, 'info');
}

function filterByODP(odpId) {
    console.log('Filter by ODP:', odpId);
    showToast(`Filter ODP: ${odpId}`, 'info');
    // Implementation would filter customers by ODP
}

function pingSelectedCustomer() {
    console.log('Ping Selected Customer clicked');
    showToast('Fitur ping akan datang', 'info');
}

// Data Loading Functions
function loadNetworkStatus() {
    return fetch('/api/network/status')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Network status loaded:', data);
            
            // Update statistics cards
            updateStatCard('total-customers', data.total_customers || 0);
            updateStatCard('online-customers', data.online_customers || 0);
            updateStatCard('total-odp', data.total_odp || 0);
            updateStatCard('total-odc', data.total_odc || 0);
            
            return data;
        })
        .catch(error => {
            console.error('Error loading network status:', error);
            
            // Set default values on error
            updateStatCard('total-customers', 0);
            updateStatCard('online-customers', 0);
            updateStatCard('total-odp', 0);
            updateStatCard('total-odc', 0);
            
            throw error;
        });
}

function loadCustomersMap() {
    return fetch('/api/customers/map')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(customers => {
            console.log('Customers map data loaded:', customers.length, 'customers');
            
            // Clear existing markers
            customerMarkers.forEach(marker => marker.map = null);
            customerMarkers = [];
            
            // Create AdvancedMarkerElement for each customer
            customers.forEach(customer => {
                if (customer.lat && customer.lng) {
                    const status = customer.status || 'unknown';
                    
                    // Create custom marker element
                    const element = document.createElement('div');
                    element.className = `customer-marker ${status}`;
                    element.innerHTML = `<div class="customer-dot"></div>`;
                    element.setAttribute('data-status', status);
                    
                    const marker = new google.maps.marker.AdvancedMarkerElement({
                        position: { lat: parseFloat(customer.lat), lng: parseFloat(customer.lng) },
                        map: isCustomerLayerVisible ? map : null,
                        title: customer.full_name,
                        content: element
                    });
                    
                    // Info window
                    const infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div class="p-2" style="min-width: 200px;">
                                <h6 class="font-weight-bold">${customer.full_name}</h6>
                                <p class="mb-1"><strong>Alamat:</strong> ${customer.address || 'Tidak tersedia'}</p>
                                <p class="mb-1"><strong>Status:</strong> 
                                    <span class="badge ${status === 'active' ? 'bg-success' : 'bg-secondary'}">
                                        ${status}
                                    </span>
                                </p>
                                <button class="btn btn-sm btn-primary w-100 mt-2" onclick="showCustomerDetails(${customer.id})">
                                    Lihat Detail
                                </button>
                            </div>
                        `
                    });
                    
                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                    
                    customerMarkers.push(marker);
                }
            });
            
            if (customers.length > 0) {
                showToast(`${customers.length} pelanggan dimuat di peta`, 'success');
            }
            
            return customers;
        })
        .catch(error => {
            console.error('Error loading customers map:', error);
            showToast('Error memuat data pelanggan', 'error');
            throw error;
        });
}

function loadODP() {
    return fetch('/api/network/odp')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(odpList => {
            console.log('ODP data loaded:', odpList.length, 'ODP');
            
            // Clear existing markers
            odpMarkers.forEach(marker => marker.map = null);
            odpMarkers = [];
            
            // Create markers for each ODP
            odpList.forEach(odp => {
                if (odp.latitude && odp.longitude) {
                    const element = document.createElement('div');
                    element.innerHTML = '📡';
                    element.style.fontSize = '20px';
                    element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
                    
                    const marker = new google.maps.marker.AdvancedMarkerElement({
                        position: { lat: parseFloat(odp.latitude), lng: parseFloat(odp.longitude) },
                        map: isODPLayerVisible ? map : null,
                        title: odp.name,
                        content: element
                    });
                    
                    const infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div class="p-2" style="min-width: 200px;">
                                <h6 class="font-weight-bold">${odp.name}</h6>
                                <p class="mb-1"><strong>Kapasitas:</strong> ${odp.capacity} port</p>
                                <p class="mb-1"><strong>Port Terpakai:</strong> ${odp.used_ports || 0}</p>
                                <p class="mb-1"><strong>Alamat:</strong> ${odp.address || 'Tidak tersedia'}</p>
                                <button class="btn btn-sm btn-info w-100 mt-2" onclick="viewODPCustomers(${odp.id})">
                                    Lihat Pelanggan
                                </button>
                            </div>
                        `
                    });
                    
                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                    
                    odpMarkers.push(marker);
                }
            });
            
            // Update ODP filter dropdown
            updateODPFilter(odpList);
            
            if (odpList.length > 0) {
                showToast(`${odpList.length} ODP dimuat di peta`, 'success');
            }
            
            return odpList;
        })
        .catch(error => {
            console.error('Error loading ODP:', error);
            showToast('Error memuat data ODP', 'error');
            throw error;
        });
}

function loadODC() {
    return fetch('/api/network/odc')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(odcList => {
            console.log('ODC data loaded:', odcList.length, 'ODC');
            
            // Clear existing markers
            odcMarkers.forEach(marker => marker.map = null);
            odcMarkers = [];
            
            // Create markers for each ODC
            odcList.forEach(odc => {
                if (odc.latitude && odc.longitude) {
                    const element = document.createElement('div');
                    element.innerHTML = '🏢';
                    element.style.fontSize = '24px';
                    element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
                    
                    const marker = new google.maps.marker.AdvancedMarkerElement({
                        position: { lat: parseFloat(odc.latitude), lng: parseFloat(odc.longitude) },
                        map: isODPLayerVisible ? map : null,
                        title: odc.name,
                        content: element
                    });
                    
                    const infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div class="p-2" style="min-width: 200px;">
                                <h6 class="font-weight-bold">${odc.name}</h6>
                                <p class="mb-1"><strong>Kapasitas:</strong> ${odc.capacity} port</p>
                                <p class="mb-1"><strong>Alamat:</strong> ${odc.address || 'Tidak tersedia'}</p>
                            </div>
                        `
                    });
                    
                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                    
                    odcMarkers.push(marker);
                }
            });
            
            if (odcList.length > 0) {
                showToast(`${odcList.length} ODC dimuat di peta`, 'success');
            }
            
            return odcList;
        })
        .catch(error => {
            console.error('Error loading ODC:', error);
            showToast('Error memuat data ODC', 'error');
            throw error;
        });
}

// Marker Visibility Functions
function showODPMarkers() {
    odpMarkers.forEach(marker => marker.map = map);
    odcMarkers.forEach(marker => marker.map = map);
}

function hideODPMarkers() {
    odpMarkers.forEach(marker => marker.map = null);
    odcMarkers.forEach(marker => marker.map = null);
}

function showCustomerMarkers() {
    customerMarkers.forEach(marker => marker.map = map);
}

function hideCustomerMarkers() {
    customerMarkers.forEach(marker => marker.map = null);
}

// Helper Functions
function updateStatCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function updateODPFilter(odpList) {
    const select = document.querySelector('select[onchange="filterByODP(this.value)"]');
    if (!select) return;
    
    // Save current selection
    const currentValue = select.value;
    
    // Clear and repopulate options
    select.innerHTML = '<option value="all">Semua ODP</option>';
    
    odpList.forEach(odp => {
        const option = document.createElement('option');
        option.value = odp.id;
        option.textContent = odp.name;
        select.appendChild(option);
    });
    
    // Restore selection if possible
    if (currentValue && currentValue !== 'all') {
        select.value = currentValue;
    }
}

function showToast(message, type = 'info') {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `alert alert-${getAlertClass(type)} alert-dismissible fade show custom-toast`;
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

function getAlertClass(type) {
    switch(type) {
        case 'success': return 'success';
        case 'error': return 'danger';
        case 'warning': return 'warning';
        default: return 'info';
    }
}

// Additional functions for info windows
function showCustomerDetails(customerId) {
    console.log('Show customer details:', customerId);
    showToast(`Membuka detail pelanggan ID: ${customerId}`, 'info');
}

function viewODPCustomers(odpId) {
    console.log('View ODP customers:', odpId);
    showToast(`Melihat pelanggan ODP ID: ${odpId}`, 'info');
}

// Make functions globally available
window.initGoogleMap = initGoogleMap;
window.toggleODPLayer = toggleODPLayer;
window.toggleCustomerLayer = toggleCustomerLayer;
window.refreshMap = refreshMap;
window.filterByStatus = filterByStatus;
window.filterByODP = filterByODP;
window.pingSelectedCustomer = pingSelectedCustomer;
window.showCustomerDetails = showCustomerDetails;
window.viewODPCustomers = viewODPCustomers;
