const columnsByFaction = {
    terminids: [
        { key: 'light', label: 'Light Pen', group: 'General' },
        { key: 'medium', label: 'Med Pen', group: 'General' },
        { key: 'heavy', label: 'Heavy Pen', group: 'General' },
        { key: 'bugnest', label: 'Bug Nest', group: 'Objectives' },
        { key: 'charger', label: 'Charger', group: 'Medium' },
        { key: 'biletitan', label: 'Bile Titan', group: 'Heavy' }
    ],
    automatons: [
        { key: 'light', label: 'Light Pen', group: 'General' },
        { key: 'medium', label: 'Med Pen', group: 'General' },
        { key: 'heavy', label: 'Heavy Pen', group: 'General' },
        { key: 'factory', label: 'Factory', group: 'Objectives' },
        { key: 'hulk', label: 'Hulk', group: 'Medium' },
        { key: 'strider', label: 'Strider', group: 'Heavy' }
    ],
    illuminates: [
        { key: 'light', label: 'Light Pen', group: 'General' },
        { key: 'medium', label: 'Med Pen', group: 'General' },
        { key: 'heavy', label: 'Heavy Pen', group: 'General' },
        { key: 'warpship', label: 'Warp Ship', group: 'Objectives' },
        { key: 'harvester', label: 'Harvester', group: 'Heavy' },
        { key: 'voteless', label: 'Voteless', group: 'Swarms' }
    ],
    all: [
        { key: 'light', label: 'Light', group: 'General' },
        { key: 'medium', label: 'Med', group: 'General' },
        { key: 'heavy', label: 'Heavy', group: 'General' },
        { key: 'bugnest', label: 'Bug Nest', group: 'Terminids' },
        { key: 'charger', label: 'Charger', group: 'Terminids' },
        { key: 'biletitan', label: 'Bile Titan', group: 'Terminids' },
        { key: 'factory', label: 'Factory', group: 'Automatons' },
        { key: 'hulk', label: 'Hulk', group: 'Automatons' },
        { key: 'strider', label: 'Strider', group: 'Automatons' },
        { key: 'warpship', label: 'Warp Ship', group: 'Illuminates' },
        { key: 'harvester', label: 'Harvester', group: 'Illuminates' },
        { key: 'voteless', label: 'Voteless', group: 'Illuminates' }
    ]
};


