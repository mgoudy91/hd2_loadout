# Helldivers 2 Loadout Builder - Project Context

> **📝 Maintenance Note**: This context file should be updated as development progresses to maintain accurate project state and aid future development sessions.

## Project Overview

### Purpose
A web-based loadout planning tool for Helldivers 2 that helps players optimize their equipment selections based on mission requirements and enemy faction effectiveness. The tool provides visual feedback on weapon effectiveness against specific enemy types and enforces game rules (e.g., one primary weapon per loadout).

### Current Status
- **Phase**: Active development with advanced UX features complete
- **Architecture**: Modular single-page application with separated data layer
- **Data Quality**: Mixed - established warbonds well-documented, newer 2025 warbonds have placeholder/incomplete data
- **Target Users**: Helldivers 2 players planning loadouts for specific missions or enemy factions
- **Latest Features**: Collapsible weapon sections, weapon type grouping, enhanced selection UI

## Technical Architecture

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Data Layer**: External JavaScript module (`weaponDatabase.js`)
- **Deployment**: Static files (no backend required)
- **Browser Compatibility**: Modern browsers with ES6 module support

### File Structure
```
hl2_loadout/
├── index.html              # Main application interface
├── weaponDatabase.js       # Centralized weapon/stratagem data
├── todo.txt               # Development tasks and notes
└── PROJECT_CONTEXT.md     # This documentation file
```

### Key Components

#### `index.html`
- **Role**: Main application interface and logic
- **Key Functions**:
  - `renderTable()`: Generates weapon effectiveness matrix
  - `selectWeapon()`: Handles weapon selection and conflict resolution
  - `resetLoadout()`: Clears current selections with confirmation
  - `resetWarbonds()`: Resets warbond filters with confirmation
- **UI Features**: 
  - Warbond filtering system (checkboxes with select all/none buttons)
  - Color-coded effectiveness matrix (green/yellow/red)
  - Loadout conflict detection and warnings
  - Reset functionality with confirmation dialogs
  - Collapsible weapon sections (single-selection categories collapse when item selected)
  - Weapon type grouping (primary weapons organized by official HD2 categories)
  - Dynamic selection counters and helpful interaction hints

#### `weaponDatabase.js`
- **Role**: Centralized data repository
- **Export Format**: Both CommonJS and ES6 module compatible
- **Data Structure**: Arrays of weapon objects with effectiveness ratings
- **Categories**: Primary weapons, secondary weapons, grenades, stratagems
- **Weapon Categorization**: Primary weapons include type fields for official HD2 weapon categories
- **Development Status**: Partially updated with type fields (~30% complete, manual updates ongoing)
- **Effectiveness Scale**: 
  - `"green"`: Highly effective
  - `"yellow"`: Moderately effective  
  - `"red"`: Poorly effective or ineffective

## Game Context

### Helldivers 2 Basics
- **Genre**: Cooperative third-person shooter
- **Setting**: Satirical sci-fi "managed democracy"
- **Core Mechanics**: Squad-based missions against alien factions
- **Loadout System**: Players select primary weapon, secondary weapon, grenade, and multiple stratagems

### Enemy Factions
1. **Terminids** (Bug-like aliens)
   - Light enemies: Small, fast bugs
   - Medium enemies: Armored bugs, spitters
   - Heavy enemies: Chargers, Bile Titans
   - Structures: Bug nests

2. **Automatons** (Robot army)
   - Light enemies: Basic bots
   - Medium enemies: Devastators, heavy bots
   - Heavy enemies: Hulks, Striders, Factory Striders
   - Structures: Factories, Warpships

3. **Illuminate** (Psychic aliens)
   - Light enemies: Basic illuminate units
   - Medium enemies: Advanced illuminate
   - Heavy enemies: Harvesters, Voteless
   - Structures: Various illuminate installations

### Warbond System
- **Purpose**: Helldivers 2's progression/monetization system (like battle passes)
- **Types**:
  - **Standard**: Free (Helldivers Mobilize!)
  - **Premium**: 1,000 Super Credits each
  - **Legendary**: 1,500 Super Credits (currently only ODST)
- **Mechanics**: Purchase with Super Credits, unlock items with Medals
- **No FOMO**: Warbonds never expire, can be purchased and progressed anytime

## Data Architecture

### Weapon Object Structure
```javascript
{
  name: "Weapon Name",
  warbond: "warbond-slug",
  type: "Assault Rifle|Marksman Rifle|...", // Primary weapons only (optional field)
  light: "green|yellow|red",      // vs light enemies
  medium: "green|yellow|red",     // vs medium enemies  
  heavy: "green|yellow|red",      // vs heavy enemies
  bugnest: "green|yellow|red",    // vs Terminid structures
  charger: "green|yellow|red",    // vs Chargers (Terminid heavy)
  biletitan: "green|yellow|red",  // vs Bile Titans (Terminid boss)
  factory: "green|yellow|red",    // vs Automaton factories
  hulk: "green|yellow|red",       // vs Hulks (Automaton heavy)
  strider: "green|yellow|red",    // vs Striders (Automaton heavy)
  warpship: "green|yellow|red",   // vs Warpships (Automaton air)
  harvester: "green|yellow|red",  // vs Harvesters (Illuminate heavy)
  voteless: "green|yellow|red"    // vs Voteless (Illuminate heavy)
}
```

