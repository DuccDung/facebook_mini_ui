// ===== Navigation handling =====
document.addEventListener('DOMContentLoaded', function() {
  // Handle nav-btn clicks
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      navButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
    });
  });
});

// ===== Demo data & state =====
const threads = [
  { 
    id: 1, 
    name: "Nguyễn Nguyệt Hà", 
    snippet: "Hue đã gửi một file đính kèm.", 
    time: "3 giờ", 
    avatar: "assets/images/contact-2.png",
    messages: [
      { side: "left", text: "Đêm r nào t hơi kém", timestamp: new Date(Date.now() - 7200000) },
      { side: "left", text: "Dùng từ nào để hiểu hơn đi Tùng", timestamp: new Date(Date.now() - 7140000) },
      { side: "right", text: "))))", timestamp: new Date(Date.now() - 720000) },
      { side: "left", text: "T có thể giữ sự tò mò này đến lúc têo", timestamp: new Date(Date.now() - 120000) },
      { side: "right", text: "Quy cứ", timestamp: new Date(Date.now() - 60000) },
      { side: "right", text: "Đúng rồi", timestamp: new Date(Date.now() - 55000) },
      { side: "right", text: "Là nó đấy", timestamp: new Date(Date.now() - 50000) },
      { side: "right", text: "))))", timestamp: new Date(Date.now() - 10000) },
      { side: "left", text: "Mà giải thích đi mà", timestamp: new Date(Date.now() - 5000) },
      { side: "left", text: "Quy cứ là nnao", timestamp: new Date(Date.now() - 4000) },
      { side: "left", text: "Tức là rũ lời ấy hả", timestamp: new Date(Date.now() - 3000) },
    ]
  },
  { 
    id: 2, 
    name: "Lê Ngọc", 
    snippet: "Bạn: hh • 2 ngày", 
    time: "", 
    avatar: "assets/images/contact-1.png", 
    active: true, 
    messages: [
      { side: "right", text: "h", timestamp: new Date(Date.now() - 3600000) },
      { side: "right", text: "h", timestamp: new Date(Date.now() - 3540000) },
      { side: "right", text: "h", timestamp: new Date(Date.now() - 3480000) },
      { side: "right", text: "h", timestamp: new Date(Date.now() - 3420000) },
      { side: "right", text: "hh", timestamp: new Date(Date.now() - 3360000) },
    ]
  },
  { id: 3, name: "CLC CNTT V-A 1", snippet: "Cờ Tỷ Phú Zagoo: Kiên vừa chơi...", time: "3 ngày", avatar: "assets/images/contact-3.png" },
  { id: 4, name: "Lê Văn Hưng", snippet: "Bạn: Dạ vâng ạ • 6 ngày", time: "", avatar: "assets/images/contact-4.png" },
  { id: 5, name: "Phạm Thị Lượng", snippet: "Con ăn gì để đi mua con • 1 tuần", time: "", avatar: "assets/images/contact-5.png" },
];
let activeThread = threads.find(t => t.active) || threads[0];

// ===== DOM refs =====
const app = document.querySelector('.app');
const threadListEl = document.getElementById('threadList');
const scroller = document.getElementById('messageScroller');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const threadSearch = document.getElementById('threadSearch');
const peerName = document.getElementById('peerName');
const peerStatus = document.getElementById('peerStatus');
const peerAvatar = document.getElementById('peerAvatar');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPanel = document.getElementById('emojiPanel');
const backBtn = document.getElementById('backBtn');
const newMsgBtn = document.getElementById('newMsgBtn');

// Thanh "Đến:" & composer
const toBar = document.getElementById("toBar");
const toInput = document.getElementById("toInput");
const toSearch = document.getElementById("toSearch");
const toSearchResults = document.getElementById("toSearchResults");
const composer = document.querySelector(".composer");

// ===== State cho luồng tạo tin nhắn mới =====
let isComposingNew = false;
let selectedRecipients = [];
let draftThreadId = null; // id thread nháp khi tạo mới

// Ẩn "Đến:" mặc định
toBar.hidden = true;

const isMobile = () => window.matchMedia('(max-width: 900px)').matches;
const showChat = () => app.classList.remove('show-list');
const showList = () => app.classList.add('show-list');

