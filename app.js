const loginView=document.getElementById('loginView'),appView=document.getElementById('appView'),sidebar=document.getElementById('sidebar');
document.getElementById('loginForm').addEventListener('submit',e=>{e.preventDefault();loginView.classList.add('hidden');appView.classList.remove('hidden');toast('Demo dashboard opened');});
document.getElementById('logoutBtn').addEventListener('click',()=>{appView.classList.add('hidden');loginView.classList.remove('hidden');document.getElementById('loginForm').reset();});
document.getElementById('menuToggle').addEventListener('click',()=>sidebar.classList.toggle('open'));
const names=['2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10','2026-11'];
const values=[[2200,120,436],[2400,620,0],[2300,120,0],[2400,200,88],[2600,250,402],[3000,350,304],[2900,180,359],[3600,260,793],[2800,160,1195],[3100,280,1354],[2900,320,1495],[23,0,0]];
const chart=document.getElementById('chart');const max=5000;
names.forEach((m,i)=>{const [loan,pre,solar]=values[i],total=loan+pre+solar;const g=document.createElement('div');g.className='bar-group';g.innerHTML=`<div class="bar-total">${total.toLocaleString('en-IN')}</div><div class="bar" style="height:${total/max*78}%"><span class="loan" style="height:${loan/total*100}%"></span><span class="pre" style="height:${pre/total*100}%"></span><span class="solar" style="height:${solar/total*100}%"></span></div><div class="bar-month">${m}</div>`;chart.appendChild(g)});
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function openPage(name){document.querySelectorAll('.nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===name));document.getElementById('crumb').textContent=name.toUpperCase();const dash=name==='Dashboard';document.getElementById('dashboardPage').classList.toggle('hidden',!dash);document.getElementById('modulePage').classList.toggle('hidden',dash);document.getElementById('moduleTitle').textContent=name;sidebar.classList.remove('open');}
document.querySelectorAll('.nav-item[data-page]').forEach(b=>b.addEventListener('click',()=>openPage(b.dataset.page)));
document.getElementById('addRecord').addEventListener('click',()=>toast('Connect the backend to add and save records'));
document.getElementById('searchInput').addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('#recordsBody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?'':'none')});
document.querySelectorAll('.view-btn').forEach(b=>b.addEventListener('click',()=>toast('Sample record preview')));