function renderTable({ weapons, weaponsLoaded, selectedLoadout, currentFaction }) {
    if (!weaponsLoaded) return;
    const table = document.getElementById('main-table');
    const columns = columnsByFaction[currentFaction];
    const selectedWarbonds = Array.from(document.querySelectorAll('.warbond-filter:checked')).map(cb => cb.value);
    const grantedNames = (weapons.grantedStratagems || []).map(w => w.name);

    // Build header
    const groups = [...new Set(columns.map(c => c.group))];
    const headerHTML = `
                <thead>
                    <tr>
                        <th rowspan="2">Loadout Option</th>
                        ${groups.map(g => {
        const count = columns.filter(c => c.group === g).length;
        return `<th colspan="${count}" class="header-group">${g}</th>`;
    }).join('')}
                    </tr>
                    <tr>
                        ${columns.map(c => `<th>${c.label}</th>`).join('')}
                    </tr>
                </thead>
            `;

    // Build body
    let bodyHTML = '<tbody>';

    ['primary', 'secondary', 'grenade', 'stratagem'].forEach(category => {
        // Determine if section should be collapsed
        const isSelected = category === 'stratagem' ?
            selectedLoadout.stratagems.length === 4 :
            selectedLoadout[category] !== null;
        const isCollapsed = isSelected;

        // Create collapse indicator
        const collapseIndicator = isSelected ?
            (category === 'stratagem' ?
                '<span class="collapse-indicator">- 4/4 selected (click any selected to expand)</span>' :
                '<span class="collapse-indicator">- selected (click selected weapon to expand)</span>') :
            '';

        if (category === 'primary') {
            // Special handling for primary weapons - group by weapon type
            const categoryName = 'PRIMARY WEAPONS';
            bodyHTML += `<tr class="category-header ${isCollapsed ? 'collapsed-section' : ''}" data-section="${category}"><td colspan="${columns.length + 1}">${categoryName}${collapseIndicator}</td></tr>`;

            // Group primary weapons by type
            const filteredPrimaryWeapons = weapons[category].filter(w => selectedWarbonds.includes(w.warbond));
            const weaponsByType = {};

            // Define the order of weapon types to match Helldivers 2
            const typeOrder = ['Assault Rifle', 'Marksman Rifle', 'Submachine Gun', 'Shotgun', 'Explosive', 'Energy-Based', 'Support', 'Special'];

            // Group weapons by type
            filteredPrimaryWeapons.forEach(weapon => {
                // Use the weapon's type field if it exists, otherwise use runtime classification
                const type = weapon.type || getWeaponType(weapon.name);
                if (!weaponsByType[type]) {
                    weaponsByType[type] = [];
                }
                weaponsByType[type].push(weapon);
            });

            // Render each weapon type group
            typeOrder.forEach(type => {
                if (weaponsByType[type] && weaponsByType[type].length > 0) {
                    // Add weapon type subheader
                    bodyHTML += `<tr class="weapon-type-header ${isCollapsed ? 'collapsed-section' : ''}" data-section="${category}" style="background: #3a3a3a; font-weight: 600; color: #ffd700;"><td colspan="${columns.length + 1}">  ${type}</td></tr>`;

                    // Add weapons of this type
                    weaponsByType[type].forEach(weapon => {
                        const isWeaponSelected = selectedLoadout[category] === weapon.name;

                        bodyHTML += `
                                    <tr class="weapon-row ${isWeaponSelected ? 'selected-row' : ''} ${isCollapsed ? 'collapsed-section' : ''}" 
                                        data-category="${category}" 
                                        data-weapon="${weapon.name}"
                                        data-section="${category}"
                                        style="cursor: pointer;">
                                        <td class="weapon-name">${weapon.name}${weapon.slot ? getSlotBadge(weapon.slot) : ''}</td>
                                        ${columns.map(c => `<td class="${weapon[c.key]}"></td>`).join('')}
                                    </tr>
                                `;
                    });
                }
            });
        } else {
            // Group secondary and grenade by type, stratagems remain flat
            const categoryName = category === 'stratagem' ?
                `STRATAGEMS (${selectedLoadout.stratagems.length}/4 selected)` :
                category.toUpperCase() + ' WEAPONS';
            bodyHTML += `<tr class="category-header ${isCollapsed ? 'collapsed-section' : ''}" data-section="${category}"><td colspan="${columns.length + 1}">${categoryName}${collapseIndicator}</td></tr>`;

            if (category === 'secondary') {
                // Official in-game order for secondary types
                const typeOrder = ['Pistol', 'Revolver', 'Special', 'Melee'];
                const filtered = weapons[category].filter(w => selectedWarbonds.includes(w.warbond));
                const weaponsByType = {};
                filtered.forEach(weapon => {
                    const type = weapon.type || 'Special';
                    if (!weaponsByType[type]) weaponsByType[type] = [];
                    weaponsByType[type].push(weapon);
                });
                typeOrder.forEach(type => {
                    if (weaponsByType[type] && weaponsByType[type].length > 0) {
                        bodyHTML += `<tr class="weapon-type-header ${isCollapsed ? 'collapsed-section' : ''}" data-section="${category}" style="background: #3a3a3a; font-weight: 600; color: #ffd700;"><td colspan="${columns.length + 1}">${type}</td></tr>`;
                        weaponsByType[type].forEach(weapon => {
                            const isWeaponSelected = selectedLoadout[category] === weapon.name;
                            bodyHTML += `
                                        <tr class="weapon-row ${isWeaponSelected ? 'selected-row' : ''} ${isCollapsed ? 'collapsed-section' : ''}" 
                                            data-category="${category}" 
                                            data-weapon="${weapon.name}"
                                            data-section="${category}"
                                            style="cursor: pointer;">
                                            <td class="weapon-name">${weapon.name}${weapon.slot ? getSlotBadge(weapon.slot) : ''}</td>
                                            ${columns.map(c => `<td class="${weapon[c.key]}"></td>`).join('')}
                                        </tr>
                                    `;
                        });
                    }
                });
            } else if (category === 'grenade') {
                // Official in-game order for grenade types
                const typeOrder = ['Standard', 'Special'];
                const filtered = weapons[category].filter(w => selectedWarbonds.includes(w.warbond));
                const weaponsByType = {};
                filtered.forEach(weapon => {
                    const type = weapon.type || 'Standard';
                    if (!weaponsByType[type]) weaponsByType[type] = [];
                    weaponsByType[type].push(weapon);
                });
                typeOrder.forEach(type => {
                    if (weaponsByType[type] && weaponsByType[type].length > 0) {
                        bodyHTML += `<tr class="weapon-type-header ${isCollapsed ? 'collapsed-section' : ''}" data-section="${category}" style="background: #3a3a3a; font-weight: 600; color: #ffd700;"><td colspan="${columns.length + 1}">${type}</td></tr>`;
                        weaponsByType[type].forEach(weapon => {
                            const isWeaponSelected = selectedLoadout[category] === weapon.name;
                            bodyHTML += `
                                        <tr class="weapon-row ${isWeaponSelected ? 'selected-row' : ''} ${isCollapsed ? 'collapsed-section' : ''}" 
                                            data-category="${category}" 
                                            data-weapon="${weapon.name}"
                                            data-section="${category}"
                                            style="cursor: pointer;">
                                            <td class="weapon-name">${weapon.name}${weapon.slot ? getSlotBadge(weapon.slot) : ''}</td>
                                            ${columns.map(c => `<td class="${weapon[c.key]}"></td>`).join('')}
                                        </tr>
                                    `;
                        });
                    }
                });
            } else {
                // Stratagems and any other categories remain flat
                // Exclude granted stratagems from selectable list
                weapons[category].filter(w => selectedWarbonds.includes(w.warbond) && !grantedNames.includes(w.name)).forEach(weapon => {
                    const isWeaponSelected = category === 'stratagem' ?
                        selectedLoadout.stratagems.includes(weapon.name) :
                        selectedLoadout[category] === weapon.name;
                    bodyHTML += `
                                <tr class="weapon-row ${isWeaponSelected ? 'selected-row' : ''} ${isCollapsed ? 'collapsed-section' : ''}" 
                                    data-category="${category}" 
                                    data-weapon="${weapon.name}"
                                    data-section="${category}"
                                    style="cursor: pointer;">
                                    <td class="weapon-name">${weapon.name}${weapon.slot ? getSlotBadge(weapon.slot) : ''}</td>
                                    ${columns.map(c => `<td class="${weapon[c.key]}"></td>`).join('')}
                                </tr>
                            `;
                });
            }
        }
    });

    // Summary row
    bodyHTML += `
                <tr class="summary-row" id="summary-row">
                    <td>YOUR COVERAGE</td>
                    ${columns.map(c => `<td id="summary-${c.key}"></td>`).join('')}
                </tr>
            `;
    bodyHTML += '</tbody>';

    table.innerHTML = headerHTML + bodyHTML;

    // Add click handlers
    document.querySelectorAll('.weapon-row').forEach(row => {
        row.addEventListener('click', () => {
            const category = row.dataset.category;
            const weaponName = row.dataset.weapon;
            const isCurrentlySelected = row.classList.contains('selected-row');
            const isInCollapsedSection = row.classList.contains('collapsed-section');

            // If clicking a selected weapon in a collapsed section, expand the section by deselecting
            if (isCurrentlySelected && isInCollapsedSection) {
                // This will deselect and expand the section
                selectWeapon({ selectedLoadout }, category, weaponName);
                renderTable({ weapons, weaponsLoaded, selectedLoadout, currentFaction });
            } else {
                // Normal selection behavior
                selectWeapon({ selectedLoadout }, category, weaponName);
                renderTable({ weapons, weaponsLoaded, selectedLoadout, currentFaction });
            }
        });
    });

    updateSummary({ weapons, selectedLoadout, currentFaction });
}

