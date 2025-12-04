// von.js — Von Neumann simulation with unified soft-blue glow
// SLOWEST - Single memory bottleneck (Von Neumann bottleneck)
// Elements
const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const infoClose = document.getElementById('infoClose');

const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const helpClose = document.getElementById('helpClose');

const playHeaderBtn = document.getElementById('playHeaderBtn');
const stopHeaderBtn = document.getElementById('stopHeaderBtn');

const addrLine = document.getElementById('addrLine');
const ctrlLine = document.getElementById('ctrlLine');
const dataLine = document.getElementById('dataLine');

const cpuCard = document.getElementById('cpuCard');
const memoryCard = document.getElementById('memoryCard');

const r1 = document.getElementById('r1');
const r2 = document.getElementById('r2');
const r3 = document.getElementById('r3');

const pcField = document.getElementById('pc');
const irField = document.getElementById('ir');
const marField = document.getElementById('mar');
const mdrField = document.getElementById('mdr');
const accField = document.getElementById('acc');

const controlUnitLog = document.getElementById('controlUnitLog');
const aluLog = document.getElementById('aluLog');

const memoryBody = document.getElementById('memoryBody');
const resetMemoryBtn = document.getElementById('resetMemoryBtn');

const instructionInput = document.getElementById('instructionInput');
const loadInstructionBtn = document.getElementById('loadInstructionBtn');
const clearInstructionBtn = document.getElementById('clearInstructionBtn');

const dataValueInput = document.getElementById('dataValueInput');
const setDataBtn = document.getElementById('setDataBtn');
const clearDataBtn = document.getElementById('clearDataBtn');

const taskRecordBox = document.getElementById('taskRecord');
const clearLogsBtn = document.getElementById('clearLogsBtn');

// state
const memory = new Map();
let running = false;
let instructionCounter = 0;
let programCounter = 1;
let nextDataAddress = 1000;

// timings (ms) - VON NEUMANN: SLOWEST due to memory bottleneck
const TIM = { fetch: 1000, decode: 800, execute: 1000, store: 800, between: 300 };

// default memory entries (instructions + numeric data)
const DEFAULTS = [
  { address: 1, data: 'MOV R1, #5' },
  { address: 2, data: 'MOV R2, #10' },
  { address: 3, data: 'ADD R3, R1, R2' },
  { address: 4, data: 'SUB R1, R3, R2' },
  { address: 5, data: 'MUL R2, R1, R3' },
  { address: 6, data: 'DIV R3, R2, R1' },
  { address: 1000, data: '25' },
  { address: 1001, data: '50' },
  { address: 1002, data: '75' },
  { address: 1003, data: '100' }
];

// util helpers
function delay(ms){ return new Promise(res => setTimeout(res, ms)); }
function pad(n){ return String(n).padStart(4,'0'); }
function safe(v){ return v === undefined || v === null ? '' : String(v); }

// DOM helpers for glow
function glow(el, duration = 1200){
  if(!el) return;
  el.classList.add('glow');
  setTimeout(()=> el.classList.remove('glow'), duration + 50);
}

// memory rendering
function renderMemory(){
  const addrs = Array.from(memory.keys()).map(n=>Number(n)).sort((a,b)=>a-b);
  memoryBody.innerHTML = '';
  for(const a of addrs){
    const entry = memory.get(a);
    const tr = document.createElement('tr');
    tr.dataset.addr = a;
    const tdAddr = document.createElement('td');
    tdAddr.textContent = pad(a);
    const tdData = document.createElement('td');
    tdData.contentEditable = true;
    tdData.textContent = entry.data;
    tdData.classList.add(entry.source === 'instr' ? 'row-blue' : (entry.source === 'data' ? 'row-green':''));
    tdData.addEventListener('blur', ()=> {
      memory.set(Number(a), { data: tdData.textContent.trim(), source: entry.source });
    });
    const tdAct = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.className = 'small-btn';
    delBtn.onclick = ()=> {
      memory.delete(Number(a));
      renderMemory();
    };
    tdAct.appendChild(delBtn);

    tr.appendChild(tdAddr);
    tr.appendChild(tdData);
    tr.appendChild(tdAct);
    memoryBody.appendChild(tr);
  }
}

