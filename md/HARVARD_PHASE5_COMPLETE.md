# Harvard Architecture Simulation - Phase 5 Complete Implementation

## Overview
Successfully completed a comprehensive redesign of `harvard.html` transforming it from a basic architecture layout into a fully-functional Harvard Architecture simulation matching the capability and design of the Von Neumann simulation.

## Key Achievements

### 1. **Complete Layout Restructuring**
- **Three-Column Layout**: 
  - **LEFT**: Instruction Input Panel with memory table (addresses 0-6, blue theme)
  - **CENTER**: CPU with registers, Control Unit, ALU, buses, and Task Record below
  - **RIGHT**: Memory Unit with data table (addresses 1000-1003, green theme)
- **Buses**: Address bus (top) and Data bus (bottom) connecting components with glow effects
- **Task Record**: Sticky header with scrollable log area below CPU component

### 2. **CPU Component (From Von Neumann Template)**
Complete CPU implementation with:
- **General Registers**: R1, R2, R3 (horizontal layout, 72px min-width at 60% reduction)
- **Special Registers**: PC, IR, MAR, MDR, ACC (vertical layout)
- **Control Unit**: Displays execution phase (Fetching, Decoded, Executing)
- **ALU Unit**: Shows arithmetic/logic operations performed
- All registers synchronized with instruction execution cycle

### 3. **Separate Memory Architecture**
- **Instruction Memory** (Addresses 0-6, Blue Theme):
  - Stores instructions as strings (MOV, ADD, LOAD, etc.)
  - Editable table with 2 columns (Address, Instruction)
  - Load/Clear buttons for instruction management
  - Help button (?) for instruction syntax examples
  
- **Data Memory** (Addresses 1000-1003, Green Theme):
  - Stores numeric data values
  - Editable table with 2 columns (Address, Data)
  - Reset button to restore default values
  - Independent from instruction memory

### 4. **Complete Functionality (harvard.js - 447 Lines)**

**Core Features**:
- Separate `instrMemory` and `dataMemory` Map structures
- Default values for both memories:
  - Instructions (0-6): MOV, ADD, SUB, MUL, DIV, STORE
  - Data (1000-1003): 25, 50, 75, 100
- FETCH/DECODE/EXECUTE cycle with timing:
  - Fetch: 900ms (Address bus glow + CPU glow)
  - Decode: 700ms (CPU glow)
  - Execute: 900ms (Data bus glow + CPU glow)
  - Between cycles: 250ms

**Instruction Support**:
- `MOV R1, #5` - Move immediate to register
- `ADD/SUB/MUL/DIV R1, R2, R3` - Arithmetic operations
- `LOAD R1, 1000` - Load from data memory
- `STORE R1, 1001` - Store to data memory

**Event Handlers**:
- Play/Pause button (top-right header, cyan gradient)
- Stop button (top-right header, resets PC and registers)
- Load Instructions button (appends to instruction memory)
- Clear Instructions button (empties textarea)
- Reset Memory button (resets both memories to defaults)
- Clear Logs button (empties task record)
- Info button (?) - Harvard architecture explanation
- Help button (?) - Instruction syntax guide

**Task Recording**:
- Grouped execution logs by instruction number
- Timestamped entries
- Phase labels (FETCH, DECODE, EXECUTE)
- Auto-scrolling to latest entries
- Visual grouping with borders and headers

### 5. **Header Design**
```
┌─────────────────────────────────────────┐
│ ← Back    Harvard Architecture    Play  Stop  ℹ️ │
└─────────────────────────────────────────┘
```
- Back button: Links to index.html
- Title: Centered, cyan color
- Controls: Play/Pause, Stop (blue gradient), Info button (cyan)

### 6. **Styling & Visual Design**

**Color Scheme**:
- **Primary Cyan**: #38bdf8 (CPU, general accent)
- **Data Green**: #4ade80 (Memory, data table)
- **Address Bus**: Yellow/cyan lines with glow
- **Data Bus**: Cyan lines with glow
- **Dark Navy**: #021826, #0f172a (backgrounds)

**Table Styling**:
- Instruction Table Header: Cyan gradient (light)
- Data Table Header: Green gradient (light)
- Editable cells with inline editing (contentEditable)
- Color-coded row backgrounds for visual distinction
- Scrollable tbody with fixed header

**Button Styling**:
- **Primary Buttons**: Cyan gradient background, hover effects
- **Ghost Buttons**: Transparent with cyan border, inverse hover
- **Control Buttons**: Deep blue gradient (Play/Stop)
- Consistent 6-8px padding, 8px border-radius

### 7. **CSS Organization**

**harvard.html** (In `<style>` block):
- Layout structure (simulation-wrapper, columns, buses)
- Card and panel styles
- Register and table styling
- Button variations
- Modal positioning and styling

**harvard.css** (External file):
- Base color variables (soft-blue, mem-lime)
- Header and navigation styles
- Modal dropdown styles
- Responsive media queries

### 8. **Files Created/Modified**

