/**
 * ==================== NAVIGATION MODULE ====================
 * Menu and tab switching for Cantonese Playground
 * Includes: Main menu, submenus, tab switching, dropdown
 * ================================================================
 */

// ==================== STATE ====================

let mainMenuOpen = false;
const submenuTimers = {};

// ==================== MAIN MENU FUNCTIONS ====================

/**
 * Toggle main menu visibility
 */
function toggleMainMenu() {
    const menu = document.getElementById('mainMenu');
    if (!menu) return;

    mainMenuOpen = !mainMenuOpen;
    menu.style.display = mainMenuOpen ? 'block' : 'none';

    // Update ARIA attributes
    const menuBtn = document.getElementById('mainMenuBtn');
    if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', mainMenuOpen.toString());
    }

    if (mainMenuOpen) {
        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeMainMenuOnClickOutside);
        }, 10);

        // Trap focus in menu for accessibility
        if (typeof focusManager !== 'undefined') {
            focusManager.trapFocus(menu);
        }
    } else {
        document.removeEventListener('click', closeMainMenuOnClickOutside);
        hideAllSubmenus();

        // Restore focus
        if (typeof focusManager !== 'undefined') {
            focusManager.restoreFocus();
        }
    }
}

/**
 * Close main menu
 */
function closeMainMenu() {
    const menu = document.getElementById('mainMenu');
    if (!menu) return;

    menu.style.display = 'none';
    mainMenuOpen = false;

    const menuBtn = document.getElementById('mainMenuBtn');
    if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    document.removeEventListener('click', closeMainMenuOnClickOutside);
    hideAllSubmenus();
}

/**
 * Close main menu when clicking outside
 * @param {Event} e - Click event
 */
function closeMainMenuOnClickOutside(e) {
    const menuContainer = document.getElementById('mainMenuContainer');
    if (menuContainer && !menuContainer.contains(e.target)) {
        closeMainMenu();
    }
}

// ==================== SUBMENU FUNCTIONS ====================

/**
 * Show a submenu (or toggle on mobile)
 * @param {string} menuId - Submenu identifier
 */
function showSubmenu(menuId) {
    // Clear any pending hide timer for this submenu
    if (submenuTimers[menuId]) {
        clearTimeout(submenuTimers[menuId]);
        submenuTimers[menuId] = null;
    }

    const submenu = document.getElementById('submenu-' + menuId);
    const isMobile = window.innerWidth <= 768;

    // On mobile, toggle the submenu
    if (isMobile && submenu) {
        const isVisible = submenu.style.display === 'block';

        // Hide all submenus first
        const allSubmenus = document.querySelectorAll('.submenu');
        allSubmenus.forEach(s => {
            s.style.display = 'none';
        });

        // If it wasn't visible, show it
        if (!isVisible) {
            submenu.style.display = 'block';
        }
        return;
    }

    // Desktop behavior: hide other submenus first
    const allSubmenus = document.querySelectorAll('.submenu');
    allSubmenus.forEach(s => {
        if (s.id !== 'submenu-' + menuId) {
            s.style.display = 'none';
        }
    });

    if (submenu) {
        submenu.style.display = 'block';
    }
}

/**
 * Hide a submenu after a delay
 * @param {string} menuId - Submenu identifier
 */
function hideSubmenuDelayed(menuId) {
    submenuTimers[menuId] = setTimeout(() => {
        const submenu = document.getElementById('submenu-' + menuId);
        if (submenu) {
            submenu.style.display = 'none';
        }
    }, 200);
}

/**
 * Hide all submenus immediately
 */
function hideAllSubmenus() {
    const submenus = document.querySelectorAll('.submenu');
    submenus.forEach(submenu => {
        submenu.style.display = 'none';
    });

    // Clear all timers
    Object.keys(submenuTimers).forEach(key => {
        if (submenuTimers[key]) {
            clearTimeout(submenuTimers[key]);
            submenuTimers[key] = null;
        }
    });
}

/**
 * Position submenu properly on mobile screens
 * @param {HTMLElement} submenu
 */
function positionSubmenuMobile(submenu) {
    const rect = submenu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Reset position
    submenu.style.left = '';
    submenu.style.right = '';
    submenu.style.top = '';

    // Check if submenu overflows right edge
    if (rect.right > viewportWidth) {
        submenu.style.left = 'auto';
        submenu.style.right = '0';
    }

    // Check if submenu overflows bottom
    if (rect.bottom > viewportHeight) {
        submenu.style.maxHeight = (viewportHeight - rect.top - 20) + 'px';
    }
}

// ==================== TAB SWITCHING ====================

/**
 * Switch to a different content tab
 * @param {string} tabName - Name of tab to switch to
 */
function switchTab(tabName) {
    // Deactivate all tabs and dropdown items
    const tabs = document.querySelectorAll('.tab');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(tab => tab.classList.remove('active'));
    dropdownItems.forEach(item => item.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    // Find and activate the clicked tab (for regular tabs)
    tabs.forEach(tab => {
        const onclick = tab.getAttribute('onclick');
        if (onclick && onclick.includes(`'${tabName}'`)) {
            tab.classList.add('active');
        }
    });

    // Find and activate the clicked dropdown item
    dropdownItems.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(`'${tabName}'`)) {
            item.classList.add('active');
        }
    });

    // Activate the content section
    const tabElement = document.getElementById(tabName);
    if (tabElement) {
        tabElement.classList.add('active');

        // Scroll to top of content
        tabElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Track section visit for progress
    if (typeof trackSectionVisit === 'function') {
        trackSectionVisit(tabName);
    }

    // Initialize specific tab content
    initTabContent(tabName);

    // Update URL hash for direct linking (optional)
    if (history.pushState) {
        history.pushState(null, null, '#' + tabName);
    }

    // Close main menu after selection
    closeMainMenu();
}

