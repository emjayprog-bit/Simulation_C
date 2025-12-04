// modified.js — Modified Harvard Architecture simulation with separate instruction/data memory
// FASTEST - Modern optimized design with cache and advanced features
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
const dataLine = document.getElementById('dataLine');

const cpuCard = document.getElementById('cpuCard');

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

const instrMemoryBody = document.getElementById('instrMemoryBody');
const memoryBody = document.getElementById('memoryBody');

const loadInstructionBtn = document.getElementById('loadInstructionBtn');
const clearInstructionBtn = document.getElementById('clearInstructionBtn');

const dataValueInput = document.getElementById('dataValueInput');
const setDataBtn = document.getElementById('setDataBtn');
const clearDataBtn = document.getElementById('clearDataBtn');

const instructionInput = document.getElementById('instructionInput');
const taskRecord = document.getElementById('taskRecord');
const clearLogsBtn = document.getElementById('clearLogsBtn');

// state
const instrMemory = new Map(); // addresses 0-6 (instructions, blue)
const dataMemory = new Map();  // addresses 1000-1003 (data, green)
let running = false;
let instructionCounter = 0;
let programCounter = 0;

// timings (ms) - MODIFIED HARVARD: FASTEST with modern optimizations
const TIM = { fetch: 700, decode: 600, execute: 800, store: 600, between: 200 };

// default memory entries for Modified Harvard
const INSTR_DEFAULTS = [
  { address: 0, data: 'MOV R1, #5' },
  { address: 1, data: 'MOV R2, #10' },
  { address: 2, data: 'ADD R3, R1, R2' },
  { address: 3, data: 'SUB R1, R3, R2' },
  { address: 4, data: 'MUL R2, R1, R3' },
  { address: 5, data: 'DIV R3, R2, R1' },
  { address: 6, data: 'STORE R3, 1000' }
];

const DATA_DEFAULTS = [
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

// render instruction memory table (addresses 0-6, blue theme)
function renderInstructionMemory(){
  const addrs = Array.from(instrMemory.keys()).map(n=>Number(n)).sort((a,b)=>a-b);
  instrMemoryBody.innerHTML = '';
  for(const a of addrs){
    const entry = instrMemory.get(a);
    const tr = document.createElement('tr');
    tr.dataset.addr = a;
    const tdAddr = document.createElement('td');
    tdAddr.textContent = pad(a);
    const tdData = document.createElement('td');
    tdData.contentEditable = true;
    tdData.textContent = entry;
    tdData.addEventListener('blur', ()=> {
      instrMemory.set(Number(a), tdData.textContent.trim());
    });
    tr.appendChild(tdAddr);
    tr.appendChild(tdData);
    const tdAct = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.className = 'small-btn';
    delBtn.onclick = ()=> {
      instrMemory.delete(Number(a));
      renderInstructionMemory();
    };
    tdAct.appendChild(delBtn);
    tr.appendChild(tdAct);
    instrMemoryBody.appendChild(tr);
  }
}

// render data memory table (addresses 1000-1003, green theme)
function renderDataMemory(){
  const addrs = Array.from(dataMemory.keys()).map(n=>Number(n)).sort((a,b)=>a-b);
  memoryBody.innerHTML = '';
  for(const a of addrs){
    const entry = dataMemory.get(a);
    const tr = document.createElement('tr');
    tr.dataset.addr = a;
    const tdAddr = document.createElement('td');
    tdAddr.textContent = pad(a);
    const tdData = document.createElement('td');
    tdData.contentEditable = true;
    tdData.textContent = entry;
    tdData.addEventListener('blur', ()=> {
      dataMemory.set(Number(a), tdData.textContent.trim());
    });
    tr.appendChild(tdAddr);
    tr.appendChild(tdData);
    const tdAct = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.className = 'small-btn';
    delBtn.onclick = ()=> {
      dataMemory.delete(Number(a));
      renderDataMemory();
    };
    tdAct.appendChild(delBtn);
    tr.appendChild(tdAct);
    memoryBody.appendChild(tr);
  }
}

// reset both memories to defaults
function resetMemory(){
  instrMemory.clear();
  dataMemory.clear();
  for(const d of INSTR_DEFAULTS){
    instrMemory.set(Number(d.address), d.data);
  }
  for(const d of DATA_DEFAULTS){
    dataMemory.set(Number(d.address), d.data);
  }
  renderInstructionMemory();
  renderDataMemory();
  logTask('Both instruction and data memory reset to defaults.');
}

// task logging
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
  taskRecord.appendChild(group);
  taskRecord.scrollTop = taskRecord.scrollHeight;
}

// simple logger
function logTask(msg){
  const now = new Date().toLocaleTimeString();
  const p = document.createElement('div');
  p.className = 'task-line';
  p.textContent = `[${now}] ${msg}`;
  taskRecord.appendChild(p);
  taskRecord.scrollTop = taskRecord.scrollHeight;
}

// clear logs
clearLogsBtn.addEventListener('click', ()=> {
  taskRecord.innerHTML = '';
});

// info modal
infoBtn.addEventListener('click', ()=> {
  infoModal.setAttribute('aria-hidden','false');
});
infoClose?.addEventListener('click', ()=> {
  infoModal.setAttribute('aria-hidden','true');
});

// help modal
helpBtn.addEventListener('click', ()=> {
  helpModal.setAttribute('aria-hidden','false');
});
helpClose?.addEventListener('click', ()=> {
  helpModal.setAttribute('aria-hidden','true');
});