**New Files**:
- ✅ `harvard.js` (447 lines) - Complete simulation engine
- ✅ `harvard_old.html` (backup of previous version)

**Modified Files**:
- ✅ `harvard.html` (266 lines) - Complete redesign
- ✅ `harvard.css` (305 lines) - Extended with modal styles

**Features Parity with von.js**:
- ✅ FETCH/DECODE/EXECUTE cycle timing
- ✅ Register state management
- ✅ Bus glow effects during execution
- ✅ Task record with grouped logging
- ✅ Modal system (Info/Help)
- ✅ Memory table editing and rendering
- ✅ Instruction parsing and execution
- ✅ Operand resolution (registers, immediates, addresses)

## Technical Specifications

### Memory Layout
```
Instruction Memory (0-6, Blue):
├─ 0: MOV R1, #5
├─ 1: MOV R2, #10
├─ 2: ADD R3, R1, R2
├─ 3: SUB R1, R3, R2
├─ 4: MUL R2, R1, R3
├─ 5: DIV R3, R2, R1
└─ 6: STORE R3, 1000

Data Memory (1000-1003, Green):
├─ 1000: 25
├─ 1001: 50
├─ 1002: 75
└─ 1003: 100
```

### Register State
```
CPU Registers:
├─ R1, R2, R3 (General Purpose)
├─ PC (Program Counter) - starts at 0
├─ IR (Instruction Register)
├─ MAR (Memory Address Register)
├─ MDR (Memory Data Register)
└─ ACC (Accumulator)
```

### Execution Timeline (Example)
```
Cycle 1: Fetch MOV R1, #5 (900ms) → Decode (700ms) → Execute (900ms) → Between (250ms)
Cycle 2: Fetch MOV R2, #10 (900ms) → Decode (700ms) → Execute (900ms) → Between (250ms)
... continues until no more instructions or Stop pressed
```

## Comparison: Von Neumann vs Harvard

### Von Neumann (von.html)
- Single unified memory (addresses 1-6 instructions, 1000-1003 data)
- Dual buses: Address/Control (1) and Data (1)
- Single memory table with mixed content
- Addresses 1+ for instructions

### Harvard (harvard.html) ✅ NEW
- Separate instruction memory (0-6)
- Separate data memory (1000-1003)
- Address bus between instruction fetch and CPU
- Data bus between CPU and data memory
- Two color-coded memory tables (blue/green)
- Addresses 0+ for instructions (more logical)
- Visual separation makes architecture clearer

## User Workflows

### Basic Execution Flow
1. **Load Instructions**: 
   - Type instructions in textarea (left column)
   - Click "Load" to add to instruction memory
   - Instructions appear in blue table

2. **View Initial Memory**:
   - Default data (1000-1003) shown in right column
   - Default instructions (0-6) shown in left column

3. **Execute Program**:
   - Click "Play" button (top-right)
   - CPU starts fetching from instruction 0
   - Buses glow during fetch/execute phases
   - Task record logs each step

4. **Control Execution**:
   - Click "Pause" (changes to "Play") to pause mid-execution
   - Click "Stop" to halt and reset registers (PC=0, R1=R2=R3=0)
   - Memory retained for inspection

5. **Edit Memory**:
   - Click table cells to edit instruction or data values
   - Changes persist during execution
   - Use "Reset" button to restore defaults

### Instruction Examples
```
MOV R1, #5           → Load immediate 5 into R1
MOV R2, #10          → Load immediate 10 into R2
ADD R3, R1, R2       → Add R1+R2, store in R3
SUB R1, R3, R2       → Subtract R3-R2, store in R1
LOAD R1, 1000        → Load from data memory[1000] into R1
STORE R1, 1001       → Store R1 value into data memory[1001]
```

## Quality Assurance

✅ **No Linting Errors**: All inline styles moved to CSS classes
✅ **No JavaScript Errors**: harvard.js syntax validated (447 lines)
✅ **Semantic HTML**: Proper structure with aria-hidden for modals
✅ **Responsive Layout**: Three-column layout adapts to container width
✅ **Accessibility**: Button labels, modals with ARIA attributes
✅ **Design Consistency**: Matches von.html cyan/green color scheme
✅ **Functionality Parity**: All von.js features replicated in harvard.js

## Files Summary

| File | Status | Lines | Purpose |
|------|--------|-------|---------|
| harvard.html | ✅ NEW | 266 | Complete HTML structure with layout |
| harvard.js | ✅ NEW | 447 | Full simulation engine & event handlers |
| harvard.css | ✅ UPDATED | 305 | Extended with modal + input styles |
| harvard_old.html | 📦 Backup | - | Previous version preserved |

## What's Next

Users can now:
1. ✅ View Harvard Architecture layout (instruction-CPU-memory separation)
2. ✅ Load and execute programs with separate instruction/data memory
3. ✅ Watch fetch/decode/execute cycles with bus glowing
4. ✅ Edit memory tables during execution
5. ✅ See detailed task logs grouped by instruction
6. ✅ Compare Harvard vs Von Neumann side-by-side (via index.html)

The simulation is now **feature-complete and ready for educational use**.