// ===== Threads UI =====
function renderThreads(list){
  threadListEl.innerHTML = '';
  list.forEach(t => {
    const li = document.createElement('li');
    li.className = 'thread-item' + ((activeThread && t.id === activeThread.id) ? ' active':'' );
    li.dataset.id = t.id;

    li.innerHTML = `
      <div class="avatar"><img src="${t.avatar}" alt=""></div>
      <div class="thread-meta">
        <div class="name">${t.name}</div>
        <div class="snippet">${t.snippet || ''}</div>
      </div>
      <div class="thread-time">${t.time || ''}</div>

      <!-- Nút 3 chấm -->
      <button class="icon-btn more-btn">⋮</button>

      <!-- Menu ẩn -->
      <ul class="thread-menu" hidden>
        <li>Đánh dấu là chưa đọc</li>
        <li>Tắt thông báo</li>
        <li>Xem trang cá nhân</li>
        <li>Gọi thoại</li>
        <li>Chat video</li>
        <li>Chặn</li>
        <li>Lưu trữ đoạn chat</li>
        <li>Xóa đoạn chat</li>
        <li>Báo cáo</li>
      </ul>
    `;

    // Khi click vào phần thread -> mở chat
    li.querySelector('.avatar').addEventListener('click', () => {
      setActiveThread(t.id);
      if (isMobile()) showChat();
    });
    li.querySelector('.thread-meta').addEventListener('click', () => {
      setActiveThread(t.id);
      if (isMobile()) showChat();
    });

    // Khi click nút 3 chấm -> toggle menu
    const moreBtn = li.querySelector('.more-btn');
    const menu = li.querySelector('.thread-menu');
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = menu.hasAttribute('hidden');
      document.querySelectorAll('.thread-menu').forEach(m => m.setAttribute('hidden','')); // đóng menu khác
      if (isHidden) {
        menu.removeAttribute('hidden');
      } else {
        menu.setAttribute('hidden','');
      }
    });

    threadListEl.appendChild(li);
  });

  // Đóng menu nếu click ra ngoài
  document.addEventListener('click', () => {
    document.querySelectorAll('.thread-menu').forEach(m => m.setAttribute('hidden',''));
  });
}