function selectWeapon({ selectedLoadout }, category, weaponName) {
    if (category === 'stratagem') {
        const idx = selectedLoadout.stratagems.indexOf(weaponName);
        if (idx > -1) {
            selectedLoadout.stratagems.splice(idx, 1);
        } else if (selectedLoadout.stratagems.length < 4) {
            selectedLoadout.stratagems.push(weaponName);
        }
    } else {
        if (selectedLoadout[category] === weaponName) {
            selectedLoadout[category] = null;
        } else {
            selectedLoadout[category] = weaponName;
        }
    }
}

function updateSummary({ weapons, selectedLoadout, currentFaction }) {
    const columns = columnsByFaction[currentFaction];
    columns.forEach(col => {
        const summaryCell = document.getElementById(`summary-${col.key}`);
        if (!summaryCell) return;
        let bestRating = 'red';
        Object.entries(selectedLoadout).forEach(([category, selected]) => {
            if (category === 'stratagems') {
                const allStratagemNames = [
                    ...selected,
                    ...(weapons.grantedStratagems || []).map(w => w.name)
                ];
                allStratagemNames.forEach(weaponName => {
                    const weapon = weapons.stratagem.find(w => w.name === weaponName) || (weapons.grantedStratagems || []).find(w => w.name === weaponName);
                    if (weapon && weapon[col.key] === 'green') bestRating = 'green';
                    else if (weapon && weapon[col.key] === 'yellow' && bestRating !== 'green') bestRating = 'yellow';
                });
            } else if (selected) {
                const weapon = weapons[category].find(w => w.name === selected);
                if (weapon && weapon[col.key] === 'green') bestRating = 'green';
                else if (weapon && weapon[col.key] === 'yellow' && bestRating !== 'green') bestRating = 'yellow';
            }
        });
        summaryCell.className = bestRating;
    });
}