// close modals when clicking outside
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

// load instructions to instruction memory
loadInstructionBtn.addEventListener('click', ()=>{
  const text = instructionInput.value.trim();
  if(!text) {
    logTask('⚠️ No instructions to load. Please enter instructions first.');
    return;
  }
  const lines = text.split('\n').map(l=>l.trim()).filter(Boolean);
  
  instrMemory.clear();
  
  let addr = 0;
  let loadedCount = 0;
  for(const l of lines){
    if(addr <= 6){
      instrMemory.set(addr, l);
      addr++;
      loadedCount++;
    }
  }
  
  instructionInput.value = '';
  renderInstructionMemory();
  
  programCounter = 0;
  instructionCounter = 0;
  pcField.value = pad(0);
  
  logTask(`✅ Loaded ${loadedCount} instruction(s) to instruction memory (addresses 0-${loadedCount-1}).`);
});

clearInstructionBtn.addEventListener('click', ()=> instructionInput.value = '');

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

clearDataBtn.addEventListener('click', ()=> dataValueInput.value = '');

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
    if(dataMemory.has(n)) {
      const v = dataMemory.get(n);
      return Number.isNaN(Number(v)) ? v : Number(v);
    }
    return null;
  }
  if(!Number.isNaN(Number(token))) return Number(token);
  return token;
}

async function runCycleAt(addr){
  if(!instrMemory.has(addr)) {
    appendInstructionLog(`Instruction ${instructionCounter}:`, [`No instruction at address ${pad(addr)}`]);
    return;
  }
  const ins = instrMemory.get(addr);
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
  glow(cpuCard, TIM.fetch + 300);
  await delay(TIM.fetch);
  const fetchTime = (performance.now() - fetchStart).toFixed(2);

  mdrField.value = ins;
  irField.value = ins;
  appendInstructionLog(`Instruction ${instructionCounter}:`, ['--- FETCH ---', `Address: ${pad(addr)}`, `Fetching: ${ins}`, `⏱️ ${fetchTime}ms`]);

  // DECODE
  const decodeStart = performance.now();
  controlUnitLog.textContent = 'Decoded instruction';
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
      if(!Number.isNaN(addrNum) && dataMemory.has(addrNum)){
        const v = dataMemory.get(addrNum);
        if(/^R[123]$/.test(dest)){
          document.getElementById(dest.toLowerCase()).value = safe(v);
          accField.value = safe(v);
          execDetails = `Loaded data memory[${pad(addrNum)}] -> ${dest}`;
          aluExpression = `Load data[${pad(addrNum)}](${safe(v)}) → ${dest}`;
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
        dataMemory.set(addrNum, safe(v));
        renderDataMemory();
        execDetails = `Stored ${src}(${v}) -> data memory[${pad(addrNum)}]`;
        aluExpression = `Store ${src}(${safe(v)}) → data[${pad(addrNum)}]`;
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
  const addrs = Array.from(instrMemory.keys()).map(n=>Number(n)).sort((a,b)=>a-b);
  for(const a of addrs){
    if(a >= start){
      const v = instrMemory.get(a);
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
  programCounter = 0;
  instructionCounter = 0;
  pcField.value = pad(0);
  r1.value = '0';
  r2.value = '0';
  r3.value = '0';
  irField.value = '';
  marField.value = '';
  mdrField.value = '';
  accField.value = '';
  controlUnitLog.textContent = 'Waiting for instruction...';
  aluLog.textContent = 'Ready...';
  logTask('⏹️ Execution stopped. Registers reset.');
});

window.addEventListener('load', ()=> {
  resetMemory();
  updateLines();
});

function updateLines() {
  const leftPanel = document.querySelector('.left-column');
  const cpuCard = document.querySelector('#cpuCard');
  const rightPanel = document.querySelector('.right-column');

  if(!leftPanel || !cpuCard || !rightPanel) return;

  const leftRect = leftPanel.getBoundingClientRect();
  const cpuRect = cpuCard.getBoundingClientRect();
  const rightRect = rightPanel.getBoundingClientRect();

  const instrRed = document.getElementById('instrToCpuRed');
  const instrYellow = document.getElementById('instrToCpuYellow');
  const dataRed = document.getElementById('cpuToDataRed');
  const dataYellow = document.getElementById('cpuToDataYellow');

  if(!instrRed || !instrYellow || !dataRed || !dataYellow) return;

  let startX = leftRect.right;
  let endX = cpuRect.left;
  let width = endX - startX;

  instrRed.style.left = `${startX}px`;
  instrRed.style.width = `${width}px`;
  instrRed.style.top = `${leftRect.top + leftRect.height / 3}px`;

  instrYellow.style.left = `${startX}px`;
  instrYellow.style.width = `${width}px`;
  instrYellow.style.top = `${leftRect.top + leftRect.height / 3 + 20}px`;

  startX = cpuRect.right;
  endX = rightRect.left;
  width = endX - startX;

  dataRed.style.left = `${startX}px`;
  dataRed.style.width = `${width}px`;
  dataRed.style.top = `${cpuRect.top + cpuRect.height / 3}px`;

  dataYellow.style.left = `${startX}px`;
  dataYellow.style.width = `${width}px`;
  dataYellow.style.top = `${cpuRect.top + cpuRect.height / 3 + 20}px`;
}

window.addEventListener('resize', updateLines);