// ===== Messages UI =====
function formatTime(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút`;
  if (hours < 24) return `${hours} giờ`;
  return `${days} ngày`;
}

function shouldShowTimestamp(prevTimestamp, currentTimestamp) {
  if (!prevTimestamp) return false;
  const diff = Math.abs(currentTimestamp - prevTimestamp);
  // Hiển thị timestamp nếu cách nhau hơn 5 phút (300000ms)
  return diff > 300000;
}

function renderMessages(){
  scroller.innerHTML = '';
  const messages = activeThread?.messages || [];
  
  messages.forEach((m, index) => {
    const prevMsg = index > 0 ? messages[index - 1] : null;
    const showTimestamp = shouldShowTimestamp(
      prevMsg?.timestamp, 
      m.timestamp
    );
    
    appendMessage(m.text, m.side, false, m.timestamp, showTimestamp);
  });
  
  scroller.scrollTop = scroller.scrollHeight;
}

function appendMessage(text, side='right', push=true, timestamp=null, showTimestamp=false){
  // Nếu cần hiển thị timestamp ở giữa
  if (showTimestamp && timestamp) {
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-timestamp-divider';
    timeDiv.textContent = formatTime(timestamp);
    scroller.appendChild(timeDiv);
  }

  const wrap = document.createElement('div');
  wrap.className = 'bubble-group';
  
  const msg = document.createElement('div');
  msg.className = 'msg ' + (side === 'left' ? 'left' : 'right');
  msg.textContent = text;
  
  // Thêm tooltip thời gian khi hover
  if (timestamp) {
    const tooltip = document.createElement('div');
    tooltip.className = 'message-time-tooltip';
    tooltip.textContent = formatTime(timestamp);
    msg.appendChild(tooltip);
  }
  
  wrap.appendChild(msg);
  scroller.appendChild(wrap);
  
  if (push){
    activeThread.messages = activeThread.messages || [];
    activeThread.messages.push({ 
      side, 
      text, 
      timestamp: timestamp || new Date() 
    });
  }
}

// ===== Tạo/ cập nhật thread nháp khi chọn người nhận =====
function ensureDraftThread(){
  if (!isComposingNew || selectedRecipients.length === 0) return null;

  const name = selectedRecipients.map(r => r.name).join(", ");
  const isGroup = selectedRecipients.length > 1;
  const avatar = isGroup ? "assets/images/group.png" : selectedRecipients[0].avatar;

  let thread;
  if (!draftThreadId){
    threads.forEach(t => t.active = false);
    thread = {
      id: Date.now(),
      name,
      snippet: "Tin nhắn mới",
      time: "",
      avatar,
      active: true,
      messages: [],
      isDraft: true
    };
    draftThreadId = thread.id;
    threads.unshift(thread);
  } else {
    thread = threads.find(t => t.id === draftThreadId);
    if (thread){
      thread.name = name;
      thread.avatar = avatar;
    }
  }

  activeThread = thread;
  renderThreads(threads);

  // Header và UI
  peerAvatar.src = avatar;
  peerName.textContent = "Tin nhắn mới";
  peerStatus.textContent = "";

  // Hiện composer để gõ ngay
  composer.style.display = "flex";
  return thread;
}

// ===== Gửi tin nhắn =====
function sendMessage(){
  const text = msgInput.value.trim();
  if (!text) return;

  // Nếu đang tạo mới, đảm bảo có thread nháp sẵn để nhận tin
  if (isComposingNew && selectedRecipients.length > 0){
    ensureDraftThread();
  }

  // Kiểm tra tin nhắn cuối để quyết định có hiển thị timestamp không
  const lastMsg = activeThread?.messages?.[activeThread.messages.length - 1];
  const now = new Date();
  const showTimestamp = shouldShowTimestamp(lastMsg?.timestamp, now);

  appendMessage(text, 'right', true, now, showTimestamp);

  // Cập nhật snippet/time + đẩy lên đầu
  activeThread.snippet = "Bạn: " + text;
  activeThread.time = "vừa xong";
  const idx = threads.findIndex(t => t.id === activeThread.id);
  if (idx > 0) {
    const [t] = threads.splice(idx, 1);
    threads.unshift(t);
  }
  renderThreads(threads);

  msgInput.value = '';
  scroller.scrollTop = scroller.scrollHeight;

  // Sau khi gửi tin đầu tiên, “đóng” chế độ tạo mới
  if (isComposingNew){
    isComposingNew = false;
    toBar.style.display = "none";
    selectedRecipients = [];
    toSearchResults.innerHTML = "";
    [...toInput.querySelectorAll(".tag")].forEach(t => t.remove());
    draftThreadId = null; // thread nháp đã trở thành thread thật
  }
}
sendBtn?.addEventListener('click', sendMessage);
msgInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); }
});

// ===== Search threads =====
threadSearch?.addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  const filtered = threads.filter(t =>
    t.name.toLowerCase().includes(q) || (t.snippet || '').toLowerCase().includes(q)
  );
  renderThreads(filtered);
});

// ===== Emoji panel =====
// Thay cho: const EMOJIS = "😀😁😂…".split('');
const EMOJIS = [
  0x1F600,0x1F601,0x1F602,0x1F923,0x1F60A,0x1F607,0x1F642,0x1F609,
  0x1F60D,0x1F618,0x1F61C,0x1F92A,0x1F917,0x1F44D,0x1F44C,0x1F525,0x2728,
  0x1F389, /* ❤️ */ 0x2764, /* VS16 */ 0xFE0F,
  0x1F499,0x1F49A,0x1F49B,0x1F49C,0x1F90D,0x1F44F,0x1F64F,0x1F91D,0x1F4AA,
  0x1F914,0x1F928,0x1F634,0x1F60E,0x1F970,0x1F929,0x1F605,0x1F643,0x1F972,
  0x1F60C,0x1F622,0x1F62D,0x1F621,0x1F92F
].reduce((arr, cp, i, a) => {
  // Gộp ❤️ = U+2764 + U+FE0F
  if (cp === 0x2764 && a[i+1] === 0xFE0F) { arr.push(String.fromCodePoint(cp,0xFE0F)); }
  else if (cp !== 0xFE0F) { arr.push(String.fromCodePoint(cp)); }
  return arr;
}, []);
function buildEmojiPanel(){
  const grid = document.createElement('div');
  grid.className = 'emoji-grid';
  EMOJIS.forEach(e => {
    const b = document.createElement('button');
    b.type='button';
    b.textContent = e;
    b.style.border='none'; b.style.background='transparent'; b.style.cursor='pointer';
    b.addEventListener('click', ()=>{ msgInput.value += e; msgInput.focus(); });
    grid.appendChild(b);
  });
  emojiPanel.innerHTML = '';
  emojiPanel.appendChild(grid);
}
emojiBtn?.addEventListener('click', ()=>{
  if (emojiPanel.hasAttribute('hidden')){
    buildEmojiPanel();
    emojiPanel.removeAttribute('hidden');
    emojiPanel.setAttribute('aria-hidden','false');
  }else{
    emojiPanel.setAttribute('hidden','');
    emojiPanel.setAttribute('aria-hidden','true');
  }
});
document.addEventListener('click', e => {
  if (!emojiPanel.contains(e.target) && e.target !== emojiBtn){
    emojiPanel.setAttribute('hidden','');
    emojiPanel.setAttribute('aria-hidden','true');
  }
}, true);

// ===== Mobile back button =====
backBtn?.addEventListener('click', showList);

// ===== INIT =====
renderThreads(threads);
renderMessages();
if (isMobile()) showList();

// =======================
//      NEW MESSAGE
// =======================
toBar.hidden = true;
newMsgBtn.addEventListener("click", () => {
  isComposingNew = true;

  scroller.innerHTML = "";
  peerName.textContent = "Tin nhắn mới";
  peerStatus.textContent = "";
  peerAvatar.src = "assets/images/group.png";

  toBar.style.display = "flex";   // hiện thanh “Đến:”
  toBar.hidden = false;
  composer.style.display = "none"; // chỉ hiện lại khi chọn người

  toSearch.value = "";
  toSearch.focus();
  selectedRecipients = [];
  draftThreadId = null;
  toSearchResults.innerHTML = "";
  [...toInput.querySelectorAll(".tag")].forEach(t => t.remove());

  activeThread = null;
  document.querySelectorAll('.thread-item').forEach(el => el.classList.remove('active'));
});

// ===== Chuyển thread =====
function setActiveThread(id) {
  activeThread = threads.find(t => t.id === id) || threads[0];

  document.querySelectorAll('.thread-item').forEach(el => {
    el.classList.toggle('active', +el.dataset.id === id);
  });

  peerAvatar.src = activeThread.avatar;
  peerName.textContent = activeThread.name;
  peerStatus.textContent = activeThread.time ? ("Hoạt động " + activeThread.time + " trước") : "";

  // reset về trạng thái chat thường
  isComposingNew = false;
  selectedRecipients = [];
  toBar.style.display = "none";
  toSearch.value = "";
  toSearchResults.innerHTML = "";
  [...toInput.querySelectorAll(".tag")].forEach(t => t.remove());
  composer.style.display = "flex";

  renderMessages();
}

// ===== Contacts & chọn người nhận =====
const contacts = [
  { id: 1, name: "Hue Do", avatar: "assets/images/contact-2.png" },
  { id: 2, name: "Lê Ngọc", avatar: "assets/images/contact-1.png" },
  { id: 3, name: "CLC CNTT V-A 1", avatar: "assets/images/contact-3.png" },
  { id: 4, name: "Lê Văn Hưng", avatar: "assets/images/contact-4.png" },
  { id: 5, name: "Phạm Thị Lượng", avatar: "assets/images/contact-5.png" }
];

toSearch.addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();
  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(q) &&
    !selectedRecipients.find(s => s.id === c.id)
  );
  renderRecipientResults(filtered);
});

function renderRecipientResults(list) {
  toSearchResults.innerHTML = "";
  if (!list.length) return;

  const frag = document.createDocumentFragment();
  list.forEach(c => {
    const li = document.createElement("li");
    li.dataset.id = String(c.id);
    li.innerHTML = `<img src="${c.avatar}" alt=""><span>${c.name}</span>`;
    frag.appendChild(li);
  });
  toSearchResults.appendChild(frag);
}

// Uỷ quyền sự kiện để chọn chắc chắn (dropdown không biến mất trước khi chọn)
function handlePick(e){
  const li = e.target.closest("li");
  if (!li || !toSearchResults.contains(li)) return;
  e.preventDefault();
  e.stopPropagation();
  const id = Number(li.dataset.id);
  const user = contacts.find(c => c.id === id);
  if (user) selectRecipient(user);
}
toSearchResults.addEventListener("pointerdown", handlePick);
toSearchResults.addEventListener("click", handlePick);

function selectRecipient(user) {
  if (selectedRecipients.some(u => u.id === user.id)) return;
  selectedRecipients.push(user);

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = user.name;
  toInput.insertBefore(tag, toSearch);

  toSearch.value = "";
  toSearch.focus();
  toSearchResults.innerHTML = "";

  // 👉 tạo/ cập nhật thread nháp & hiện composer
  ensureDraftThread();
}