### Primary Weapon Type Categories
Official Helldivers 2 weapon types used for grouping:
- **Assault Rifle**: AR-23 variants, BR-14, AR-16, etc.
- **Marksman Rifle**: R-63 variants, R-2124 Constitution, R-36 Eruptor, etc.
- **Submachine Gun**: SMG-37, MP-98, SMG-72, SMG-32, etc.
- **Shotgun**: SG-225 variants, SG-8 variants, SG-451, SG-20, etc.
- **Explosive**: Jar-5 Dominator, CB-9 Exploding Crossbow, etc.
- **Energy-Based**: Las-5, Las-16, Plas-1, ARC-12, etc.
- **Special**: Flam-66 Torcher and other unique weapon types

### Warbond Identifiers
- `"helldivers-mobilize"` - Standard (free)
- `"steeled-veterans"` - Premium #1
- `"cutting-edge"` - Premium #2
- `"democratic-detonation"` - Premium #3
- `"polar-patriots"` - Premium #4
- `"viper-commandos"` - Premium #5
- `"freedoms-flame"` - Premium #6
- `"chemical-agents"` - Premium #7
- `"truth-enforcers"` - Premium #8
- `"urban-legends"` - Premium #9
- `"servants-freedom"` - Premium #10
- `"borderline-justice"` - Premium #11
- `"masters-ceremony"` - Premium #12
- `"force-of-law"` - Premium #13
- `"control-group"` - Premium #14 (July 2025)
- `"odst"` - Legendary #1 (August 2025, Halo crossover)
- `"dust-devils"` - Premium #15 (September 2025)

## Data Quality Status

### Well-Documented Warbonds
- All warbonds through "force-of-law" have comprehensive weapon data
- Effectiveness ratings based on community consensus and testing
- Complete weapon lists with proper names and categorization

### Newer Warbonds (2025 Releases)
- **Control Group**: Basic info available, weapon details incomplete
- **ODST**: Weapon names confirmed from wiki, effectiveness estimated
- **Dust Devils**: Very recent release, mostly placeholder data

### Data Sources
- Primary: [Helldivers Wiki](https://helldivers.wiki.gg/)
- Secondary: Community Reddit discussions, YouTube gameplay
- Limitation: Newer content often lacks comprehensive community testing

## Development History

### Completed Features
1. ✅ **Modular Architecture**: Extracted database to separate file
2. ✅ **Comprehensive Database**: Researched and populated 60+ weapons
3. ✅ **Warbond Filtering**: UI for selecting which warbonds to display
4. ✅ **Reset Functionality**: Buttons to clear loadout and warbond selections
5. ✅ **ODST Integration**: Updated with actual Halo crossover weapons
6. ✅ **Select All/None Warbond Buttons**: Quick warbond selection controls
7. ✅ **Weapon Type Grouping**: Primary weapons organized by official HD2 categories
8. ✅ **Collapsible Sections**: Single-selection categories collapse when item selected
9. ✅ **Enhanced UX**: Dynamic counters, collapse indicators, and interaction hints

### Known Issues
- **Data Quality**: Effectiveness ratings for newer weapons are estimated
- **Missing Weapons**: Some recent warbonds may have incomplete weapon lists
- **No Validation**: Effectiveness ratings not validated against actual gameplay
- **Incomplete Type Fields**: Only ~30% of primary weapons have explicit type categorization in database

### Future Considerations
- **Complete Database Type Fields**: Finish adding type fields to remaining primary weapons
- **Data Validation**: Need gameplay testing or community consensus for accuracy
- **Armor Integration**: Current focus is weapons/stratagems only
- **Booster System**: Not currently included in loadout planning
- **Mission Context**: Could integrate specific mission requirements
- **Community Features**: Sharing loadouts, rating effectiveness

## AI Development Notes

### Code Patterns
- Consistent naming: kebab-case for IDs, camelCase for JavaScript
- Event-driven UI updates via `renderTable()` calls
- Defensive programming with null checks and error handling
- Modular data structure allows easy expansion

### Common Tasks
- **Adding Weapons**: Append to appropriate array in `weaponDatabase.js`
- **New Warbonds**: Add warbond ID to filter UI and weapon objects
- **Effectiveness Updates**: Modify color values in weapon objects
- **UI Changes**: Most logic in `index.html` event handlers
- **Type Field Updates**: Add `type: "Category Name"` field to primary weapons for proper grouping

### Testing Approach
- Manual testing via browser refresh
- Data validation by cross-referencing wiki sources
- UI testing across different filter combinations
- Loadout conflict testing with various weapon selections

### Extension Points
- Database could be converted to JSON for easier editing
- Effectiveness system could support numeric values vs color coding
- Filter system could expand beyond warbonds (weapon type, effectiveness, etc.)
- Save/load functionality could be added with localStorage

## Community Integration

### Data Maintenance Strategy
- Monitor Helldivers Wiki for updates on newer warbonds
- Track community discussions for effectiveness consensus
- Update placeholder data as real gameplay data becomes available
- Consider community contribution system for data validation

### Accuracy Philosophy
- Placeholder data clearly marked as estimates
- Prefer "unknown" over inaccurate data
- Prioritize established weapons with community consensus
- Regular updates as game meta evolves

---
*Last Updated: September 22, 2025*
*Project Version: Advanced UX Phase*
*Recent Changes: Added collapsible sections, weapon type grouping, and enhanced UI interactions*