function checkLoadoutConflicts({ weapons, selectedLoadout }) {
    const warnings = [];
    const selectedStratagems = [
        ...selectedLoadout.stratagems.map(name => weapons.stratagem.find(w => w.name === name)),
        ...(weapons.grantedStratagems || [])
    ].filter(Boolean);
    const backpackStratagems = selectedStratagems.filter(s => s && (s.slot === 'backpack' || s.slot === 'support+backpack'));
    if (backpackStratagems.length > 1) {
        warnings.push({
            type: 'error',
            message: `You have ${backpackStratagems.length} stratagems that use the backpack slot, but you can only use ONE backpack at a time!`,
            items: backpackStratagems.map(s => s.name)
        });
    }
    const supportWithBackpack = selectedStratagems.filter(s => s && s.slot === 'support+backpack');
    const backpackOnly = selectedStratagems.filter(s => s && s.slot === 'backpack');
    if (supportWithBackpack.length > 0 && backpackOnly.length > 0) {
        warnings.push({
            type: 'warning',
            message: 'You have a support weapon that needs a backpack AND a separate backpack stratagem. The support weapon will be slower to reload without its backpack!',
            items: [...supportWithBackpack.map(s => s.name + ' (needs backpack)'), ...backpackOnly.map(s => s.name)]
        });
    }
    const warningBox = document.getElementById('warning-box');
    const warningContent = document.getElementById('warning-content');
    if (warnings.length > 0) {
        warningBox.classList.add('show');
        warningContent.innerHTML = warnings.map(w => `
            <div class="warning-item">
                <strong>${w.type === 'error' ? '❌' : '⚠️'} ${w.message}</strong>
                <div style="margin-top: 5px; font-size: 12px;">
                    ${w.items.map(item => `• ${item}`).join('<br>')}
                </div>
            </div>
        `).join('');
    } else {
        warningBox.classList.remove('show');
    }
}
export {
    getWeaponType,
    getSlotBadge,
    renderTable,
    selectWeapon,
    updateSummary,
    checkLoadoutConflicts
};

// Function to determine weapon type based on official Helldivers 2 categories
function getWeaponType(weaponName) {
    if (weaponName.startsWith('AR-') || weaponName.includes('Assault Rifle') || weaponName === 'MA5C Assault Rifle' || weaponName.startsWith('StA-') || weaponName === 'BR-14 Adjudicator') {
        return 'Assault Rifle';
    } else if (weaponName.startsWith('R-') || weaponName.includes('Diligence') || weaponName.includes('Constitution') || weaponName.includes('Amendment') || weaponName.includes('Deadeye')) {
        return 'Marksman Rifle';
    } else if (weaponName.startsWith('SMG-') || weaponName.startsWith('MP-') || weaponName.includes('SMG') || weaponName === 'M7S SMG' || weaponName.includes('Knight')) {
        return 'Submachine Gun';
    } else if (weaponName.startsWith('SG-') || weaponName.includes('Shotgun') || weaponName === 'M90A Shotgun' || weaponName.includes('Breaker') || weaponName.includes('Punisher') || weaponName.includes('Cookout') || weaponName.includes('Halt')) {
        return 'Shotgun';
    } else if (weaponName.includes('Crossbow') || weaponName.startsWith('CB-') || weaponName.includes('Eruptor') || weaponName.startsWith('Jar-') || weaponName.includes('Dominator')) {
        return 'Explosive';
    } else if (weaponName.startsWith('Las-') || weaponName.startsWith('LAS-') || weaponName.startsWith('Plas-') || weaponName.startsWith('PLAS-') || weaponName.startsWith('ARC-') || weaponName.includes('Sickle') || weaponName.includes('Scythe') || weaponName.includes('Scorcher') || weaponName.includes('Purifier') || weaponName.includes('Blitzer')) {
        return 'Energy-Based';
    } else if (weaponName.startsWith('Flam-') || weaponName.startsWith('FLAM-') || weaponName.includes('Torcher') || weaponName.includes('Variable')) {
        return 'Special';
    } else {
        return 'Special';
    }
}

function getSlotBadge(slot) {
    if (slot === 'support+backpack') return '<span class="slot-badge support-badge">SUPPORT</span><span class="slot-badge backpack-badge">BACKPACK</span>';
    if (slot === 'support') return '<span class="slot-badge support-badge">SUPPORT</span>';
    if (slot === 'backpack') return '<span class="slot-badge backpack-badge">BACKPACK</span>';
    return '';
}