// reset memory to defaults
function resetMemory(){
  memory.clear();
  for(const d of DEFAULTS){
    memory.set(Number(d.address), { data: String(d.data), source: Number(d.address) >= 1000 ? 'data' : 'instr' });
  }
  let maxData = Math.max(...Array.from(memory.keys()).filter(k=>k>=1000), 999);
  nextDataAddress = maxData + 1;
  renderMemory();
  logTask('Memory reset to default entries.');
}

// find next available instruction address (<1000 ideally)
function nextInstructionAddress(){
  for(let i=1;i<1000;i++){
    if(!memory.has(i)) return i;
  }
  let i = 1000;
  while(memory.has(i)) i++;
  return i;
}

// find next available data address (>=1000) and advance the auto pointer
function nextDataAddrAuto(){
  let a = nextDataAddress || 1000;
  while(memory.has(a)) a++;
  nextDataAddress = a + 1;
  return a;
}

// task logging grouped by instruction
function appendInstructionLog(groupTitle, lines){
  const group = document.createElement('div');
  group.className = 'task-group';
  const h = document.createElement('h4');
  h.textContent = groupTitle;
  group.appendChild(h);
  for(const line of lines){
    const p = document.createElement('div');
    p.className = 'task-line';
    p.textContent = line;
    group.appendChild(p);
  }
  taskRecordBox.appendChild(group);
  taskRecordBox.scrollTop = taskRecordBox.scrollHeight;
}

// clear logs
clearLogsBtn.addEventListener('click', ()=> {
  taskRecordBox.innerHTML = '';
});

// info modal
infoBtn.addEventListener('click', ()=> {
  infoModal.setAttribute('aria-hidden','false');
});
infoClose?.addEventListener('click', ()=> {
  infoModal.setAttribute('aria-hidden','true');
});

// close modal when clicking outside
document.addEventListener('click', (e)=> {
  if(infoModal.getAttribute('aria-hidden') === 'false' && 
     !infoModal.contains(e.target) && 
     !infoBtn.contains(e.target)){
    infoModal.setAttribute('aria-hidden','true');
  }
  if(helpModal.getAttribute('aria-hidden') === 'false' && 
     !helpModal.contains(e.target) && 
     !helpBtn.contains(e.target)){
    helpModal.setAttribute('aria-hidden','true');
  }
});

// help modal
helpBtn.addEventListener('click', ()=> {
  helpModal.setAttribute('aria-hidden','false');
});
helpClose?.addEventListener('click', ()=> {
  helpModal.setAttribute('aria-hidden','true');
});

// load instructions
loadInstructionBtn.addEventListener('click', ()=>{
  const text = instructionInput.value.trim();
  if(!text) {
    logTask('⚠️ No instructions to load. Please enter instructions first.');
    return;
  }
  const lines = text.split('\n').map(l=>l.trim()).filter(Boolean);
  
  let loadedCount = 0;
  for(const l of lines){
    const addr = nextInstructionAddress();
    memory.set(addr, { data: l, source: 'instr' });
    loadedCount++;
  }
  
  instructionInput.value = '';
  renderMemory();
  
  programCounter = 1;
  instructionCounter = 0;
  pcField.value = pad(1);
  
  logTask(`✅ Loaded ${loadedCount} instruction(s) to memory.`);
});

clearInstructionBtn.addEventListener('click', ()=> instructionInput.value = '');

setDataBtn.addEventListener('click', ()=>{
  const v = dataValueInput.value.trim();
  if(!v) return;
  const addr = nextDataAddrAuto();
  memory.set(addr, { data: v, source: 'data' });
  renderMemory();
  dataValueInput.value = '';
  logTask(`Direct memory set -> memory[${pad(addr)}] = ${v}`);
});

clearDataBtn.addEventListener('click', ()=> dataValueInput.value = '');

resetMemoryBtn.addEventListener('click', ()=> {
  resetMemory();
});

// simple logger
function logTask(msg){
  const now = new Date().toLocaleTimeString();
  const p = document.createElement('div');
  p.className = 'task-line';
  p.textContent = `[${now}] ${msg}`;
  taskRecordBox.appendChild(p);
  taskRecordBox.scrollTop = taskRecordBox.scrollHeight;
}

