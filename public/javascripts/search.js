// Search functionality with live search
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const mapElement = document.getElementById('map');
    const pageTitle = document.querySelector('h1');
    let searchTimeout;
    let isSearching = false;

    if (searchInput) {
        // Live search as user types
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.trim();

            // Only search if on campgrounds page and has 1+ characters
            if (window.location.pathname === '/campgrounds' && searchTerm.length >= 1) {
                isSearching = true;
                hideMapAndContent();
                searchTimeout = setTimeout(() => {
                    performSearch(searchTerm);
                }, 300); // Wait 300ms after user stops typing
            } else if (searchTerm.length === 0) {
                // Show all campgrounds when search is cleared
                if (window.location.pathname === '/campgrounds') {
                    isSearching = false;
                    showMapAndContent();
                    location.reload();
                }
            }
        });

        // Enter key search
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value.trim();

                if (searchTerm) {
                    if (window.location.pathname === '/campgrounds') {
                        isSearching = true;
                        hideMapAndContent();
                        performSearch(searchTerm);
                    } else {
                        window.location.href = `/campgrounds?search=${encodeURIComponent(searchTerm)}`;
                    }
                }
            }
        });

        // Search button click
        if (searchBtn) {
            searchBtn.addEventListener('click', function () {
                const searchTerm = searchInput.value.trim();

                if (searchTerm) {
                    if (window.location.pathname === '/campgrounds') {
                        isSearching = true;
                        hideMapAndContent();
                        performSearch(searchTerm);
                    } else {
                        window.location.href = `/campgrounds?search=${encodeURIComponent(searchTerm)}`;
                    }
                }
            });
        }
    }

    // Function to hide map and content during search
    function hideMapAndContent() {
        document.body.classList.add('search-active');

        if (mapElement) {
            mapElement.style.display = 'none';
        }

        // Hide the page title
        const pageTitle = document.querySelector('h1');
        if (pageTitle) {
            pageTitle.style.display = 'none';
        }

        // Hide clear search button if exists
        const clearSearchBtn = document.querySelector('.btn-outline-secondary');
        if (clearSearchBtn && clearSearchBtn.textContent.includes('Clear Search')) {
            clearSearchBtn.style.display = 'none';
        }
    }

    // Function to show map and content
    function showMapAndContent() {
        document.body.classList.remove('search-active');

        if (mapElement) {
            mapElement.style.display = 'block';
        }

        // Show the page title
        const pageTitle = document.querySelector('h1');
        if (pageTitle) {
            pageTitle.style.display = 'block';
        }

        // Show clear search button if exists
        const clearSearchBtn = document.querySelector('.btn-outline-secondary');
        if (clearSearchBtn && clearSearchBtn.textContent.includes('Clear Search')) {
            clearSearchBtn.style.display = 'block';
        }
    }

    // Function to perform live search
    function performSearch(searchTerm) {
        const campgroundCards = document.querySelectorAll('.card.mb-3');
        let visibleCount = 0;

        campgroundCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
            const location = card.querySelector('.text-muted')?.textContent.toLowerCase() || '';

            const searchLower = searchTerm.toLowerCase();

            if (title.includes(searchLower) ||
                description.includes(searchLower) ||
                location.includes(searchLower)) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show "No results" message if needed
        showNoResultsMessage(visibleCount, searchTerm);
    }

    // Function to show/hide no results message
    function showNoResultsMessage(visibleCount, searchTerm) {
        let noResultsDiv = document.getElementById('no-results-message');

        if (visibleCount === 0 && searchTerm.length > 0) {
            if (!noResultsDiv) {
                noResultsDiv = document.createElement('div');
                noResultsDiv.id = 'no-results-message';
                noResultsDiv.className = 'no-results-container';
                noResultsDiv.innerHTML = `
                <div class="no-results-content">
                    <div class="no-results-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>No campgrounds found</h3>
                    <p>We couldn't find any campgrounds matching "<strong class="search-term">${searchTerm}</strong>"</p>
                    <div class="no-results-actions">
                        <button class="btn btn-primary" onclick="clearSearch()">
                            <i class="fas fa-list me-2"></i>View All Campgrounds
                        </button>
                        <button class="btn btn-outline-secondary" onclick="document.querySelector('.search-input').focus()">
                            <i class="fas fa-edit me-2"></i>Try Different Keywords
                        </button>
                    </div>
                </div>
            `;

                // Insert after the map element or main container
                const mainContainer = document.querySelector('main') || document.querySelector('.container');
                if (mainContainer) {
                    const existingContent = mainContainer.querySelector('#map') || mainContainer.querySelector('h1');
                    if (existingContent) {
                        existingContent.insertAdjacentElement('afterend', noResultsDiv);
                    } else {
                        mainContainer.appendChild(noResultsDiv);
                    }
                }
            } else {
                noResultsDiv.querySelector('.search-term').textContent = searchTerm;
            }
        } else {
            if (noResultsDiv) {
                noResultsDiv.remove();
            }
        }
    }

    // Function to clear search
    window.clearSearch = function () {
        if (searchInput) {
            searchInput.value = '';
            isSearching = false;
            showMapAndContent();
            location.reload();
        }
    }
});