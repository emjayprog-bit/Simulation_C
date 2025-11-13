# Von Neumann Architecture Simulator

A comprehensive interactive simulation of the Von Neumann computer architecture built with HTML5, CSS3, and vanilla JavaScript.

## Features

### 🏗️ Architecture Components

- **CPU (Central Processing Unit)**
  - 3 General-purpose registers (R1, R2, R3)
  - Program Counter (PC) - tracks current instruction address
  - Instruction Register (IR) - holds current instruction
  - Memory Address Register (MAR) - stores address to read/write
  - Memory Data Register (MDR) - stores data being transferred
  - Accumulator (ACC) - stores arithmetic results
  - Control Unit - manages instruction fetch/decode/execute
  - Arithmetic Logic Unit (ALU) - performs calculations

- **Memory Unit**
  - Unified memory for instructions and data
  - Instructions: addresses 0-99
  - Data: addresses 100-199
  - Editable cells for manual data manipulation
  - Delete capability for individual entries

- **Buses with Visual Indicators**
  - **Address Bus** (yellow) - carries memory addresses
  - **Control Bus** (blue) - carries control signals
  - **Data Bus** (red) - carries data values
  - Color-coded lines glow when active during execution
  - Labels illuminate matching the bus color when active

### 🎮 Control Interface

**Header Controls:**
- **Play Button**: Start/Pause instruction execution cycle-by-cycle
- **Stop Button**: Halt execution and reset CPU registers to initial state
- **Info Button**: Display Von Neumann architecture information popup

**Instruction Panel:**
- Enter instructions one per line
- Load button to append instructions to memory
- Clear button to empty the textarea

**Direct Memory Input:**
- Set arbitrary data values at specific memory addresses (100+)
- Auto-assigns next available address ≥100

**Task Record:**
- Logs all executed instructions with timestamps
- Shows fetch/decode/execute phases
- Displays operand values and results
- Clear Logs button to reset history

### ⚙️ Supported Instructions

| Instruction | Format | Example | Description |
|------------|--------|---------|-------------|
| MOV | MOV dest, src | MOV R1, #5 | Move immediate value or register to destination |
| ADD | ADD dest, src1, src2 | ADD R3, R1, R2 | Add two values, store in destination |
| SUB | SUB dest, src1, src2 | SUB R1, R3, R2 | Subtract, store in destination |
| MUL | MUL dest, src1, src2 | MUL R2, R1, R3 | Multiply two values |
| DIV | DIV dest, src1, src2 | DIV R3, R2, R1 | Divide with error check for zero |
| LOAD | LOAD dest, address | LOAD R1, 1000 | Load data from memory into register |
| STORE | STORE src, address | STORE R1, 1001 | Store register value to memory |
| JMP | JMP address | JMP 5 | Jump to instruction at address |
| NOOP | NOOP | NOOP | No operation (placeholder) |

### ✨ Visual Effects

**Dynamic Glows:**
- **CPU Glow (Cyan)**: Register fields glow when updated during execution
- **Memory Glow (Green)**: Memory card glows during LOAD/STORE operations
- **Bus Glows (Color-coded)**:
  - Address Bus glows yellow during memory address operations
  - Control Bus glows blue during control signal operations
  - Data Bus glows red during data transfer operations

All glows include:
- Colored box-shadow effect on the component
- Text-shadow on bus labels matching the bus color
- Smooth fade-out transition (300ms)

**Focus Effects:**
- CPU input fields show cyan glow (0 0 18px 6px rgba(56, 189, 248, 0.12))
- Memory table cells show green glow (0 0 18px 6px rgba(74, 222, 128, 0.12))

### 🎨 Color Scheme

Palette sourced from `style.css`:

| Element | Color | Hex Code | Purpose |
|---------|-------|----------|---------|
| Primary Accent | Soft Cyan | #38bdf8 | CPU, controls, headers |
| Memory Accent | Lively Green | #4ade80 | Memory unit, data cells |
| Address Bus | Yellow | #fef08a | Memory addressing |
| Control Bus | Blue | #60a5fa | Control signals |
| Data Bus | Red | #ef4444 | Data transfer |
| Background | Dark Navy | #0f172a | Main background |
| Card Background | Dark Slate | #1e293b | Component backgrounds |

### 📋 Default Memory State

The simulator initializes with default entries:

**Instructions (0-3):**
- Address 0: NOOP
- Address 1: MOV R1, #5
- Address 2: ADD R2, R1, #3
- Address 3: STORE R2, 100

**Data (100-199):**
- Addresses 100-199: Pre-allocated with value 0

Reset Memory button restores this default state.

