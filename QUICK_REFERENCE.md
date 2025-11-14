# Quick Reference - Von Neumann Simulator Restoration

## ✅ Restoration Checklist

### Core Functions Restored
- ✅ `renderMemory()` - Displays memory table with color coding
- ✅ `resetMemory()` - Resets to default memory
- ✅ `resolveOperandToken()` - Parses instruction operands
- ✅ `runCycleAt()` - Executes FETCH/DECODE/EXECUTE cycle
- ✅ `findNextInstructionFrom()` - Finds next instruction
- ✅ `nextInstructionAddress()` - Finds next free instruction slot
- ✅ `nextDataAddrAuto()` - Auto-assigns data addresses

### Memory Structure
```javascript
const memory = new Map();
// Structure: { address => { data: value, source: 'instr'|'data' } }

// Default entries on reset:
// 1-6: Instructions (MOV, ADD, SUB, MUL, DIV, etc.)
// 1000-1003: Data (25, 50, 75, 100)
```

### Default Memory
```
Address  Instruction/Data     Type
------   -----------------   ----
1        MOV R1, #5          INSTR
2        MOV R2, #10         INSTR
3        ADD R3, R1, R2      INSTR
4        SUB R1, R3, R2      INSTR
5        MUL R2, R1, R3      INSTR
6        DIV R3, R2, R1      INSTR
1000     25                  DATA
1001     50                  DATA
1002     75                  DATA
1003     100                 DATA
```

### R1-R3 Layout Change
**Before**: Vertical (separate rows)
```
R1: [____]
R2: [____]
R3: [____]
```

**After**: Horizontal (one row)
```
[R1___]  [R2___]  [R3___]
```

### CSS Classes Added
```css
.gen-regs-row {
  display: flex;           /* Horizontal alignment */
  gap: 8px;               /* Space between registers */
  margin-bottom: 8px;
}

.gen-regs-row .reg-row {
  flex: 1;                /* Equal width sharing */
  display: flex;
  align-items: center;
  gap: 8px;
}

.gen-regs-row .reg-row label {
  width: 35px;            /* Compact labels */
  min-width: 35px;
}
```

### HTML Structure
```html
<div class="registers">
  <!-- NEW: Horizontal R1-R3 group -->
  <div class="gen-regs-row">
    <div class="reg-row"><label>R1</label><input id="r1"></div>
    <div class="reg-row"><label>R2</label><input id="r2"></div>
    <div class="reg-row"><label>R3</label><input id="r3"></div>
  </div>
  
  <!-- Vertical registers below -->
  <div class="reg-row"><label>PC</label><input id="pc"></div>
  <div class="reg-row"><label>IR</label><input id="ir"></div>
  ...
</div>
```

## Execution Flow

### FETCH Phase (900ms)
```javascript
pcField.value = pad(addr);           // Update PC
marField.value = pad(addr);          // Set memory address
glow(addrLine, TIM.fetch + 300);     // Address bus glows YELLOW
glow(memoryCard, TIM.fetch + 300);   // Memory glows GREEN
```

### DECODE Phase (700ms)
```javascript
irField.value = ins;                 // Load instruction
glow(ctrlLine, TIM.decode + 300);    // Control bus glows BLUE
glow(cpuCard, TIM.decode + 300);     // CPU glows CYAN
```

### EXECUTE Phase (900ms)
```javascript
resolveOperandToken(src);            // Parse operands
document.getElementById(dest.toLowerCase()).value = result;
glow(dataLine, TIM.execute + 300);   // Data bus glows RED
glow(cpuCard, TIM.execute + 300);    // CPU glows CYAN
```

## Task Record Format

Each instruction logged with phases:
```
Instruction 1:
--- FETCH ---
Fetching instruction
MOV R1, #5
900ms

--- DECODE ---
Decoded: MOV R1, #5
700ms

--- EXECUTE ---
Moved 5 to R1
900ms
```

## Testing Commands

### Test 1: MOV with Display
```
Input: MOV R1, #10
Expected: R1 shows "10" in horizontal display
```

### Test 2: ADD with Multiple Registers
```
Input:
MOV R1, #5
MOV R2, #3
ADD R3, R1, R2
Expected: R3 shows "8"
```

### Test 3: Memory Operations
```
Input:
MOV R1, #42
STORE R1, 100
Expected: Memory at address 100 = 42
```

### Test 4: Data Storage
```
Click "Set (assign address ≥1000)"
Input: 999
Expected: New entry appears at next available address (1004+)
```

## Color Reference

| Component | Color | Hex | When |
|-----------|-------|-----|------|
| CPU Glow | Cyan | #38bdf8 | Register updates |
| Memory Glow | Green | #4ade80 | LOAD/STORE ops |
| Address Bus | Yellow | #fef08a | FETCH phase |
| Control Bus | Blue | #60a5fa | DECODE phase |
| Data Bus | Red | #ef4444 | EXECUTE phase |

---

**All functionality restored and optimized!** 🎉
