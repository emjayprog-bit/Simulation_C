# Harvard Architecture Simulation - Complete Structure

## File Structure Updated

### harvard.html (Updated)
✅ Three-column layout with proper spacing
✅ Instruction memory (left, blue table) + Instruction input below
✅ CPU card (center) with Address bus above, Data bus below
✅ Task record (center, scrollable with sticky header)
✅ Data memory (right, green table) + Direct memory input below
✅ All modals (Info, Help) with proper styling
✅ No inline styles on HTML elements (all in CSS)

### harvard.js (Updated)
✅ Direct memory input handlers (Set/Clear buttons)
✅ Data memory rendering and auto-address assignment
✅ Proper element references for all new panels
✅ No errors, ready for execution

### harvard.css (No changes needed)
✅ All existing styles support new layout

---

## Element IDs and References

### Memory Rendering
```javascript
// Instruction memory
instrMemoryBody      // <tbody id="instrMemoryBody">
instrMemory          // Map() - stores instructions

// Data memory  
memoryBody           // <tbody id="memoryBody">
dataMemory           // Map() - stores data values
```

### Instruction Input Buttons
```javascript
instructionInput     // <textarea id="instructionInput">
loadInstructionBtn   // Click to load instructions
clearInstructionBtn  // Click to clear textarea
```

### Direct Memory Input Buttons
```javascript
dataValueInput       // <input id="dataValueInput">
setDataBtn           // Click to set/add data value
clearDataBtn         // Click to clear input field
```

### Bus Elements
```javascript
addrLine             // <div id="addrLine"> - Address bus visual
dataLine             // <div id="dataLine"> - Data bus visual
```

### Task Record
```javascript
taskRecord           // <div id="taskRecord"> - scrollable log area
clearLogsBtn         // Clear all logs button
```

### CPU Registers
```javascript
r1, r2, r3          // General purpose registers
pcField             // Program Counter
irField             // Instruction Register
marField            // Memory Address Register
mdrField            // Memory Data Register
accField            // Accumulator
```

### Logs
```javascript
controlUnitLog      // Control Unit status
aluLog              // ALU operation display
```

---

## DOM Structure

```
<html>
  <header class="top-header">
    Back Button | Title | [Play] [Stop] [ℹ️]
  </header>
  
  <main class="page-wrap">
    <div class="simulation-wrapper">
      
      <!-- LEFT COLUMN: Instruction Memory + Input -->
      <div class="left-column">
        <div class="card instruction-panel">
          <h3>Instruction Memory</h3>
          <div class="table-wrapper">
            <table class="instruction-table">
              <thead><tr><th>Addr</th><th>Instruction</th></tr></thead>
              <tbody id="instrMemoryBody"></tbody>
            </table>
          </div>
        </div>
        
        <div class="card instruction-input-panel">
          <h3>Instruction Input</h3>
          <textarea id="instructionInput"></textarea>
          <div class="input-actions">
            <button id="loadInstructionBtn">Load</button>
            <button id="clearInstructionBtn">Clear</button>
          </div>
        </div>
      </div>
      
      <!-- CENTER COLUMN: Buses, CPU, Task Record -->
      <div class="center-column">
        
        <!-- Address Bus -->
        <div class="buses-row">
          <span class="bus-label">Address Bus</span>
          <div id="addrLine" class="bus-line-h"></div>
        </div>
        
        <!-- CPU Card -->
        <article class="card cpu-card" id="cpuCard">
          <h2>Central Processing Unit (CPU)</h2>
          <div class="registers">
            <div class="gen-regs-row">
              <div class="reg-row">
                <label>R1</label><input id="r1" readonly>
              </div>
              <div class="reg-row">
                <label>R2</label><input id="r2" readonly>
              </div>
              <div class="reg-row">
                <label>R3</label><input id="r3" readonly>
              </div>
            </div>
            <div class="reg-row">
              <label>PC</label><input id="pc" readonly>
            </div>
            <div class="reg-row">
              <label>IR</label><input id="ir" readonly>
            </div>
            <div class="reg-row">
              <label>MAR</label><input id="mar" readonly>
            </div>
            <div class="reg-row">
              <label>MDR</label><input id="mdr" readonly>
            </div>
            <div class="reg-row">
              <label>ACC</label><input id="acc" readonly>
            </div>
          </div>
          <div class="unit-columns">
            <div class="unit">
              <h3>Control Unit</h3>
              <div id="controlUnitLog"></div>
            </div>
            <div class="unit">
              <h3>ALU</h3>
              <div id="aluLog"></div>
            </div>
          </div>
        </article>
        
        <!-- Data Bus -->
        <div class="buses-row">
          <span class="bus-label">Data Bus</span>
          <div id="dataLine" class="bus-line-h"></div>
        </div>
        
        <!-- Task Record -->
        <div class="card task-record">
          <div class="task-record-header">
            <h3>Task Record</h3>
            <button id="clearLogsBtn">Clear Logs</button>
          </div>
          <div id="taskRecord" class="task-record-box"></div>
        </div>
      </div>
      
      <!-- RIGHT COLUMN: Data Memory + Direct Input -->
      <div class="right-column">
        <div class="card memory-card-panel">
          <h3>Data Memory</h3>
          <div class="table-wrapper">
            <table class="memory-table">
              <thead><tr><th>Address</th><th>Data</th></tr></thead>
              <tbody id="memoryBody"></tbody>
            </table>
          </div>
        </div>
        
        <div class="card direct-memory-panel">
          <h3>Direct Memory Input</h3>
          <input id="dataValueInput" placeholder="Data value (numeric)">
          <div class="input-actions">
            <button id="setDataBtn">Set</button>
            <button id="clearDataBtn">Clear</button>
          </div>
        </div>
      </div>
      
    </div>
  </main>
  
  <!-- Modals -->
  <div id="infoModal" aria-hidden="true">
    <button id="infoClose">✖</button>
    <h3>Harvard Architecture</h3>
    <p>Description...</p>
  </div>
  
  <div id="helpModal" aria-hidden="true">
    <button id="helpClose">✖</button>
    <h3>Instruction Examples</h3>
    <div class="help-content">...</div>
  </div>
  
  <script src="harvard.js"></script>
</html>
```