function resolveOperandToken(token){
  if(!token) return undefined;
  token = token.trim();
  if(/^R[123]$/i.test(token)){
    const rv = document.getElementById(token.toLowerCase()).value;
    return Number.isNaN(Number(rv)) ? rv : Number(rv);
  }
  if(token.startsWith('#')){
    const lit = token.slice(1);
    const n = Number(lit);
    return Number.isNaN(n) ? lit : n;
  }
  if(/^\d+$/.test(token)){
    const n = Number(token);
    if(memory.has(n)) {
      const v = memory.get(n).data;
      return Number.isNaN(Number(v)) ? v : Number(v);
    }
    return null;
  }
  if(!Number.isNaN(Number(token))) return Number(token);
  return token;
}

async function runCycleAt(addr){
  if(!memory.has(addr)) {
    appendInstructionLog(`Instruction ${instructionCounter}:`, [`No instruction at address ${pad(addr)}`]);
    return;
  }
  const entry = memory.get(addr);
  const ins = safe(entry.data);
  instructionCounter++;

  const cycleStartTime = performance.now();

  // FETCH
  const fetchStart = performance.now();
  pcField.value = pad(addr);
  marField.value = pad(addr);
  controlUnitLog.textContent = 'Fetching instruction';
  mdrField.value = '';
  irField.value = '';
  glow(addrLine, TIM.fetch + 300);
  glow(memoryCard, TIM.fetch + 300);
  await delay(TIM.fetch);
  const fetchTime = (performance.now() - fetchStart).toFixed(2);

  mdrField.value = ins;
  irField.value = ins;
  appendInstructionLog(`Instruction ${instructionCounter}:`, ['--- FETCH ---', `Address: ${pad(addr)}`, `Fetching: ${ins}`, `⏱️ ${fetchTime}ms`]);

  // DECODE
  const decodeStart = performance.now();
  controlUnitLog.textContent = 'Decoded instruction';
  glow(ctrlLine, TIM.decode + 300);
  glow(cpuCard, TIM.decode + 300);
  await delay(TIM.decode);
  const decodeTime = (performance.now() - decodeStart).toFixed(2);
  appendInstructionLog(`Instruction ${instructionCounter}:`, ['--- DECODE ---', `Decoded: ${ins}`, `⏱️ ${decodeTime}ms`]);

  // EXECUTE
  const executeStart = performance.now();
  controlUnitLog.textContent = 'Executing instruction';
  glow(dataLine, TIM.execute + 300);
  glow(cpuCard, TIM.execute + 300);

  const tokens = ins.split(/[\s,]+/).filter(Boolean);
  const op = tokens[0] ? tokens[0].toUpperCase() : '';
  let execDetails = '';
  let aluExpression = '';
  try {
    if(op === 'MOV'){
      const dest = tokens[1].toUpperCase();
      const src = tokens[2];
      const val = resolveOperandToken(src);
      if(/^R[123]$/.test(dest)){
        document.getElementById(dest.toLowerCase()).value = safe(val);
        execDetails = `Moved ${safe(val)} to ${dest}`;
        aluExpression = `Move ${safe(val)} into ${dest}`;
      } else {
        execDetails = `Invalid destination ${dest}`;
        aluExpression = `Error: invalid ${dest}`;
      }
    } else if(['ADD','SUB','MUL','DIV'].includes(op)){
      const dest = tokens[1].toUpperCase();
      const aToken = tokens[2];
      const bToken = tokens[3];
      const aval = resolveOperandToken(aToken);
      const bval = resolveOperandToken(bToken);
      let res = 0;
      let opSymbol = '';
      if(op === 'ADD'){ res = Number(aval) + Number(bval); opSymbol = '+'; }
      if(op === 'SUB'){ res = Number(aval) - Number(bval); opSymbol = '-'; }
      if(op === 'MUL'){ res = Number(aval) * Number(bval); opSymbol = '×'; }
      if(op === 'DIV'){ res = (Number(bval) === 0) ? NaN : (Number(aval) / Number(bval)); opSymbol = '÷'; }
      if(/^R[123]$/.test(dest)){
        document.getElementById(dest.toLowerCase()).value = safe(res);
        accField.value = safe(res);
        execDetails = `${aval} ${opSymbol} ${bval} = ${res}`;
        aluExpression = `${aToken}(${aval}) ${opSymbol} ${bToken}(${bval}) = ${safe(res)} → ${dest}`;
      } else {
        execDetails = `Invalid destination ${dest}`;
        aluExpression = `Error: invalid ${dest}`;
      }
    } else if(op === 'LOAD'){
      const dest = tokens[1].toUpperCase();
      const addrTok = tokens[2];
      const addrNum = Number(addrTok);
      if(!Number.isNaN(addrNum) && memory.has(addrNum)){
        const v = memory.get(addrNum).data;
        if(/^R[123]$/.test(dest)){
          document.getElementById(dest.toLowerCase()).value = safe(v);
          accField.value = safe(v);
          execDetails = `Loaded memory[${pad(addrNum)}] -> ${dest}`;
          aluExpression = `Load address[${pad(addrNum)}](${safe(v)}) → ${dest}`;
        } else {
          execDetails = `Invalid destination ${dest}`;
          aluExpression = `Error: invalid ${dest}`;
        }
      } else {
        execDetails = `LOAD failed: address ${addrTok} not found`;
        aluExpression = `Load error: address[${addrTok}] not found`;
      }
    } else if(op === 'STORE'){
      const src = tokens[1].toUpperCase();
      const addrTok = tokens[2];
      const addrNum = Number(addrTok);
      if(/^R[123]$/.test(src) && !Number.isNaN(addrNum)){
        const v = document.getElementById(src.toLowerCase()).value;
        memory.set(addrNum, { data: safe(v), source: 'data' });
        renderMemory();
        execDetails = `Stored ${src}(${v}) -> memory[${pad(addrNum)}]`;
        aluExpression = `Store ${src}(${safe(v)}) → address[${pad(addrNum)}]`;
      } else {
        execDetails = `STORE failed: invalid`;
        aluExpression = `Store error: invalid`;
      }
    } else {
      execDetails = `Unknown instruction: ${ins}`;
      aluExpression = `Error: unknown instruction`;
    }
  } catch(e){
    execDetails = `Error executing: ${e.message || e}`;
    aluExpression = `Error: ${e.message || e}`;
  }

  aluLog.textContent = aluExpression || 'Executing...';

  await delay(TIM.execute);
  const executeTime = (performance.now() - executeStart).toFixed(2);
  appendInstructionLog(`Instruction ${instructionCounter}:`, ['--- EXECUTE ---', execDetails, `⏱️ ${executeTime}ms`]);

  programCounter = addr + 1;
  pcField.value = pad(programCounter);
  controlUnitLog.textContent = `Completed instruction ${pad(addr)}`;

  await delay(TIM.between);
  
  const totalCycleTime = (performance.now() - cycleStartTime).toFixed(2);
  appendInstructionLog(`Instruction ${instructionCounter}:`, [`✅ Total cycle time: ${totalCycleTime}ms`, `---`]);
}

