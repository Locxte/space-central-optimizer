/* ============================================
   SPACE CENTRAL OPTIMIZER — Application Logic
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
const App = {
    healthScore: 0, targetHealth: 78, gameModeActive: false,
    chartData: { cpu: [], ram: [], disk: [], net: [], gpu: [], uptime: [] },

    // ===== DATA =====
    cleanerCategories: [
        { id: 'temp', name: 'Temporary Files', icon: '📁', color: 'var(--accent)', items: [
            { name: 'Windows Temp', size: '1.2 GB' }, { name: 'User Temp', size: '834 MB' }, { name: 'Prefetch Cache', size: '256 MB' }, { name: 'Crash Dumps', size: '128 MB' }
        ]},
        { id: 'browser', name: 'Browser Cache', icon: '🌐', color: 'var(--info)', items: [
            { name: 'Chrome Cache', size: '2.1 GB' }, { name: 'Firefox Cache', size: '456 MB' }, { name: 'Edge Cache', size: '312 MB' }, { name: 'Cookies', size: '18 MB' }, { name: 'Session Data', size: '45 MB' }
        ]},
        { id: 'system', name: 'System Cache', icon: '⚙️', color: 'var(--success)', items: [
            { name: 'Windows Update Cache', size: '3.4 GB' }, { name: 'Thumbnail Cache', size: '189 MB' }, { name: 'Font Cache', size: '64 MB' }, { name: 'Icon Cache', size: '12 MB' }
        ]},
        { id: 'logs', name: 'Log Files', icon: '📋', color: 'var(--warning)', items: [
            { name: 'Event Logs', size: '567 MB' }, { name: 'Setup Logs', size: '234 MB' }, { name: 'Error Reports', size: '89 MB' }, { name: 'IIS Logs', size: '45 MB' }
        ]},
        { id: 'recycle', name: 'Recycle Bin', icon: '🗑️', color: 'var(--danger)', items: [
            { name: 'Deleted Files', size: '1.8 GB' }, { name: 'Deleted Folders', size: '420 MB' }
        ]},
        { id: 'updates', name: 'Old Updates', icon: '📦', color: '#fd79a8', items: [
            { name: 'Previous Windows', size: '12.4 GB' }, { name: 'Delivery Optimization', size: '890 MB' }, { name: 'Windows.old', size: '8.2 GB' }
        ]},
    ],
    boosterItems: [
        { id: 'ram', name: 'RAM Optimizer', icon: '💾', desc: 'Free up unused memory and optimize allocation.', stats: [['Current Usage','12.4 / 16 GB'],['Can Free','~2.8 GB']] },
        { id: 'cpu', name: 'CPU Optimizer', icon: '🖥️', desc: 'Manage process priorities and reduce background load.', stats: [['Active Processes','247'],['Can Optimize','38 processes']] },
        { id: 'gpu', name: 'GPU Optimizer', icon: '🎮', desc: 'Optimize GPU settings for maximum performance.', stats: [['GPU Temp','62°C'],['VRAM Used','4.2 / 8 GB']] },
        { id: 'power', name: 'Power Plan', icon: '⚡', desc: 'Switch to high-performance power plan.', stats: [['Current Plan','Balanced'],['Recommended','High Performance']] },
        { id: 'services', name: 'Service Manager', icon: '🔧', desc: 'Disable unnecessary Windows services.', stats: [['Running Services','184'],['Non-Essential','23']] },
        { id: 'visual', name: 'Visual Effects', icon: '✨', desc: 'Disable Windows visual effects for speed.', stats: [['Current Mode','Let Windows decide'],['Recommended','Adjust for performance']] },
    ],
    gameTweaks: [
        { name: 'Kill background apps', desc: 'Close non-essential background processes', checked: true },
        { name: 'Set game priority to High', desc: 'Boost active game process priority', checked: true },
        { name: 'Disable Windows animations', desc: 'Turn off all visual effects temporarily', checked: true },
        { name: 'Optimize network for gaming', desc: 'Disable Nagle, enable QoS', checked: true },
        { name: 'Disable fullscreen optimizations', desc: 'Reduce input lag in games', checked: true },
        { name: 'Free RAM before launching', desc: 'Clear standby memory and caches', checked: true },
        { name: 'Disable Game Bar & DVR', desc: 'Stop Windows Game Bar overlay', checked: false },
        { name: 'Set GPU to max performance', desc: 'Override power management for GPU', checked: true },
        { name: 'Disable Cortana & search indexing', desc: 'Free CPU resources from indexing', checked: false },
        { name: 'Disable Windows notifications', desc: 'Prevent popups during gameplay', checked: true },
    ],
    startupItems: [
        { name: 'Discord', path: 'AppData\\Local\\Discord\\Update.exe', icon: '💬', impact: 'medium', enabled: true },
        { name: 'Steam', path: 'Program Files (x86)\\Steam\\steam.exe', icon: '🎮', impact: 'high', enabled: true },
        { name: 'NVIDIA GeForce Experience', path: 'Program Files\\NVIDIA\\NvContainer.exe', icon: '🟢', impact: 'high', enabled: true },
        { name: 'Spotify', path: 'AppData\\Roaming\\Spotify\\Spotify.exe', icon: '🎵', impact: 'medium', enabled: true },
        { name: 'OneDrive', path: 'Program Files\\Microsoft OneDrive\\OneDrive.exe', icon: '☁️', impact: 'medium', enabled: true },
        { name: 'Windows Security', path: 'Program Files\\Windows Defender\\MSASCuiL.exe', icon: '🛡️', impact: 'low', enabled: true },
        { name: 'Corsair iCUE', path: 'Program Files\\Corsair\\iCUE\\iCUE.exe', icon: '💡', impact: 'high', enabled: true },
        { name: 'Epic Games Launcher', path: 'Program Files (x86)\\Epic Games\\Launcher\\EpicGamesLauncher.exe', icon: '🎮', impact: 'high', enabled: false },
        { name: 'Adobe Creative Cloud', path: 'Program Files\\Adobe\\Creative Cloud.exe', icon: '🎨', impact: 'high', enabled: false },
        { name: 'Logitech G HUB', path: 'Program Files\\LGHUB\\lghub.exe', icon: '🖱️', impact: 'medium', enabled: true },
        { name: 'Razer Synapse', path: 'Program Files\\Razer\\Synapse3\\Synapse3.exe', icon: '🐍', impact: 'high', enabled: false },
        { name: 'MSI Afterburner', path: 'Program Files\\MSI Afterburner\\MSIAfterburner.exe', icon: '📊', impact: 'medium', enabled: false },
    ],
    netInfo: [
        ['Adapter', 'Ethernet (Intel I225-V)'], ['Local IP', '192.168.1.105'], ['Gateway', '192.168.1.1'],
        ['DNS Server', '8.8.8.8, 8.8.4.4'], ['MAC Address', 'A4:BB:6D:xx:xx:xx'], ['Link Speed', '1 Gbps'],
    ],
    netTweaks: [
        { name: 'TCP Optimizer', desc: 'Optimize TCP settings for lower latency', checked: false },
        { name: 'Disable Nagle\'s Algorithm', desc: 'Reduce network latency in games', checked: true },
        { name: 'DNS Cache Optimization', desc: 'Increase DNS cache size', checked: false },
        { name: 'Disable Network Throttling', desc: 'Remove Windows network throttling', checked: false },
        { name: 'Enable RSS (Receive Side Scaling)', desc: 'Distribute network processing across CPU cores', checked: false },
        { name: 'Optimize MTU Size', desc: 'Set optimal Maximum Transmission Unit', checked: false },
    ],
    registryIssues: [
        { key: 'HKCU\\Software\\Classes\\.old_ext', type: 'Obsolete Entry', severity: 'low' },
        { key: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\{OLD}', type: 'Invalid Uninstall', severity: 'medium' },
        { key: 'HKCU\\Software\\RemovedApp\\Settings', type: 'Orphaned Key', severity: 'low' },
        { key: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\Deleted', type: 'Invalid Service', severity: 'high' },
        { key: 'HKCR\\CLSID\\{INVALID-COM}', type: 'Invalid COM', severity: 'medium' },
        { key: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\FileExts\\.xyz', type: 'Orphaned Extension', severity: 'low' },
        { key: 'HKLM\\SOFTWARE\\Wow6432Node\\OldApp', type: 'Obsolete Entry', severity: 'low' },
        { key: 'HKCU\\Environment\\OLD_PATH', type: 'Invalid Path', severity: 'medium' },
        { key: 'HKLM\\SOFTWARE\\Microsoft\\Shared Tools\\MSConfig\\startupreg\\removed', type: 'Orphaned Startup', severity: 'high' },
        { key: 'HKCR\\.deleted_type', type: 'Orphaned Extension', severity: 'low' },
        { key: 'HKLM\\SYSTEM\\ControlSet001\\Services\\ObsoleteDriver', type: 'Invalid Driver', severity: 'high' },
        { key: 'HKCU\\Software\\Microsoft\\Office\\OldVersion', type: 'Obsolete Entry', severity: 'medium' },
        { key: 'HKLM\\SOFTWARE\\Classes\\Installer\\Products\\{REMOVED}', type: 'Invalid Installer', severity: 'medium' },
        { key: 'HKCU\\Software\\OldGame\\Config', type: 'Orphaned Key', severity: 'low' },
    ],
    privacyCategories: [
        { name: 'Tracking Cookies', icon: '🍪', items: [['Google Analytics','847 trackers'],['Facebook Pixel','234 trackers'],['DoubleClick','156 trackers'],['Twitter Pixel','89 trackers']] },
        { name: 'Browser History', icon: '📜', items: [['Chrome History','12,847 entries'],['Firefox History','3,421 entries'],['Edge History','1,234 entries'],['Saved Passwords','47 entries']] },
        { name: 'Recent Files', icon: '📂', items: [['Recent Documents','234 entries'],['Recent Media','89 entries'],['Jump Lists','156 entries'],['Clipboard History','23 entries']] },
        { name: 'Telemetry', icon: '📡', items: [['Windows Telemetry','Enabled'],['Diagnostic Data','Full'],['Activity History','Active'],['App Diagnostics','On']] },
        { name: 'Location Data', icon: '📍', items: [['Location History','Enabled'],['WiFi Scanning','Active'],['Bluetooth Scanning','Active']] },
        { name: 'App Permissions', icon: '🔐', items: [['Camera Access','12 apps'],['Microphone Access','8 apps'],['Contacts Access','5 apps'],['Calendar Access','3 apps']] },
    ],
    processes: [
        { name: 'chrome.exe', pid: 14523, cpu: 8.2, ram: '1.4 GB', status: 'running' },
        { name: 'discord.exe', pid: 8234, cpu: 3.1, ram: '512 MB', status: 'running' },
        { name: 'steam.exe', pid: 7812, cpu: 1.5, ram: '256 MB', status: 'running' },
        { name: 'explorer.exe', pid: 4096, cpu: 0.8, ram: '128 MB', status: 'running' },
        { name: 'svchost.exe', pid: 892, cpu: 2.4, ram: '96 MB', status: 'running' },
        { name: 'RuntimeBroker.exe', pid: 6734, cpu: 0.3, ram: '48 MB', status: 'running' },
        { name: 'SearchIndexer.exe', pid: 5678, cpu: 4.7, ram: '180 MB', status: 'running' },
        { name: 'MsMpEng.exe', pid: 3456, cpu: 6.1, ram: '340 MB', status: 'running' },
        { name: 'NvContainer.exe', pid: 9012, cpu: 1.2, ram: '78 MB', status: 'running' },
        { name: 'Cortana.exe', pid: 11234, cpu: 0.1, ram: '64 MB', status: 'suspended' },
        { name: 'OneDrive.exe', pid: 7890, cpu: 0.5, ram: '92 MB', status: 'running' },
        { name: 'SpotifyWebHelper.exe', pid: 6543, cpu: 0.2, ram: '34 MB', status: 'running' },
        { name: 'iCUE.exe', pid: 4567, cpu: 2.8, ram: '156 MB', status: 'running' },
        { name: 'LGHUBAgent.exe', pid: 3210, cpu: 0.9, ram: '67 MB', status: 'running' },
        { name: 'msedge.exe', pid: 15678, cpu: 5.3, ram: '890 MB', status: 'running' },
        { name: 'Code.exe', pid: 12345, cpu: 3.7, ram: '420 MB', status: 'running' },
    ],
    sysInfoSections: [
        { title: 'Operating System', icon: '🖥️', rows: [['OS','Windows 11 Pro'],['Version','23H2 (Build 22635)'],['Architecture','64-bit'],['Install Date','2024-03-15'],['License','Activated']] },
        { title: 'Processor', icon: '⚡', rows: [['CPU','AMD Ryzen 7 5800X'],['Cores/Threads','8C / 16T'],['Base Clock','3.8 GHz'],['Boost Clock','4.7 GHz'],['L3 Cache','32 MB'],['Architecture','Zen 3 (Vermeer)']] },
        { title: 'Memory', icon: '💾', rows: [['Total RAM','32 GB DDR4'],['Speed','3600 MHz'],['Channels','Dual Channel'],['Slots Used','2 / 4'],['Form Factor','DIMM']] },
        { title: 'Graphics', icon: '🎮', rows: [['GPU','NVIDIA RTX 3070'],['VRAM','8 GB GDDR6'],['Driver','546.33'],['Resolution','2560×1440 @ 144Hz'],['Monitor','Dell S2722DGM']] },
        { title: 'Storage', icon: '💿', rows: [['Primary','Samsung 980 Pro 1TB (NVMe)'],['Secondary','Seagate Barracuda 2TB (HDD)'],['Read Speed','7,000 MB/s (NVMe)'],['Write Speed','5,100 MB/s (NVMe)']] },
        { title: 'Network', icon: '🌐', rows: [['Ethernet','Intel I225-V 2.5GbE'],['WiFi','Intel AX210 (WiFi 6E)'],['Bluetooth','5.3'],['Public IP','Detected on scan']] },
        { title: 'Motherboard', icon: '🔧', rows: [['Board','ASUS ROG STRIX B550-F'],['Chipset','AMD B550'],['BIOS','Version 2803'],['BIOS Date','2024-01-20']] },
        { title: 'Audio', icon: '🔊', rows: [['Device','Realtek ALC1220'],['Output','Speakers (HD Audio)'],['Sample Rate','48000 Hz'],['Bit Depth','24-bit']] },
    ],
    securityChecks: [
        { name: 'Windows Firewall', desc: 'Check if firewall is active', icon: '🔥' },
        { name: 'Antivirus Protection', desc: 'Verify real-time protection', icon: '🛡️' },
        { name: 'Windows Update', desc: 'Check for pending updates', icon: '📥' },
        { name: 'User Account Control', desc: 'UAC notification level', icon: '👤' },
        { name: 'BitLocker Encryption', desc: 'Drive encryption status', icon: '🔐' },
        { name: 'Secure Boot', desc: 'UEFI Secure Boot status', icon: '🔒' },
        { name: 'SmartScreen', desc: 'Windows SmartScreen protection', icon: '🖥️' },
        { name: 'Remote Desktop', desc: 'Check for unauthorized RDP', icon: '📡' },
        { name: 'PowerShell Execution Policy', desc: 'Script execution restrictions', icon: '⚡' },
        { name: 'Open Ports', desc: 'Scan for suspicious open ports', icon: '🚪' },
        { name: 'Admin Accounts', desc: 'Review administrator accounts', icon: '👑' },
        { name: 'Password Policy', desc: 'Check password strength requirements', icon: '🔑' },
    ],
    duplicateGroups: [
        { hash: 'a3f8c2', size: '4.2 MB', files: ['C:\\Users\\Documents\\photo_001.jpg','C:\\Users\\Downloads\\photo_001.jpg','C:\\Users\\Desktop\\Backup\\photo_001.jpg'] },
        { hash: 'b7d91e', size: '128 MB', files: ['C:\\Users\\Downloads\\installer_v2.exe','C:\\Users\\Desktop\\installer_v2.exe'] },
        { hash: 'c1e4a9', size: '2.1 MB', files: ['C:\\Users\\Documents\\report.pdf','C:\\Users\\OneDrive\\Documents\\report.pdf','C:\\Users\\Downloads\\report.pdf'] },
        { hash: 'd5f2b8', size: '890 KB', files: ['C:\\Users\\Music\\track01.mp3','C:\\Users\\Downloads\\track01.mp3'] },
        { hash: 'e9a3c7', size: '56 MB', files: ['C:\\Users\\Videos\\clip.mp4','C:\\Users\\Desktop\\clip.mp4','C:\\Users\\OneDrive\\Videos\\clip.mp4'] },
        { hash: 'f2b1d6', size: '340 KB', files: ['C:\\Users\\Documents\\notes.txt','C:\\Users\\Desktop\\notes.txt'] },
    ],

    // ===== INIT =====
    init() {
        this.initNav();
        this.initDashboard();
        this.initConsole();
        this.initCleaner();
        this.initBooster();
        this.initGameMode();
        this.initStartup();
        this.initNetwork();
        this.initRegistry();
        this.initPrivacy();
        this.initDiskAnalyzer();
        this.initProcesses();
        this.initSysInfo();
        this.initBenchmark();
        this.initDuplicates();
        this.initSecurity();
        this.initSettings();
        this.startMonitoring();
        for (let k of Object.keys(this.chartData)) for (let i = 0; i < 30; i++) this.chartData[k].push(Math.random() * 50 + 25);
        this.log('system', 'Space Central Optimizer v4.0.0 initialized');
        this.log('info', 'System scan ready — click Quick Scan to begin.');
        this.log('info', 'Welcome to Space Central. All features are free.');
    },

    // ===== NAVIGATION =====
    initNav() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
                document.getElementById(`tab-${item.dataset.tab}`).classList.add('active');
            });
        });
    },

    // ===== DASHBOARD =====
    initDashboard() {
        this.animateHealth();
        setTimeout(() => {
            const vals = { cpu: 72, mem: 78, disk: 88, sec: 65 };
            for (let [k, v] of Object.entries(vals)) {
                document.getElementById(`${k}Perf`).textContent = v + '%';
                document.getElementById(`${k}Bar`).style.width = v + '%';
            }
        }, 500);
        document.getElementById('btnQuickScan').addEventListener('click', () => this.runQuickScan());
        document.getElementById('btnOptimizeAll').addEventListener('click', () => this.runOptimizeAll());
    },
    animateHealth() {
        const el = document.getElementById('healthScore'), fill = document.getElementById('healthRingFill');
        const circ = 2 * Math.PI * 80; let cur = 0;
        const iv = setInterval(() => { cur++; if (cur > this.targetHealth) return clearInterval(iv);
            el.textContent = cur; fill.style.strokeDashoffset = circ - (cur / 100) * circ; }, 20);
    },
    async runQuickScan() {
        const btn = document.getElementById('btnQuickScan'); btn.classList.add('loading');
        this.setStatus('SCANNING', 'var(--warning)');
        const tasks = ['Scanning temporary files...','Analyzing browser cache...','Checking startup programs...','Scanning registry...','Analyzing memory usage...','Checking disk health...','Evaluating network...','Running security checks...','Scanning for duplicates...','Checking privacy settings...'];
        for (const t of tasks) { this.log('info', t); await this.sleep(300 + Math.random() * 300); }
        this.log('success', 'Scan complete! Found 47 issues across all categories.');
        this.log('warn', '9.7 GB of junk files detected'); this.log('warn', '14 registry errors'); this.log('warn', '4 security concerns');
        this.setStatus('READY', 'var(--success)'); this.showToast('Scan complete — 47 issues found', 'warning');
        btn.classList.remove('loading');
    },
    async runOptimizeAll() {
        const btn = document.getElementById('btnOptimizeAll'); btn.classList.add('loading');
        this.setStatus('OPTIMIZING', 'var(--accent)');
        const steps = [['Clearing temp files...',700,'Removed 3,281 files (2.3 GB)'],['Cleaning browser cache...',600,'Cleared 2.9 GB'],['Optimizing RAM...',700,'Freed 2.1 GB'],['Fixing registry...',900,'Fixed 14 issues'],['Optimizing startup...',500,'Disabled 4 programs'],['Hardening security...',600,'Applied 3 fixes'],['Optimizing network...',400,'TCP optimized']];
        for (const [msg,d,res] of steps) { this.log('info', msg); await this.sleep(d); this.log('success', res); }
        this.targetHealth = 95;
        const el = document.getElementById('healthScore'), fill = document.getElementById('healthRingFill');
        const circ = 2 * Math.PI * 80; let cur = parseInt(el.textContent);
        const iv = setInterval(() => { cur++; if (cur > this.targetHealth) return clearInterval(iv);
            el.textContent = cur; fill.style.strokeDashoffset = circ - (cur / 100) * circ; }, 30);
        this.setStatus('READY', 'var(--success)'); this.showToast('System optimized! Health: 95', 'success');
        btn.classList.remove('loading');
    },

    // ===== MONITORING =====
    startMonitoring() {
        const update = () => {
            document.getElementById('cpuTemp').textContent = (55 + Math.random() * 20 | 0) + '°C';
            document.getElementById('ramUsed').textContent = (10 + Math.random() * 5).toFixed(1) + ' GB';
            document.getElementById('diskFree').textContent = (120 + Math.random() * 30 | 0) + ' GB';
            document.getElementById('netSpeed').textContent = (80 + Math.random() * 120).toFixed(1) + ' Mb/s';
            document.getElementById('gpuTemp').textContent = (50 + Math.random() * 25 | 0) + '°C';
            const h = Math.floor(Math.random() * 72), m = Math.floor(Math.random() * 60);
            document.getElementById('sysUptime').textContent = `${h}h ${m}m`;
            const colors = ['rgba(108,92,231,0.6)','rgba(9,132,227,0.6)','rgba(0,184,148,0.6)','rgba(253,203,110,0.6)','rgba(225,112,85,0.6)','rgba(253,121,168,0.6)'];
            const ids = ['cpuChart','ramChart','diskChart','netChart','gpuChart','uptimeChart'];
            const keys = Object.keys(this.chartData);
            keys.forEach((k, i) => { this.chartData[k].shift(); this.chartData[k].push(Math.random() * 60 + 20); this.drawChart(ids[i], this.chartData[k], colors[i]); });
        };
        update(); setInterval(update, 2000);
    },
    drawChart(id, data, color) {
        const c = document.getElementById(id); if (!c) return;
        const ctx = c.getContext('2d'), w = c.width, h = c.height; ctx.clearRect(0, 0, w, h);
        const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
        ctx.beginPath(); ctx.moveTo(0, h);
        data.forEach((v, i) => ctx.lineTo((i / (data.length - 1)) * w, h - ((v - min) / range) * h * 0.8));
        ctx.lineTo(w, h); ctx.closePath();
        const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, color); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); data.forEach((v, i) => { const x = (i / (data.length - 1)) * w, y = h - ((v - min) / range) * h * 0.8; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.strokeStyle = color.replace('0.6', '1'); ctx.lineWidth = 1.5; ctx.stroke();
    },

    // ===== CONSOLE =====
    initConsole() {
        document.getElementById('consoleClear').addEventListener('click', () => { document.getElementById('consoleLines').innerHTML = ''; this.log('system', 'Console cleared'); });
        document.getElementById('consoleToggle').addEventListener('click', () => { const b = document.getElementById('consoleBody'); b.classList.toggle('collapsed'); document.getElementById('consoleToggle').textContent = b.classList.contains('collapsed') ? '▲' : '▼'; });
    },
    log(type, msg) {
        const c = document.getElementById('consoleLines'), t = new Date().toLocaleTimeString('en-US', { hour12: false });
        const p = { info: 'INFO', success: 'DONE', warn: 'WARN', error: 'FAIL', system: 'SYS ' }[type] || 'LOG';
        const el = document.createElement('div'); el.className = `console-line ${type}`;
        el.innerHTML = `<span class="timestamp">[${t}]</span> <span class="prefix">[${p}]</span> <span class="message">${msg}</span>`;
        c.appendChild(el); document.getElementById('consoleBody').scrollTop = 99999;
        while (c.children.length > 100) c.removeChild(c.firstChild);
    },

    // ===== CLEANER =====
    initCleaner() {
        const grid = document.getElementById('cleanerGrid');
        this.cleanerCategories.forEach(cat => {
            const total = cat.items.reduce((a, it) => a + this.parseSize(it.size), 0);
            grid.innerHTML += `<div class="cleaner-category"><div class="cleaner-cat-header"><label class="imgui-checkbox"><input type="checkbox" checked><span class="checkmark"></span></label><div class="cleaner-cat-info"><span class="cleaner-cat-name">${cat.name}</span><span class="cleaner-cat-size">${this.formatSize(total)}</span></div><div class="cleaner-cat-icon" style="background:${cat.color}22;color:${cat.color}">${cat.icon}</div></div><div class="cleaner-items">${cat.items.map(it => `<div class="cleaner-item"><span>${it.name}</span><span class="item-size">${it.size}</span></div>`).join('')}</div></div>`;
        });
        const totalSize = this.cleanerCategories.reduce((a, c) => a + c.items.reduce((b, it) => b + this.parseSize(it.size), 0), 0);
        const totalFiles = this.cleanerCategories.reduce((a, c) => a + c.items.length, 0);
        document.getElementById('totalJunk').textContent = this.formatSize(totalSize);
        document.getElementById('totalFiles').textContent = (totalFiles * 847).toLocaleString();
        document.getElementById('btnScanJunk').addEventListener('click', () => this.scanJunk());
        document.getElementById('btnCleanAll').addEventListener('click', () => this.cleanAll());
    },
    async scanJunk() {
        const btn = document.getElementById('btnScanJunk'); btn.classList.add('loading');
        this.log('info', 'Deep scanning for junk files...'); await this.sleep(2500);
        this.log('success', 'Deep scan complete.'); this.showToast('Found removable files', 'info'); btn.classList.remove('loading');
    },
    async cleanAll() {
        document.getElementById('cleanProgress').style.display = 'block'; this.setStatus('CLEANING', 'var(--danger)'); this.log('system', 'Starting cleanup...');
        let files = 0, space = 0;
        for (let i = 0; i <= 100; i += 2) {
            await this.sleep(60); document.getElementById('cleanBar').style.width = i + '%'; document.getElementById('cleanPercentage').textContent = i + '%';
            if (i % 10 === 0 && i > 0) { files += Math.floor(Math.random() * 300) + 50; space += Math.random() * 1.5;
                document.getElementById('cleanCurrentFile').textContent = `Cleaning category ${Math.ceil(i / 17)}...`;
                document.getElementById('cleanFilesRemoved').textContent = files.toLocaleString(); document.getElementById('cleanSpaceFreed').textContent = space.toFixed(1) + ' GB'; }
        }
        document.getElementById('cleanCurrentFile').textContent = 'Cleanup complete!';
        this.log('success', `Cleaned ${files.toLocaleString()} files (${space.toFixed(1)} GB freed)`);
        this.setStatus('READY', 'var(--success)'); this.showToast(`Freed ${space.toFixed(1)} GB!`, 'success');
    },

    // ===== BOOSTER =====
    initBooster() {
        const grid = document.getElementById('boosterGrid');
        this.boosterItems.forEach(b => {
            grid.innerHTML += `<div class="booster-card"><div class="booster-card-header"><div class="booster-icon" style="background:var(--accent-dim);color:var(--accent)">${b.icon}</div><h3>${b.name}</h3></div><p class="booster-desc">${b.desc}</p><div class="booster-stats">${b.stats.map(([l, v]) => `<div class="booster-stat"><span class="bs-label">${l}</span><span class="bs-value">${v}</span></div>`).join('')}</div><button class="btn btn-outline boost-btn" data-boost="${b.id}">⚡ Optimize</button></div>`;
        });
        grid.querySelectorAll('[data-boost]').forEach(btn => btn.addEventListener('click', async () => {
            btn.classList.add('loading'); this.log('info', `Boosting ${btn.dataset.boost}...`); await this.sleep(1500);
            this.log('success', `${btn.dataset.boost} optimized!`); this.showToast(`${btn.dataset.boost} optimized`, 'success'); btn.classList.remove('loading');
        }));
        document.getElementById('btnBoostAll').addEventListener('click', async () => {
            const btn = document.getElementById('btnBoostAll'); btn.classList.add('loading'); this.setStatus('BOOSTING', 'var(--accent)');
            for (const b of this.boosterItems) { this.log('info', `Optimizing ${b.name}...`); await this.sleep(800); this.log('success', `${b.name} done`); }
            this.setStatus('READY', 'var(--success)'); this.showToast('All systems boosted!', 'success'); btn.classList.remove('loading');
        });
    },

    // ===== GAME MODE =====
    initGameMode() {
        const body = document.getElementById('gmTweaksBody');
        this.gameTweaks.forEach((tw, i) => {
            body.innerHTML += `<div class="tweak-item"><div class="tweak-info"><span class="tweak-name">${tw.name}</span><span class="tweak-desc">${tw.desc}</span></div><label class="imgui-toggle"><input type="checkbox" ${tw.checked ? 'checked' : ''} data-gm="${i}"><span class="toggle-slider"></span></label></div>`;
        });
        document.getElementById('btnGameMode').addEventListener('click', () => this.toggleGameMode());
    },
    async toggleGameMode() {
        const btn = document.getElementById('btnGameMode'); btn.classList.add('loading');
        this.gameModeActive = !this.gameModeActive;
        if (this.gameModeActive) {
            this.setStatus('GAME MODE', 'var(--success)'); this.log('system', '🎮 Activating Game Mode...');
            const steps = ['Killing background processes...','Setting game priority to High...','Disabling visual effects...','Optimizing network for gaming...','Freeing RAM...','Disabling overlays...'];
            for (const s of steps) { this.log('info', s); await this.sleep(500); }
            document.getElementById('gmTitle').textContent = '🟢 Game Mode is ON';
            document.getElementById('gmFps').textContent = '+15-25%'; document.getElementById('gmRamFreed').textContent = '2.4 GB';
            document.getElementById('gmProcsKilled').textContent = '14'; document.getElementById('gmLatency').textContent = '-8ms';
            btn.textContent = 'Deactivate Game Mode'; btn.style.background = 'var(--danger)'; btn.style.borderColor = 'var(--danger)';
            this.log('success', 'Game Mode activated! System optimized for gaming.'); this.showToast('🎮 Game Mode ON', 'success');
        } else {
            this.log('system', 'Deactivating Game Mode...'); await this.sleep(1000);
            document.getElementById('gmTitle').textContent = 'Game Mode is OFF';
            document.getElementById('gmFps').textContent = '--'; document.getElementById('gmRamFreed').textContent = '--';
            document.getElementById('gmProcsKilled').textContent = '--'; document.getElementById('gmLatency').textContent = '--';
            btn.textContent = 'Activate Game Mode'; btn.style.background = ''; btn.style.borderColor = '';
            this.setStatus('READY', 'var(--success)'); this.log('success', 'Game Mode deactivated.'); this.showToast('Game Mode OFF', 'info');
        }
        btn.classList.remove('loading');
    },

    // ===== STARTUP =====
    initStartup() {
        this.renderStartup();
        document.getElementById('btnDisableAll').addEventListener('click', () => {
            this.startupItems.forEach(it => { if (it.impact !== 'low') it.enabled = false; }); this.renderStartup();
            this.log('success', 'Disabled non-essential startup programs.'); this.showToast('Non-essential programs disabled', 'success');
        });
    },
    renderStartup() {
        const c = document.getElementById('startupList'); c.innerHTML = '';
        this.startupItems.forEach((it, i) => {
            const el = document.createElement('div'); el.className = 'startup-item';
            el.innerHTML = `<div class="startup-item-icon">${it.icon}</div><div class="startup-item-info"><span class="startup-item-name">${it.name}</span><span class="startup-item-path">${it.path}</span></div><span class="startup-impact impact-${it.impact}">${it.impact.toUpperCase()}</span><label class="imgui-toggle"><input type="checkbox" ${it.enabled ? 'checked' : ''} data-si="${i}"><span class="toggle-slider"></span></label>`;
            el.querySelector('input').addEventListener('change', e => { this.startupItems[i].enabled = e.target.checked; this.log('info', `${e.target.checked ? 'Enabled' : 'Disabled'}: ${it.name}`); });
            c.appendChild(el);
        });
    },

    // ===== NETWORK =====
    initNetwork() {
        const grid = document.getElementById('netInfoGrid');
        this.netInfo.forEach(([l, v]) => grid.innerHTML += `<div class="net-info-item"><span class="ni-label">${l}</span><span class="ni-value">${v}</span></div>`);
        const body = document.getElementById('netTweaksBody');
        this.netTweaks.forEach(tw => body.innerHTML += `<div class="tweak-item"><div class="tweak-info"><span class="tweak-name">${tw.name}</span><span class="tweak-desc">${tw.desc}</span></div><label class="imgui-toggle"><input type="checkbox" ${tw.checked ? 'checked' : ''}><span class="toggle-slider"></span></label></div>`);
        document.getElementById('btnSpeedTest').addEventListener('click', () => this.speedTest());
        document.getElementById('btnFlushDns').addEventListener('click', async () => { this.log('info', 'Flushing DNS...'); await this.sleep(1000); this.log('success', 'DNS flushed.'); this.showToast('DNS cache flushed', 'success'); });
    },
    async speedTest() {
        const btn = document.getElementById('btnSpeedTest'); btn.classList.add('loading'); this.setStatus('TESTING', 'var(--info)');
        document.getElementById('speedDown').textContent = '...'; document.getElementById('speedUp').textContent = '...'; document.getElementById('speedPing').textContent = '...';
        await this.sleep(1500); const d = (200 + Math.random() * 300).toFixed(1); document.getElementById('speedDown').textContent = d;
        await this.sleep(1200); const u = (50 + Math.random() * 100).toFixed(1); document.getElementById('speedUp').textContent = u;
        await this.sleep(800); const p = (5 + Math.random() * 25 | 0); document.getElementById('speedPing').textContent = p;
        this.log('success', `Speed test: ↓${d} ↑${u} Mb/s, ${p}ms`); this.setStatus('READY', 'var(--success)');
        this.showToast(`↓${d} ↑${u} Mb/s, ${p}ms`, 'success'); btn.classList.remove('loading');
    },

    // ===== REGISTRY =====
    initRegistry() {
        document.getElementById('btnScanRegistry').addEventListener('click', () => this.scanRegistry());
        document.getElementById('btnFixRegistry').addEventListener('click', () => this.fixRegistry());
    },
    async scanRegistry() {
        const btn = document.getElementById('btnScanRegistry'), c = document.getElementById('registryResults'); btn.classList.add('loading'); c.innerHTML = '';
        this.setStatus('SCANNING', 'var(--warning)'); this.log('info', 'Scanning registry...');
        for (const issue of this.registryIssues) { await this.sleep(150 + Math.random() * 200);
            c.innerHTML += `<div class="registry-item"><div class="registry-severity ${issue.severity}"></div><span class="registry-key">${issue.key}</span><span class="registry-type">${issue.type}</span></div>`; }
        this.log('success', `Found ${this.registryIssues.length} registry issues.`); this.setStatus('READY', 'var(--success)');
        this.showToast(`${this.registryIssues.length} registry issues`, 'warning'); btn.classList.remove('loading');
    },
    async fixRegistry() {
        const btn = document.getElementById('btnFixRegistry'), c = document.getElementById('registryResults'); btn.classList.add('loading');
        this.setStatus('FIXING', 'var(--accent)');
        const items = c.querySelectorAll('.registry-item');
        for (const it of items) { await this.sleep(200); it.style.opacity = '0.3'; it.style.textDecoration = 'line-through'; }
        await this.sleep(500);
        c.innerHTML = `<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><p style="color:var(--success)">All registry issues fixed!</p></div>`;
        this.log('success', 'All registry issues fixed.'); this.setStatus('READY', 'var(--success)'); this.showToast('Registry fixed!', 'success'); btn.classList.remove('loading');
    },

    // ===== PRIVACY =====
    initPrivacy() {
        const grid = document.getElementById('privacyGrid');
        this.privacyCategories.forEach(cat => {
            grid.innerHTML += `<div class="privacy-card"><div class="privacy-card-header"><span class="privacy-card-icon">${cat.icon}</span><h3>${cat.name}</h3></div><div class="privacy-items">${cat.items.map(([n, c]) => `<div class="privacy-item"><span class="privacy-item-name">${n}</span><span class="privacy-item-count">${c}</span></div>`).join('')}</div></div>`;
        });
        document.getElementById('btnPrivacyScan').addEventListener('click', async () => {
            const btn = document.getElementById('btnPrivacyScan'); btn.classList.add('loading'); this.log('info', 'Scanning for trackers...');
            await this.sleep(2000); this.log('success', 'Found 1,326 tracking items.'); this.showToast('1,326 tracking items found', 'warning'); btn.classList.remove('loading');
        });
        document.getElementById('btnPrivacyClean').addEventListener('click', async () => {
            const btn = document.getElementById('btnPrivacyClean'); btn.classList.add('loading'); this.log('info', 'Cleaning privacy data...');
            await this.sleep(2500); this.log('success', 'All tracking data removed.'); this.showToast('Privacy cleaned!', 'success'); btn.classList.remove('loading');
        });
    },

    // ===== DISK ANALYZER =====
    initDiskAnalyzer() {
        const drives = [
            { letter: 'C:', total: 953, used: 634, type: 'NVMe SSD' },
            { letter: 'D:', total: 1863, used: 1247, type: 'HDD' },
        ];
        const overview = document.getElementById('diskOverview');
        drives.forEach(d => {
            const pct = ((d.used / d.total) * 100).toFixed(1);
            const color = pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--success)';
            overview.innerHTML += `<div class="disk-drive-card"><h3>💿 ${d.letter} (${d.type})</h3><div class="disk-usage-bar"><div class="disk-usage-fill" style="width:${pct}%;background:${color}"></div></div><div class="disk-info-row"><span>${d.used} GB used</span><span>${d.total - d.used} GB free</span><span>${pct}%</span></div></div>`;
        });
        const cats = [
            { name: 'System', size: '45.2 GB', color: 'var(--accent)' }, { name: 'Applications', size: '128.7 GB', color: 'var(--info)' },
            { name: 'Games', size: '312.4 GB', color: 'var(--success)' }, { name: 'Documents', size: '23.1 GB', color: 'var(--warning)' },
            { name: 'Media', size: '89.3 GB', color: '#fd79a8' }, { name: 'Downloads', size: '34.8 GB', color: 'var(--danger)' },
            { name: 'Temporary', size: '8.9 GB', color: '#00cec9' }, { name: 'Other', size: '45.6 GB', color: '#636e72' },
        ];
        const bd = document.getElementById('diskBreakdown');
        cats.forEach(c => bd.innerHTML += `<div class="disk-cat"><div class="disk-cat-color" style="background:${c.color}"></div><div class="disk-cat-info"><span class="disk-cat-name">${c.name}</span><span class="disk-cat-size">${c.size}</span></div></div>`);
        document.getElementById('btnAnalyzeDisk').addEventListener('click', async () => {
            const btn = document.getElementById('btnAnalyzeDisk'); btn.classList.add('loading'); this.log('info', 'Analyzing disk usage...');
            await this.sleep(3000); this.log('success', 'Disk analysis complete.'); this.showToast('Disk analysis complete', 'success'); btn.classList.remove('loading');
        });
    },

    // ===== PROCESSES =====
    initProcesses() {
        this.renderProcesses();
        document.getElementById('btnRefreshProcs').addEventListener('click', () => { this.processes.forEach(p => { p.cpu = +(Math.random() * 10).toFixed(1); }); this.renderProcesses(); this.log('info', 'Process list refreshed.'); });
        document.getElementById('btnKillSelected').addEventListener('click', () => { this.showToast('Select processes to end', 'info'); });
    },
    renderProcesses() {
        const body = document.getElementById('processTableBody'); body.innerHTML = '';
        this.processes.sort((a, b) => b.cpu - a.cpu).forEach((p, i) => {
            body.innerHTML += `<tr><td><input type="checkbox" style="accent-color:var(--accent)"></td><td class="proc-name">${p.name}</td><td>${p.pid}</td><td style="color:${p.cpu > 5 ? 'var(--danger)' : 'var(--text-secondary)'}">${p.cpu}%</td><td>${p.ram}</td><td><span class="proc-status ${p.status}">${p.status}</span></td><td><button class="btn-kill" data-pi="${i}">End</button></td></tr>`;
        });
        body.querySelectorAll('.btn-kill').forEach(btn => btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.pi); const name = this.processes[idx].name;
            this.processes.splice(idx, 1); this.renderProcesses();
            this.log('warn', `Terminated: ${name}`); this.showToast(`${name} terminated`, 'warning');
        }));
    },

    // ===== SYSTEM INFO =====
    initSysInfo() {
        const grid = document.getElementById('sysinfoGrid');
        this.sysInfoSections.forEach(sec => {
            grid.innerHTML += `<div class="sysinfo-card"><div class="sysinfo-card-header"><span class="si-icon">${sec.icon}</span><h3>${sec.title}</h3></div><div class="sysinfo-rows">${sec.rows.map(([l, v]) => `<div class="sysinfo-row"><span class="si-label">${l}</span><span class="si-value">${v}</span></div>`).join('')}</div></div>`;
        });
        document.getElementById('btnCopySysInfo').addEventListener('click', () => {
            const text = this.sysInfoSections.map(s => `[${s.title}]\n${s.rows.map(([l, v]) => `  ${l}: ${v}`).join('\n')}`).join('\n\n');
            navigator.clipboard.writeText(text).then(() => this.showToast('System info copied!', 'success'));
        });
    },

    // ===== BENCHMARK =====
    initBenchmark() {
        document.getElementById('btnRunBenchmark').addEventListener('click', () => this.runBenchmark());
    },
    async runBenchmark() {
        const btn = document.getElementById('btnRunBenchmark'), c = document.getElementById('benchmarkResults');
        btn.classList.add('loading'); c.innerHTML = '<div class="benchmark-bars" id="benchBars"></div>';
        this.setStatus('BENCHMARKING', 'var(--accent)');
        const tests = [
            { name: 'CPU Single-Core', max: 2000, color: 'var(--accent)' },
            { name: 'CPU Multi-Core', max: 15000, color: 'var(--info)' },
            { name: 'Memory Bandwidth', max: 50000, color: 'var(--success)' },
            { name: 'Disk Sequential Read', max: 7000, color: 'var(--warning)' },
            { name: 'Disk Sequential Write', max: 5000, color: '#fd79a8' },
            { name: 'GPU Compute', max: 20000, color: 'var(--danger)' },
            { name: '3D Rendering', max: 10000, color: '#00cec9' },
        ];
        const bars = document.getElementById('benchBars'); let totalScore = 0;
        for (const test of tests) {
            this.log('info', `Running ${test.name} benchmark...`); await this.sleep(800 + Math.random() * 600);
            const score = Math.floor(test.max * (0.6 + Math.random() * 0.35)); totalScore += score;
            const pct = (score / test.max * 100).toFixed(0);
            bars.innerHTML += `<div class="bench-item"><div class="bench-item-header"><span class="bench-item-name">${test.name}</span><span class="bench-item-score">${score.toLocaleString()}</span></div><div class="bench-bar"><div class="bench-bar-fill" style="width:${pct}%;background:${test.color}"></div></div></div>`;
        }
        const avg = Math.floor(totalScore / tests.length);
        const rating = avg > 8000 ? 'Excellent' : avg > 5000 ? 'Very Good' : avg > 3000 ? 'Good' : 'Average';
        const rColor = avg > 8000 ? 'var(--success)' : avg > 5000 ? 'var(--info)' : avg > 3000 ? 'var(--warning)' : 'var(--danger)';
        c.innerHTML += `<div class="benchmark-total"><span class="bench-total-score">${avg.toLocaleString()}</span><span class="bench-total-label">Overall Score</span><span class="bench-rating" style="color:${rColor}">${rating}</span></div>`;
        this.log('success', `Benchmark complete! Score: ${avg.toLocaleString()} (${rating})`);
        this.setStatus('READY', 'var(--success)'); this.showToast(`Benchmark: ${avg.toLocaleString()} — ${rating}`, 'success'); btn.classList.remove('loading');
    },

    // ===== DUPLICATES =====
    initDuplicates() {
        document.getElementById('btnScanDuplicates').addEventListener('click', () => this.scanDuplicates());
        document.getElementById('btnDeleteDuplicates').addEventListener('click', () => { this.showToast('Select duplicate files to delete', 'info'); });
    },
    async scanDuplicates() {
        const btn = document.getElementById('btnScanDuplicates'), c = document.getElementById('duplicatesResults');
        btn.classList.add('loading'); c.innerHTML = ''; this.log('info', 'Scanning for duplicate files...');
        this.setStatus('SCANNING', 'var(--warning)');
        for (const group of this.duplicateGroups) {
            await this.sleep(400 + Math.random() * 400);
            c.innerHTML += `<div class="dup-group"><div class="dup-group-header"><span>Hash: ${group.hash}... (${group.files.length} copies)</span><span class="dup-group-size">${group.size}</span></div>${group.files.map(f => `<div class="dup-file"><input type="checkbox" style="accent-color:var(--accent)"><span class="dup-file-path">${f}</span><span class="dup-file-size">${group.size}</span></div>`).join('')}</div>`;
        }
        const total = this.duplicateGroups.reduce((a, g) => a + (g.files.length - 1), 0);
        this.log('success', `Found ${this.duplicateGroups.length} duplicate groups (${total} extra copies).`);
        this.setStatus('READY', 'var(--success)'); this.showToast(`${total} duplicate files found`, 'warning'); btn.classList.remove('loading');
    },

    // ===== SECURITY =====
    initSecurity() {
        document.getElementById('btnSecurityScan').addEventListener('click', () => this.securityScan());
    },
    async securityScan() {
        const btn = document.getElementById('btnSecurityScan'), c = document.getElementById('securityResults'), sc = document.getElementById('securityScoreSection');
        btn.classList.add('loading'); c.innerHTML = ''; sc.innerHTML = ''; this.setStatus('SCANNING', 'var(--warning)');
        let pass = 0, warn = 0, fail = 0;
        for (const check of this.securityChecks) {
            this.log('info', `Checking ${check.name}...`); await this.sleep(300 + Math.random() * 300);
            const r = Math.random(); let status, statusClass, statusText;
            if (r > 0.3) { status = 'pass'; statusClass = 'sec-pass'; statusText = 'SECURE'; pass++; }
            else if (r > 0.1) { status = 'warn'; statusClass = 'sec-warn'; statusText = 'WARNING'; warn++; }
            else { status = 'fail'; statusClass = 'sec-fail'; statusText = 'VULNERABLE'; fail++; }
            c.innerHTML += `<div class="security-item"><span class="sec-status-icon">${check.icon}</span><div class="sec-item-info"><span class="sec-item-name">${check.name}</span><span class="sec-item-desc">${check.desc}</span></div><span class="sec-item-status ${statusClass}">${statusText}</span></div>`;
        }
        const score = Math.floor((pass / this.securityChecks.length) * 100);
        const scoreColor = score > 80 ? 'var(--success)' : score > 50 ? 'var(--warning)' : 'var(--danger)';
        sc.innerHTML = `<div class="sec-score-card"><span class="sec-score-value" style="color:${scoreColor}">${score}%</span><span class="sec-score-label">Security Score</span></div><div class="sec-score-card"><span class="sec-score-value" style="color:var(--success)">${pass}</span><span class="sec-score-label">Passed</span></div><div class="sec-score-card"><span class="sec-score-value" style="color:var(--warning)">${warn}</span><span class="sec-score-label">Warnings</span></div><div class="sec-score-card"><span class="sec-score-value" style="color:var(--danger)">${fail}</span><span class="sec-score-label">Failed</span></div>`;
        this.log('success', `Security scan complete. Score: ${score}% (${pass} pass, ${warn} warn, ${fail} fail)`);
        this.setStatus('READY', 'var(--success)'); this.showToast(`Security: ${score}%`, score > 70 ? 'success' : 'warning'); btn.classList.remove('loading');
    },

    // ===== SETTINGS =====
    initSettings() {
        document.querySelectorAll('.color-swatch').forEach(sw => sw.addEventListener('click', () => {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active')); sw.classList.add('active');
            const c = sw.dataset.color; document.documentElement.style.setProperty('--accent', c);
            document.documentElement.style.setProperty('--accent-hover', this.lighten(c, 15));
            document.documentElement.style.setProperty('--accent-dim', c + '26');
            document.documentElement.style.setProperty('--accent-glow', c + '4D');
            this.log('info', `Accent color: ${c}`);
        }));
        document.getElementById('toggleScanlines').addEventListener('change', e => document.querySelector('.scanlines').classList.toggle('hidden', !e.target.checked));
        document.getElementById('fontSizeSlider').addEventListener('input', e => { document.documentElement.style.setProperty('--font-size', e.target.value + 'px'); document.getElementById('fontSizeValue').textContent = e.target.value + 'px'; });
    },

    // ===== UTILITIES =====
    setStatus(text, color) {
        const el = document.getElementById('statusText'), dot = document.querySelector('.status-dot');
        el.textContent = text; el.style.color = color; dot.style.background = color; dot.style.boxShadow = `0 0 6px ${color}`;
    },
    showToast(msg, type = 'info') {
        document.querySelectorAll('.toast').forEach(t => t.remove());
        const icons = { success: '✓', warning: '⚠', error: '✕', info: 'ℹ' };
        const t = document.createElement('div'); t.className = `toast ${type}`;
        t.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${msg}</span>`;
        document.body.appendChild(t);
        setTimeout(() => { t.classList.add('hiding'); setTimeout(() => t.remove(), 300); }, 3500);
    },
    sleep(ms) { return new Promise(r => setTimeout(r, ms)); },
    lighten(hex, pct) {
        const n = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (n >> 16) + Math.round(2.55 * pct));
        const g = Math.min(255, ((n >> 8) & 0xFF) + Math.round(2.55 * pct));
        const b = Math.min(255, (n & 0xFF) + Math.round(2.55 * pct));
        return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    parseSize(str) {
        const m = str.match(/([\d.]+)\s*(GB|MB|KB)/i);
        if (!m) return 0; const v = parseFloat(m[1]);
        return m[2].toUpperCase() === 'GB' ? v * 1024 : m[2].toUpperCase() === 'MB' ? v : v / 1024;
    },
    formatSize(mb) { return mb >= 1024 ? (mb / 1024).toFixed(1) + ' GB' : mb.toFixed(0) + ' MB'; },
};
App.init();
});