## Usage

### Basic Workflow

1. **Load Instructions**:
   - Enter one instruction per line in the Instruction Input panel
   - Click "Load" to add them to memory
   - View them appear in the Memory Unit table

2. **Set Data (Optional)**:
   - Enter a numeric or text value in Direct Memory Input
   - Click "Set" to store at next available address ≥100

3. **Execute**:
   - Click "Play" button to start execution
   - Watch CPU registers, buses, and memory highlight in sequence
   - Click "Pause" to halt mid-execution
   - Click "Stop" to reset and return to start

4. **Monitor**:
   - Task Record shows each instruction's fetch/decode/execute phases
   - Visual glows indicate active components
   - Logs include timestamps and operation details

### Example Session

**Input:**
```
MOV R1, #10
MOV R2, #5
ADD R3, R1, R2
STORE R3, 100
```

**Execution Flow:**
1. Fetch MOV R1, #10 from address 1
2. Decode instruction
3. Execute: R1 ← 10 (CPU glow)
4. PC advances to address 2
5. Repeat for remaining instructions
6. Task Record logs each phase with timestamps

## Technical Architecture

### Files

- **von.html**: Main UI structure with semantic HTML5 elements
- **von.css**: Unified styling with CSS variables, flexbox layouts, responsive design
- **von.js**: Core simulation engine with instruction execution, memory management, and visual effects
- **style.css**: Color palette reference (not directly used but provides theme consistency)

### Key Technologies

- **HTML5**: Semantic elements (header, main, article, section, table)
- **CSS3**: 
  - CSS Variables for theme management
  - Flexbox for layout
  - Pseudo-elements (::after) for bus indicators
  - Transitions and box-shadows for effects
- **JavaScript (Vanilla)**:
  - Async/await for timing control
  - DOM manipulation for real-time updates
  - Event delegation for button actions
  - Object-oriented CPU state management

### Responsive Design

- Mobile-first approach with media queries
- Components stack vertically on screens < 1050px
- Touch-friendly button sizes (6px padding minimum)
- Readable font sizes with Segoe UI/Tahoma fallbacks

## Execution Model

### Instruction Cycle

Each instruction follows the classic Von Neumann fetch-decode-execute cycle:

1. **FETCH (200ms)**
   - Address Bus activates (yellow glow)
   - PC → MAR (get instruction address)
   - Memory accessed, instruction → MDR → IR
   - Memory card glows green

2. **DECODE (200ms)**
   - Control Bus activates (blue glow)
   - Instruction parsed and validated
   - CPU card glows cyan

3. **EXECUTE (200ms)**
   - Data Bus activates (red glow)
   - Operation performed (arithmetic, load, store, jump)
   - Destination register updated with glow effect
   - For LOAD/STORE: memory updated with additional glow

4. **ADVANCE**
   - PC incremented
   - Next instruction address calculated
   - Execution continues or halts if no more instructions

### Timing

Default execution delay: **500ms between instructions**
Phase durations: **200ms each** (fetch/decode/execute)
Glow fade duration: **300ms** (persists briefly after operation)

## Accessibility Features

- ARIA attributes for modals (aria-hidden)
- Semantic HTML with proper heading hierarchy
- Alt text support through title attributes
- Keyboard-navigable buttons and controls
- High contrast color scheme (WCAG AA compliant)

## Limitations & Future Enhancements

### Current Limitations
- No support for conditional jumps (no flags register)
- Fixed 3 general-purpose registers (no memory-mapped I/O)
- Single memory bank (no cache simulation)
- No interrupt handling or exceptions
- Maximum 100 instructions, 100 data addresses

### Potential Enhancements
- Flags register (zero, carry, overflow)
- Conditional jump instructions (JZ, JNZ, JC)
- Stack pointer and PUSH/POP instructions
- Subroutine call (CALL) and return (RET)
- Multiple execution speeds (slow/normal/fast)
- Breakpoint support
- Instruction history/undo
- Import/export programs
- Multiple CPU cores simulation
- Cache hierarchy visualization

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Requires JavaScript enabled
- Recommended: 1024x768 minimum resolution

## Installation

1. Download all files to a single directory:
   - von.html
   - von.css
   - von.js
   - (optional) index.html, style.css for navigation

2. Open `von.html` in a web browser

3. Or serve via local server:
   ```bash
   python -m http.server 8000
   # Navigate to http://localhost:8000/von.html
   ```

## License & Attribution

Educational simulator for teaching Von Neumann architecture concepts. Colors and design aligned with the project's `style.css` palette.

---

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Complete with full instruction execution and visual effects
"# Simulation_C" 
