document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const sneakerList = document.getElementById('sneakerList');
    let currentPage = 1;
    const limit = 10;
    let isLoading = false; // To prevent multiple calls during scrolling
    const usernameElem = document.getElementById('username');
    const filterContainer = document.querySelector('.flex.space-x-2.mb-4');

    // Fetch and display the username
    function fetchUsername() {
        return fetch('http://localhost:3000/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return response.json();
        })
        .then(data => {
            const username = data.username;
            updateGreetingAndUsername(username);
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while fetching user data.');
        });
    }

    // Update greeting and username in the header
    function updateGreetingAndUsername(username) {
        const hours = new Date().getHours();
        let greetingText = "Good Morning";

        if (hours >= 12 && hours < 18) {
            greetingText = "Good Afternoon";
        } else if (hours >= 18) {
            greetingText = "Good Evening";
        }

        usernameElem.textContent = `${greetingText} ${username}`;
    }

    // Fetch sneaker brands and update filter buttons
    function fetchBrands() {
        return fetch('http://localhost:3000/sneaker/brands', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch brands');
            }
            return response.json();
        })
        .then(brands => {
            updateFilterButtons(brands);
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while fetching brands.');
        });
    }

    // Update filter buttons based on available brands
    function updateFilterButtons(brands) {
        const buttons = {
            'All': 'All',
            'NIKE': 'Nike',
            'ADIDAS': 'Adidas',
            'PUMA': 'Puma',
            'ASICS': 'Asics'
        };

        filterContainer.innerHTML = ''; // Clear existing buttons
        Object.keys(buttons).forEach(key => {
            if (brands.includes(key.toUpperCase())) {
                const button = document.createElement('button');
                button.className = 'filter-btn bg-gray-200 text-black rounded-full px-4 py-2';
                button.textContent = buttons[key];
                button.addEventListener('click', () => filterSneakers(button.textContent));
                filterContainer.appendChild(button);
            }
        });
    }

    // Fetch sneakers with optional brand filter
    function fetchSneakers(page, limit, brand) {
        let url = `http://localhost:3000/sneaker?page=${page}&limit=${limit}`;
        if (brand && brand !== 'All') {
            url += `&brands=${brand.toUpperCase()}`;
        }

        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch sneakers');
            }
            return response.json();
        })
        .then(data => data);
    }

    function renderSneakers(sneakers) {
        sneakers.forEach(sneaker => {
            const sneakerItem = document.createElement('div');
            sneakerItem.className = 'bg-gray-100 p-4 rounded-lg';
            sneakerItem.innerHTML = `
                <img src="${sneaker.imageURL}" alt="${sneaker.name}" class="w-full h-40 object-cover mb-2 rounded-md">
                <h3 class="text-gray-800 font-semibold text-sm truncate">${sneaker.name}</h3>
                <p class="text-gray-600">$${sneaker.price.toFixed(2)}</p>
            `;
            sneakerList.appendChild(sneakerItem);
        });
    }

    function loadSneakers(brand) {
        if (isLoading) return; // Prevent loading if already in process
        isLoading = true;

        fetchSneakers(currentPage, limit, brand).then(data => {
            if (data.data.length > 0) {
                renderSneakers(data.data);
                currentPage++;
                isLoading = false;
                if (currentPage > data.totalPages) {
                    window.removeEventListener('scroll', handleScroll);
                }
            } else {
                isLoading = false; // No more items to load
            }
        }).catch(error => {
            console.error(error);
            alert('An error occurred while loading sneakers.');
            isLoading = false;
        });
    }

    function handleScroll() {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;

        if (currentScroll + 100 >= scrollableHeight) {
            console.log('Fetching more sneakers...');
            loadSneakers();
        }
    }

    function filterSneakers(brand) {
        currentPage = 1; // Reset page number when filtering
        sneakerList.innerHTML = ''; // Clear the list when filtering
        loadSneakers(brand);
    }

    window.addEventListener('scroll', handleScroll);

    // Initialize page by fetching user data and sneaker brands
    fetchUsername();
    fetchBrands();

    // Load initial sneakers on page load
    loadSneakers();
});
