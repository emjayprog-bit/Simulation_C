# Harvard Architecture - Updated Structure

## Changes Made

### 1. **Restructured Layout** 
The three-column layout now includes:

**LEFT COLUMN (Instruction Section)**:
- Instruction Memory table (addresses 0-6, blue theme, scrollable)
- Instruction Input panel (textarea with Load/Clear buttons)

**CENTER COLUMN (CPU Section)**:
- Address Bus (top) - glows during fetch
- CPU card with all registers (R1-R3, PC, IR, MAR, MDR, ACC)
- Control Unit and ALU units with execution logs
- Data Bus (bottom) - glows during execute
- Task Record (sticky header, scrollable log area)

**RIGHT COLUMN (Memory Section)**:
- Data Memory table (addresses 1000-1003, green theme, scrollable)
- Direct Memory Input panel (input field with Set/Clear buttons)

### 2. **From Von Neumann Templates**

**Instruction Input Panel** (copied structure from von.html):
```html
<div class="card instruction-input-panel">
  <div class="panel-head"><h3>Instruction Input</h3></div>
  <textarea placeholder="One instruction per line..."></textarea>
  <div class="input-actions">
    <button id="loadInstructionBtn" class="btn">Load</button>
    <button id="clearInstructionBtn" class="btn ghost">Clear</button>
  </div>
</div>
```

**Direct Memory Input Panel** (copied structure from von.html):
```html
<div class="card direct-memory-panel">
  <h3>Direct Memory Input</h3>
  <input placeholder="Data value (numeric)">
  <div class="input-actions">
    <button id="setDataBtn" class="btn">Set</button>
    <button id="clearDataBtn" class="btn ghost">Clear</button>
  </div>
</div>
```

### 3. **Bus Positioning**
- Address Bus between Instruction Memory and CPU (top)
- Data Bus between CPU and Data Memory (bottom)
- Both buses glow during appropriate execution phases

### 4. **Memory Tables - Scrollable**
CSS updates for proper scrolling:
```css
.table-wrapper {
  flex: 1;
  overflow-y: auto;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}
```

Both instruction and data memory tables now:
- Have fixed height (450px for panels)
- Support scrollable table bodies
- Keep headers visible while scrolling

### 5. **Task Record Functionality**
The Task Record includes:
- **Sticky Header**: `position: sticky; top: 0; z-index: 5;` (stays visible while scrolling)
- **Scrollable Box**: `overflow-y: auto;` allows logs to scroll
- **Grouped Logs**: Instructions grouped by cycle number
- **Auto-scroll**: Automatically scrolls to latest entries
- **Clear Logs**: Button to empty all logs

### 6. **Removed Elements**
- ❌ Reset button from Data Memory header
- The direct memory input provides Set functionality instead

### 7. **Updated harvard.js**

**New Event Handlers**:
```javascript
// Set direct data button
setDataBtn.addEventListener('click', ()=>{
  const v = dataValueInput.value.trim();
  if(!v) return;
  let addr = 1000;
  while(dataMemory.has(addr) && addr < 1010) addr++;
  dataMemory.set(addr, v);
  renderDataMemory();
  dataValueInput.value = '';
  logTask(`Direct memory set -> data memory[${pad(addr)}] = ${v}`);
});

// Clear data input
clearDataBtn.addEventListener('click', ()=> dataValueInput.value = '');
```

**Element References**:
```javascript
const dataValueInput = document.getElementById('dataValueInput');
const setDataBtn = document.getElementById('setDataBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
```

## Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│  ← Back     Harvard Architecture     Play  Stop  ℹ️     │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Instruction Mem  │  │   Address Bus    │  │  Data Memory     │
│ ┌──────────────┐ │  │ ─────────────→   │  │ ┌──────────────┐ │
│ │ 0: MOV R1,#5 │ │  │                  │  │ │ 1000: 25     │ │
│ │ 1: MOV R2,#10│ │  │     CPU CARD     │  │ │ 1001: 50     │ │
│ │ 2: ADD R3... │ │  │  R1  R2  R3      │  │ │ 1002: 75     │ │
│ │ 3: SUB R1... │ │  │  PC  IR  MAR     │  │ │ 1003: 100    │ │
│ │ 4: MUL R2... │ │  │  MDR ACC         │  │ │              │ │
│ │ 5: DIV R3... │ │  │  Control ALU     │  │ │              │ │
│ │ 6: STORE... │ │  │                  │  │ └──────────────┘ │
│ └──────────────┘ │  │  Data Bus        │  │ Direct Memory   │
│ Instruction Input│  │ ←─────────────   │  │ ┌──────────────┐ │
│ ┌──────────────┐ │  │                  │  │ │ [Value Input]│ │
│ │ Load |Clear  │ │  │  Task Record ↕   │  │ │ Set | Clear  │ │
│ │ Textarea ▼   │ │  │ [Scrollable Logs]│  │ └──────────────┘ │
│ │[Instructions]│ │  │                  │  │                  │
│ └──────────────┘ │  └──────────────────┘  └──────────────────┘
└──────────────────┘
```

## Features Working

✅ Instruction memory displays addresses 0-6 with scrollable table
✅ Instruction input loads instructions to memory
✅ Address bus visualizes instruction fetch
✅ CPU executes cycles with register updates
✅ Data bus visualizes data transfer
✅ Data memory displays addresses 1000-1003 with scrollable table
✅ Direct memory input sets individual data values
✅ Task record shows detailed execution logs (sticky header, scrollable)
✅ All buttons styled consistently (Load, Clear, Set, Clear Logs)
✅ Modal dialogs (Info, Help) work with click-outside detection

## Next Steps (If Needed)

- [ ] Adjust memory table heights if needed
- [ ] Fine-tune scrolling behavior for smaller screens
- [ ] Add more default instruction examples
- [ ] Enhance task log grouping visualization