function findNextInstructionFrom(start){
  const addrs = Array.from(memory.keys()).map(n=>Number(n)).sort((a,b)=>a-b);
  for(const a of addrs){
    if(a >= start){
      const v = memory.get(a).data;
      if(/[A-Za-z]/.test(String(v))) return a;
    }
  }
  return null;
}

playHeaderBtn.addEventListener('click', async ()=>{
  if(!running){
    running = true;
    playHeaderBtn.textContent = 'Pause';
    logTask('🚀 Execution started.');
    while(running){
      const nextAddr = findNextInstructionFrom(programCounter);
      if(nextAddr === null){
        logTask('✅ No more instructions to execute.');
        running = false;
        playHeaderBtn.textContent = 'Play';
        break;
      }
      await runCycleAt(nextAddr);
    }
  } else {
    running = false;
    playHeaderBtn.textContent = 'Play';
    logTask('⏸️ Execution paused.');
  }
});

stopHeaderBtn.addEventListener('click', ()=>{
  running = false;
  playHeaderBtn.textContent = 'Play';
  programCounter = 1;
  instructionCounter = 0;
  pcField.value = pad(programCounter);
  irField.value = mdrField.value = marField.value = accField.value = '';
  r1.value = r2.value = r3.value = '0';
  controlUnitLog.textContent = 'Stopped';
  aluLog.textContent = 'Ready...';
  logTask('⏹️ Execution stopped and registers reset (memory preserved).');
});

(function init(){
  resetMemory();
  programCounter = 1;
  pcField.value = pad(programCounter);
  irField.value = mdrField.value = marField.value = accField.value = '';
  r1.value = r2.value = r3.value = '0';
})();