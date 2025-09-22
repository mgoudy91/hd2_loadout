// main.js - Entry point for Helldivers 2 Loadout Builder (module)
import {
    getWeaponType,
    getSlotBadge,
    renderTable,
    selectWeapon,
    updateSummary,
    checkLoadoutConflicts
} from './ui.js';

// App state
let weapons = null;
let weaponsLoaded = false;
let selectedLoadout = {
    primary: null,
    secondary: null,
    grenade: null,
    stratagems: []
};
let currentFaction = 'terminids';

// Durable storage for warbond selections: prefer localStorage, fallback to cookies (30 days)
const STORAGE_KEY = 'hl2_selected_warbonds';

function setCookie(name, value, days) {
    try {
        const expires = new Date(Date.now() + (days || 30) * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    } catch (e) {
        console.warn('Could not set cookie', e);
    }
}

function getCookie(name) {
    try {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, undefined);
    } catch (e) {
        console.warn('Could not read cookie', e);
        return undefined;
    }
}

function saveWarbondSelections() {
    const selected = Array.from(document.querySelectorAll('.warbond-filter'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    // Try localStorage first
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
        return;
    } catch (e) {
        // localStorage may be unavailable (strict privacy modes), fall back to cookies
        console.warn('localStorage unavailable, falling back to cookies', e);
    }
    // Cookie fallback (30 days)
    try {
        setCookie(STORAGE_KEY, JSON.stringify(selected), 30);
    } catch (e) {
        console.warn('Could not save warbond selections to cookie', e);
    }
}

function loadWarbondSelections() {
    // Try localStorage first
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const values = JSON.parse(raw);
            if (Array.isArray(values)) {
                document.querySelectorAll('.warbond-filter').forEach(cb => {
                    cb.checked = values.includes(cb.value);
                });
                return true;
            }
        }
    } catch (e) {
        console.warn('Could not load from localStorage, trying cookies', e);
    }
    // Cookie fallback
    try {
        const rawCookie = getCookie(STORAGE_KEY);
        if (!rawCookie) return false;
        const values = JSON.parse(rawCookie);
        if (!Array.isArray(values)) return false;
        document.querySelectorAll('.warbond-filter').forEach(cb => {
            cb.checked = values.includes(cb.value);
        });
        return true;
    } catch (e) {
        console.warn('Could not load warbond selections from cookie', e);
        return false;
    }
}

// Fetch weapon data
fetch('weaponDatabase.json')
    .then(response => response.json())
    .then(data => {
        weapons = data;
        weaponsLoaded = true;
        renderTable({ weapons, weaponsLoaded, selectedLoadout, currentFaction });
        updateSummary({ weapons, selectedLoadout, currentFaction });
        checkLoadoutConflicts({ weapons, selectedLoadout });
    });

// Attach event handlers
document.getElementById('faction-select').addEventListener('change', (e) => {
    currentFaction = e.target.value;
    renderTable({ weapons, weaponsLoaded, selectedLoadout, currentFaction });
    updateSummary({ weapons, selectedLoadout, currentFaction });
    checkLoadoutConflicts({ weapons, selectedLoadout });
});

document.querySelectorAll('.warbond-filter').forEach(cb => {
    cb.addEventListener('change', () => {
        saveWarbondSelections();
        renderTable({ weapons, weaponsLoaded, selectedLoadout, currentFaction });
        updateSummary({ weapons, selectedLoadout, currentFaction });
        checkLoadoutConflicts({ weapons, selectedLoadout });
    });
});

// Attempt to restore saved selections on load; if none saved, keep defaults
loadWarbondSelections();

document.getElementById('reset-loadout').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset your selected loadout? This will clear all selected weapons and stratagems.')) {
        selectedLoadout = {
            primary: null,
            secondary: null,
            grenade: null,
            stratagems: []
        };
        renderTable({ weapons, weaponsLoaded, selectedLoadout, currentFaction });
        updateSummary({ weapons, selectedLoadout, currentFaction });
        checkLoadoutConflicts({ weapons, selectedLoadout });
    }
});

document.getElementById('select-all-warbonds').addEventListener('click', () => {
    document.querySelectorAll('.warbond-filter').forEach(cb => {
        cb.checked = true;
    });
    saveWarbondSelections();
    renderTable({ weapons, weaponsLoaded, selectedLoadout, currentFaction });
    updateSummary({ weapons, selectedLoadout, currentFaction });
    checkLoadoutConflicts({ weapons, selectedLoadout });
});

document.getElementById('select-none-warbonds').addEventListener('click', () => {
    document.querySelectorAll('.warbond-filter').forEach(cb => {
        cb.checked = false;
    });
    saveWarbondSelections();
    renderTable({ weapons, weaponsLoaded, selectedLoadout, currentFaction });
    updateSummary({ weapons, selectedLoadout, currentFaction });
    checkLoadoutConflicts({ weapons, selectedLoadout });
});