---

## CSS Classes

### Layout
- `.page-wrap` - Main container (100% width, 40px padding)
- `.simulation-wrapper` - Three-column flex container
- `.left-column` - Instruction memory + input (360px)
- `.center-column` - CPU + buses + task record (auto width)
- `.right-column` - Data memory + direct input (420px)

### Cards & Panels
- `.card` - Base card styling (dark bg, border, shadow)
- `.instruction-panel` - Instruction memory card (450px height, scrollable)
- `.instruction-input-panel` - Instruction input panel (flexbox column)
- `.memory-card-panel` - Data memory card (450px height, scrollable)
- `.direct-memory-panel` - Direct memory input panel

### Tables
- `.instruction-table` - Instruction table (blue header)
- `.memory-table` - Data memory table (green header)
- `.table-wrapper` - Scrollable table container (flex, overflow-y auto)

### Buses
- `.buses-row` - Bus container (flex, centered)
- `.bus-segment` - Individual bus (flex)
- `.bus-label` - Bus name label
- `.bus-line-h` - Bus line visual (3px, transitions color)
- `.bus-line-h.active` - Glowing bus state

### Task Record
- `.task-record` - Container (flex column, 250px height)
- `.task-record-header` - Sticky header (top: 0, z-index: 5)
- `.task-record-box` - Scrollable log area (flex column, overflow-y auto)

### Buttons
- `.btn` - Primary button (blue gradient)
- `.btn.ghost` - Secondary button (cyan border, transparent bg)
- `.small-btn` - Small button (cyan gradient)
- `.small-icon` - Icon button (cyan background)

### Modals
- `#infoModal` - Fixed positioned modal (top: 80px, right: 20px)
- `#helpModal` - Fixed positioned modal
- `.modal-close` - Close button in modals

---

## Execution Flow

1. **User loads instructions** via textarea and clicks "Load"
   - Instructions added to `instrMemory` Map (addresses 0-6)
   - Instruction table renders updated rows

2. **User clicks Play button** (top-right header)
   - `runCycleAt()` executes for each instruction
   - Address bus glows (fetch phase, 900ms)
   - CPU registers update from instruction data
   - Data bus glows (execute phase, 900ms)
   - Task record logs each phase with timestamps

3. **User can set direct data** via input field and "Set" button
   - Data value added to `dataMemory` Map
   - Auto-assigns next address (1000-1010)
   - Data memory table updates
   - Task record logs the action

4. **User can clear task record** with "Clear Logs" button
   - All entries removed from task-record-box
   - Table remains visible

---

## Key Features

✅ **Scrollable Memory Tables**
- Fixed 450px height on panels
- Table body scrolls independently
- Headers stay visible

✅ **Sticky Task Record Header**
- Stays visible while scrolling logs
- Contains title and Clear Logs button

✅ **Bus Visualization**
- Address bus glows on fetch
- Data bus glows on execute
- Position between memories and CPU

✅ **Von Neumann Component Copying**
- Instruction input structure from von.html
- Direct memory input structure from von.html
- Same button styling and functionality

✅ **Task Record Functionality**
- Groups logs by instruction number
- Timestamps all entries
- Auto-scrolls to bottom
- Supports manual clearing

---

## Testing Checklist

- [ ] Instruction memory table scrolls properly
- [ ] Load instructions from textarea works
- [ ] Clear instruction textarea works
- [ ] CPU executes instructions correctly
- [ ] Address bus glows during fetch
- [ ] Data bus glows during execute
- [ ] Task record displays logs with timestamps
- [ ] Task record header stays sticky
- [ ] Data memory table scrolls properly
- [ ] Set direct memory value works
- [ ] Clear direct memory input works
- [ ] Clear logs button empties task record
- [ ] Info modal opens/closes
- [ ] Help modal opens/closes
- [ ] Click outside modals closes them