/**
 * Initialize specific tab content
 * @param {string} tabName
 */
function initTabContent(tabName) {
    // Initialize unified test sections (test1-test5)
    if (['test1', 'test2', 'test3', 'test4', 'test5'].includes(tabName)) {
        if (typeof initUnifiedTest === 'function') {
            initUnifiedTest(tabName);
        }
        return;
    }

    // Initialize speaking test (test6)
    if (tabName === 'test6') {
        if (typeof initSpeakingTest === 'function') {
            initSpeakingTest();
        }
        return;
    }

    // Legacy test initialization
    if (tabName === 'test') {
        if (typeof initTest === 'function') {
            initTest();
        }
    }

    if (tabName === 'beginnerTest') {
        if (typeof initBeginnerTest === 'function') {
            initBeginnerTest();
        }
    }

    if (tabName === 'intermediateTest') {
        if (typeof initIntermediateTest === 'function') {
            initIntermediateTest();
        }
    }

    if (tabName === 'advancedTest') {
        if (typeof initAdvancedTest === 'function') {
            initAdvancedTest();
        }
    }

    // Initialize practice canvases when switching to write tabs
    if (tabName.startsWith('write-')) {
        setTimeout(() => {
            if (typeof initPracticeCanvases === 'function') {
                initPracticeCanvases();
            }
        }, 100);
    }

    // Initialize favorites view
    if (tabName === 'favorites') {
        if (typeof renderFavoritesView === 'function') {
            renderFavoritesView();
        }
    }
}

// ==================== DROPDOWN FUNCTIONS ====================

/**
 * Toggle dropdown menu
 * @param {Event} event - Click event
 */
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = event.currentTarget.closest('.dropdown');
    const content = dropdown.querySelector('.dropdown-content');

    // Close all other dropdowns
    closeAllDropdowns();

    // Toggle this dropdown
    content.classList.toggle('show');

    // Update ARIA
    event.currentTarget.setAttribute('aria-expanded', content.classList.contains('show'));
}

/**
 * Close all dropdown menus
 */
function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });

    // Update ARIA
    const buttons = document.querySelectorAll('.dropdown-btn');
    buttons.forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
    });
}

// ==================== URL HASH NAVIGATION ====================

/**
 * Handle navigation from URL hash
 */
function handleHashNavigation() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const tabElement = document.getElementById(hash);
        if (tabElement && tabElement.classList.contains('content')) {
            switchTab(hash);
        }
    }
}

// ==================== INITIALIZATION ====================

/**
 * Initialize navigation module
 */
function initNavigation() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });

    // Setup dropdown item clicks
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            closeAllDropdowns();
        });
    });

    // Keep submenu open when hovering over it
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.addEventListener('mouseenter', function() {
            const menuId = this.id.replace('submenu-', '');
            if (submenuTimers[menuId]) {
                clearTimeout(submenuTimers[menuId]);
                submenuTimers[menuId] = null;
            }
        });

        submenu.addEventListener('mouseleave', function() {
            const menuId = this.id.replace('submenu-', '');
            hideSubmenuDelayed(menuId);
        });
    });

    // Handle URL hash on page load
    handleHashNavigation();

    // Handle browser back/forward
    window.addEventListener('popstate', handleHashNavigation);

    // Handle keyboard navigation in menus
    document.addEventListener('keydown', (e) => {
        if (!mainMenuOpen) return;

        const menu = document.getElementById('mainMenu');
        if (!menu) return;

        const focusableItems = menu.querySelectorAll('.menu-item, .submenu-item');
        const currentIndex = Array.from(focusableItems).indexOf(document.activeElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % focusableItems.length;
                focusableItems[nextIndex].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex <= 0 ? focusableItems.length - 1 : currentIndex - 1;
                focusableItems[prevIndex].focus();
                break;
            case 'ArrowRight':
                // Open submenu if available
                const menuContainer = document.activeElement.closest('.menu-item-container');
                if (menuContainer) {
                    const submenuId = menuContainer.querySelector('.submenu')?.id.replace('submenu-', '');
                    if (submenuId) {
                        showSubmenu(submenuId);
                        const firstSubmenuItem = menuContainer.querySelector('.submenu-item');
                        if (firstSubmenuItem) firstSubmenuItem.focus();
                    }
                }
                break;
            case 'ArrowLeft':
                // Close submenu
                hideAllSubmenus();
                break;
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}

// Export for use in other modules
window.CantoneseNavigation = {
    toggleMainMenu,
    closeMainMenu,
    showSubmenu,
    hideSubmenuDelayed,
    hideAllSubmenus,
    switchTab,
    toggleDropdown,
    closeAllDropdowns,
    handleHashNavigation
};

// Also export individual functions for backward compatibility
window.toggleMainMenu = toggleMainMenu;
window.closeMainMenu = closeMainMenu;
window.showSubmenu = showSubmenu;
window.hideSubmenuDelayed = hideSubmenuDelayed;
window.hideAllSubmenus = hideAllSubmenus;
window.switchTab = switchTab;
window.toggleDropdown = toggleDropdown;
window.closeAllDropdowns = closeAllDropdowns;
