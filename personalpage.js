// ========================= FULL SCRIPT (đã sửa) =========================
document.addEventListener('DOMContentLoaded', function () {
  // ====================== TIỆN ÍCH NHANH ======================
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ====================== PROFILE DROPDOWN (GIỮ NGUYÊN) ======================
  const profileTrigger = document.getElementById('profileMenuTrigger');
  const profileMenu = document.getElementById('profileMenu');
  const allMenuViews = document.querySelectorAll('.menu-view');

  function showMenuView(viewId) {
    allMenuViews.forEach((v) => (v.style.display = 'none'));
    const viewToShow = document.getElementById(viewId);
    if (viewToShow) viewToShow.style.display = 'block';
  }

  if (profileTrigger && profileMenu) {
    profileTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isActive = profileMenu.classList.toggle('active');
      if (isActive) {
            showMenuView('main-menu-view');  // Hiển thị menu chính khi bật menu
      }
    });

    document.addEventListener('click', function (e) {
      if (profileMenu.classList.contains('active') && !profileMenu.contains(e.target) && !profileTrigger.contains(e.target)) {
        profileMenu.classList.remove('active');
      }
    });

    profileMenu.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    const dispTrig = document.getElementById('displayAccessibilityTrigger');
    const setTrig = document.getElementById('settingsPrivacyTrigger');
    const helpTrig = document.getElementById('helpSupportTrigger');
    const langTrig = document.getElementById('languageMenuTrigger');
    const langListTrig = document.getElementById('languageListTrigger');

    dispTrig && dispTrig.addEventListener('click', () => showMenuView('display-menu-view'));
    setTrig && setTrig.addEventListener('click', () => showMenuView('settings-menu-view'));
    helpTrig && helpTrig.addEventListener('click', () => showMenuView('help-support-menu-view'));
    langTrig && langTrig.addEventListener('click', () => showMenuView('language-menu-view'));
    langListTrig && langListTrig.addEventListener('click', () => showMenuView('language-list-view'));

    const backMain1 = document.getElementById('backToMainMenu');
    const backMain2 = document.getElementById('back-to-main-from-settings');
    const backMain3 = document.getElementById('back-to-main-from-help');
    const backToSettings = document.getElementById('back-to-settings-from-lang');
    const backToLang = document.getElementById('back-to-lang-from-list');

    backMain1 && backMain1.addEventListener('click', () => showMenuView('main-menu-view'));
    backMain2 && backMain2.addEventListener('click', () => showMenuView('main-menu-view'));
    backMain3 && backMain3.addEventListener('click', () => showMenuView('main-menu-view'));
    backToSettings && backToSettings.addEventListener('click', () => showMenuView('settings-menu-view'));
    backToLang && backToLang.addEventListener('click', () => showMenuView('language-menu-view'));

    const darkModeRadios = document.getElementsByName('darkmode');
    darkModeRadios.forEach(radio => {
    radio.addEventListener('change', function () {
        const isDark = this.value === "on";
        document.body.classList.toggle("dark-mode", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
    });

    // Load lại theme khi mở web
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.querySelector('input[name="darkmode"][value="on"]').checked = true;
    }
}

  // ====================== NOTIFICATION PANEL ======================
  // Hỗ trợ cả id="notiBtn" hoặc nút có title="Thông báo"
  const notiBtn =
    document.getElementById('notiBtn') || document.querySelector('.icon-btn[title="Thông báo"]');
  const notiPanel = document.getElementById('notificationPanel');
  const fullNotiPage = document.getElementById('notificationFullPage');
  const viewAllLink = document.getElementById('viewAllNoti') || qs('.noti-section-title a', notiPanel);
  const backBtn = fullNotiPage ? qs('.back-btn', fullNotiPage) : null;

  // Mở/đóng panel
  if (notiBtn && notiPanel) {
    notiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // đóng mọi menu 3 chấm đang mở trước khi bật panel
      qsa('.noti-menu-box.show').forEach((m) => m.classList.remove('show'));
      notiPanel.classList.toggle('show');
    });

    // click ngoài => đóng panel
    document.addEventListener('click', (e) => {
      if (!notiPanel.contains(e.target) && !notiBtn.contains(e.target)) {
        notiPanel.classList.remove('show');
        qsa('.noti-menu-box.show').forEach((m) => m.classList.remove('show'));
      }
    });
  }

  // ============ Tabs Tất cả / Chưa đọc trong PANEL ============
  const panelTabs = notiPanel ? qsa('.noti-tabs button', notiPanel) : [];
  const panelAllTab = panelTabs[0];
  const panelUnreadTab = panelTabs[1];
  const notiList = notiPanel ? qs('.noti-list', notiPanel) : null;

  function applyPanelFilter(showUnreadOnly = false) {
    if (!notiList) return;
    const items = qsa('.noti-item', notiList);
    let unreadCount = 0;
    items.forEach((it) => {
      const unread = it.classList.contains('unread');
      const show = !showUnreadOnly || unread;
      it.style.display = show ? 'flex' : 'none';
      if (showUnreadOnly && unread) unreadCount++;
    });

    // trạng thái trống
    const old = qs('.noti-empty', notiList);
    if (showUnreadOnly && unreadCount === 0) {
      if (!old) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'noti-empty';
        emptyDiv.innerHTML = `
          <div style="text-align:center; padding:40px 0; color:var(--sub);">
            <img src="messenger-clone/assets/icons/bell.svg" alt="" style="width:60px; opacity:0.5; margin-bottom:12px;">
            <p style="font-size:14px;">Bạn không có thông báo nào</p>
          </div>`;
        notiList.appendChild(emptyDiv);
      }
    } else if (old) old.remove();
  }

  if (panelAllTab && panelUnreadTab && notiList) {
    panelAllTab.addEventListener('click', () => {
      panelAllTab.classList.add('active');
      panelUnreadTab.classList.remove('active');
      applyPanelFilter(false);
    });
    panelUnreadTab.addEventListener('click', () => {
      panelUnreadTab.classList.add('active');
      panelAllTab.classList.remove('active');
      applyPanelFilter(true);
    });
  }

  // ============ MENU 3 CHẤM & CLICK ITEM (EVENT DELEGATION) ============
  if (notiPanel) {
    notiPanel.addEventListener('click', (e) => {
      const moreBtn = e.target.closest('.noti-more');
      const menuBox = e.target.closest('.noti-menu-box');
      const item = e.target.closest('.noti-item');

      // Bấm nút 3 chấm
      if (moreBtn) {
        e.stopPropagation();
        const rightWrap = moreBtn.closest('.noti-right');
        const box = qs('.noti-menu-box', rightWrap);
        // đóng các menu khác
        qsa('.noti-menu-box.show', notiPanel).forEach((m) => m !== box && m.classList.remove('show'));
        // bật/tắt menu hiện tại
        box.classList.toggle('show');
        return;
      }

      // Chọn 1 option trong menu
      if (menuBox && e.target.tagName === 'LI') {
        e.stopPropagation();
        const text = e.target.textContent.trim();
        const wrapItem = menuBox.closest('.noti-item');
        if (text.includes('Đánh dấu')) {
          wrapItem.classList.toggle('unread');
          alert('✅ Đã đánh dấu là chưa đọc');
        } else if (text.includes('Xóa')) {
          wrapItem.remove();
        } else if (text.includes('Báo cáo')) {
          alert('📨 Báo cáo đã được gửi.');
        }
        menuBox.classList.remove('show');
        return;
      }

      // Click vào noti-item mở modal bài viết (trừ khi đang bấm vào nút/ menu)
      if (item && !e.target.closest('.noti-right')) {
        openPostFromNotification(item);
      }
    });
  }

  // ============ XEM TẤT CẢ (FULL PAGE) ============
  const notiFullList = fullNotiPage ? qs('.noti-full-list', fullNotiPage) : null;

  function renderFullNotifications(filterUnread = false) {
    if (!notiFullList) return;
    notiFullList.innerHTML = '';
    const panelItems = qsa('.noti-item', notiPanel || document);

    const list = panelItems.filter((i) => !filterUnread || i.classList.contains('unread'));

    list.forEach((srcItem) => {
      const img = srcItem.querySelector('img')?.src || '';
      const text = srcItem.querySelector('.noti-text p')?.innerHTML || '';
      const time = srcItem.querySelector('.noti-text span')?.textContent || '';
      const unread = srcItem.classList.contains('unread');

      const div = document.createElement('div');
      div.className = 'noti-full-item' + (unread ? ' unread' : '');
      div.innerHTML = `
        <img src="${img}">
        <div style="flex:1;">
          <div class="noti-text">
            <p>${text}</p>
            <span style="font-size:13px;color:var(--sub);">${time}</span>
          </div>
        </div>
        <div class="noti-right" style="position:relative;">
          <button class="icon-btn noti-more"><img src="messenger-clone/assets/icons/dots.svg" alt=""></button>
          <div class="noti-menu-box">
            <ul>
              <li>✔ Đánh dấu là chưa đọc</li>
              <li>✖ Xóa thông báo này</li>
              <li>⚙️ Báo cáo sự cố cho đội ngũ phụ trách</li>
            </ul>
          </div>
        </div>
      `;

      // click mở bài viết (trừ khu vực .noti-right)
      div.addEventListener('click', (e) => {
        if (e.target.closest('.noti-right')) return;
        openPostFromNotification(srcItem);
      });

      notiFullList.appendChild(div);
    });

    if (list.length === 0) {
      notiFullList.innerHTML = `
        <div style="text-align:center;padding:60px 0;color:var(--sub);">
          <img src="messenger-clone/assets/icons/bell.svg" style="width:60px;opacity:0.5;"><br>
          <p>Không có thông báo nào.</p>
        </div>`;
    }
  }

  if (viewAllLink && fullNotiPage && notiPanel) {
    viewAllLink.addEventListener('click', (e) => {
      e.preventDefault();
      notiPanel.classList.remove('show');
      fullNotiPage.classList.add('show');
      renderFullNotifications(false);
    });
  }

  if (backBtn && fullNotiPage) {
    backBtn.addEventListener('click', () => {
      fullNotiPage.classList.remove('show');
      // đóng menu rời
      qsa('.noti-menu-box.show', fullNotiPage).forEach((m) => m.classList.remove('show'));
    });

    // tabs ở trang full
    const fullTabs = qsa('.noti-full .noti-tabs button', fullNotiPage);
    if (fullTabs.length === 2) {
      const [tabAll, tabUnread] = fullTabs;
      tabAll.addEventListener('click', () => {
        tabAll.classList.add('active');
        tabUnread.classList.remove('active');
        renderFullNotifications(false);
      });
      tabUnread.addEventListener('click', () => {
        tabUnread.classList.add('active');
        tabAll.classList.remove('active');
        renderFullNotifications(true);
      });
    }

    // event delegation cho menu 3 chấm ở trang full
    fullNotiPage.addEventListener('click', (e) => {
      const moreBtn = e.target.closest('.noti-more');
      const menuBox = e.target.closest('.noti-menu-box');
      if (moreBtn) {
        e.stopPropagation();
        const wrap = moreBtn.closest('.noti-right');
        const box = qs('.noti-menu-box', wrap);
        qsa('.noti-menu-box.show', fullNotiPage).forEach((m) => m !== box && m.classList.remove('show'));
        box.classList.toggle('show');
        return;
      }
      if (menuBox && e.target.tagName === 'LI') {
        e.stopPropagation();
        const liText = e.target.textContent.trim();
        const parentItem = menuBox.closest('.noti-full-item');
        if (liText.includes('Đánh dấu')) {
          parentItem.classList.toggle('unread');
          alert('✅ Đã đánh dấu là chưa đọc');
        } else if (liText.includes('Xóa')) {
          parentItem.remove();
        } else if (liText.includes('Báo cáo')) {
          alert('📨 Báo cáo đã được gửi.');
        }
        menuBox.classList.remove('show');
      }
    });
  }

  // ====================== MODAL BÀI VIẾT (GIỮ VÀ SẠCH SỰ KIỆN) ======================
  const postModal = document.getElementById('postModal');
  const postPopupContent = document.getElementById('postPopupContent');
  const postPopupTitle = document.getElementById('postPopupTitle');
  const closePostModal = document.getElementById('closePostModal');

  // 👉 Hàm hiển thị bài viết khi bấm vào thông báo
function openPostFromNotification(item) {
  const author =
    item.querySelector(".noti-text b")?.textContent ||
    "Chi hội Thanh niên vận động hiến máu 08/5";
  const text =
    item.querySelector(".noti-text p")?.textContent ||
    "Bài viết mẫu - Mùa hè nhân ái 💙";
  const img =
    item.querySelector("img")?.src ||
    "messenger-clone/assets/images/contact-1.png";

  // === Render nội dung bài viết vào popup ===
  postPopupTitle.textContent = `Bài viết của ${author}`;
  postPopupContent.innerHTML = `
    <div class="post-header" style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      <img src="${img}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;">
      <div>
        <strong>${author}</strong><br>
        <span style="font-size:13px;color:var(--sub);">2 giờ trước · 🌍</span>
      </div>
    </div>

    <div class="post-content" style="font-size:15px;line-height:1.5;margin-bottom:12px;">
      ${text}
    </div>

    <div class="post-image">
      <img src="${img}" alt="Post image" style="width:100%;border-radius:8px;">
    </div>

    <div class="post-meta" style="margin-top:8px;color:var(--sub);font-size:14px;">
      <span>❤️ 152</span> · <span>68 bình luận • 6 lượt chia sẻ</span>
    </div>

    <div class="post-actions" style="display:flex;justify-content:space-around;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin:12px 0;">
      <button class="action-btn">👍 Thích</button>
      <button class="action-btn">💬 Bình luận</button>
      <button class="action-btn">↗️ Chia sẻ</button>
    </div>

    <!-- Danh sách bình luận -->
    <div class="comment-list" style="margin-top:10px;"></div>

    <div class="comment-box" style="margin-top:10px;display:flex;align-items:center;gap:8px;">
      <img src="messenger-clone/assets/images/contact-1.png" style="width:36px;height:36px;border-radius:50%;">
      <input type="text" class="comment-input" placeholder="Bình luận dưới tên Nguyen Van A" 
        style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:24px;">
    </div>
  `;

  // ✅ Hiển thị modal
  postModal.classList.add("show");

  // === Xử lý sự kiện nhập bình luận ===
  const commentInput = postPopupContent.querySelector(".comment-input");
  const commentList = postPopupContent.querySelector(".comment-list");

  if (commentInput && commentList) {
    // Xóa mọi listener cũ (tránh nhân đôi khi mở lại modal)
    commentInput.onkeydown = null;

    commentInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && commentInput.value.trim() !== "") {
        e.preventDefault();

        // Tạo phần tử bình luận mới
        const newComment = document.createElement("div");
        newComment.className = "comment-item";
        newComment.style.margin = "8px 0";
        newComment.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;">
            <img src="messenger-clone/assets/images/contact-1.png" 
                 style="width:32px;height:32px;border-radius:50%;">
            <div style="background:var(--bg);padding:8px 12px;border-radius:16px;">
              <strong>Nguyen Van A</strong><br>
              <span>${commentInput.value}</span>
            </div>
          </div>
        `;

        // Thêm vào danh sách
        commentList.appendChild(newComment);

        // Xóa nội dung input
        commentInput.value = "";

        // Cuộn xuống dưới cùng
        commentList.scrollTop = commentList.scrollHeight;
      }
    });
  }
}

  if (closePostModal && postModal) {
    closePostModal.addEventListener('click', () => postModal.classList.remove('show'));
    postModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('post-overlay')) postModal.classList.remove('show');
    });
  }

  // ====================== ICON KHÁC Ở GÓC PHẢI (NHƯ CŨ) ======================
  const messengerBtn = document.querySelector('.icon-btn[title="Messenger"]');
  messengerBtn &&
    messengerBtn.addEventListener('click', () => {
      window.location.href = 'messenger-clone/index.html';
    });

  const menuBtn = document.querySelector('.icon-btn[title="Menu"]');
  menuBtn &&
    menuBtn.addEventListener('click', () => {
      alert('Menu ứng dụng sẽ hiển thị tại đây');
    });

  // ====================== LOG CONSOLE (GIỮ NGUYÊN) ======================
  console.log('%c Facebook Clone ', 'background: #1877f2; color: white; font-size: 20px; padding: 10px;');
  console.log('%c Developed by DuccDung ', 'font-size: 14px; padding: 5px;');
  console.log('%c ⚠️ Cảnh báo: ', 'color: red; font-weight: bold; font-size: 16px;');
  console.log('Đây là trang demo. Không nhập bất kỳ thông tin cá nhân nào!');
});


document.addEventListener("DOMContentLoaded", () => {
  const allMenuViews = document.querySelectorAll(".menu-view");

  function showMenuView(viewId) {
    allMenuViews.forEach((v) => (v.style.display = "none"));
    const viewToShow = document.getElementById(viewId);
    if (viewToShow) viewToShow.style.display = "block";
  }

  // 👉 Bấm avatar mở menu
  if (profileTrigger && profileMenu) {
    profileTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      const isActive = profileMenu.classList.toggle("active");
      if (isActive) showMenuView("main-menu-view");
    });

    // Bấm ra ngoài để đóng menu
    document.addEventListener("click", function (e) {
      if (
        profileMenu.classList.contains("active") &&
        !profileMenu.contains(e.target) &&
        !profileTrigger.contains(e.target)
      ) {
        profileMenu.classList.remove("active");
      }
    });
  }
});




// Danh sách ảnh đã upload
let uploadedImages = [];

// ====================== POPUP CHỌN ẢNH ĐẠI DIỆN ======================
function loadAvatarPhotos() {
    const suggested = document.getElementById("suggestedPhotos");
    const uploaded = document.getElementById("uploadedPhotos");

    // Ảnh gợi ý mẫu
    const demoImages = [
        "messenger-clone/assets/images/avatar_change_1.png",
        "messenger-clone/assets/images/avatar_change_2.png",
        "messenger-clone/assets/images/avatar_change_3.jpg",
        "messenger-clone/assets/images/avatar_change_4.jpg",
        "messenger-clone/assets/images/avatar_change_5.png",
        "messenger-clone/assets/images/avatar_change_6.jpg"
    ];

    // Render ảnh gợi ý
    suggested.innerHTML = demoImages
        .map(src => `<img src="${src}" class="avatar-choice">`)
        .join("");

    // Render ảnh đã tải lên
    uploaded.innerHTML = uploadedImages
        .map(src => `<img src="${src}" class="avatar-choice">`)
        .join("");

    // Gán sự kiện chọn ảnh
    document.querySelectorAll(".avatar-choice").forEach(img => {
        img.addEventListener("click", () => {
            const profilePic = document.querySelector(".profile-pic");
            profilePic.innerHTML = `
                <img src="${img.src}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
            `;
            document.getElementById("avatarPickerModal").classList.remove("show");
        });
    });
}


// ====================== MAIN ======================
document.addEventListener("DOMContentLoaded", () => {

    const avatarBtn = document.querySelector(".camera-icon");
    const avatarModal = document.getElementById("avatarPickerModal");
    const closeAvatar = document.getElementById("closeAvatarModal");
    const uploadBtn = document.getElementById("uploadAvatarBtn");
    const fileInput = document.getElementById("avatarFileInput");

    // ========== MỞ POPUP ==========
    avatarBtn.addEventListener("click", () => {
        avatarModal.classList.add("show");
        loadAvatarPhotos();
    });

    // ========== ĐÓNG POPUP ==========
    closeAvatar.addEventListener("click", () => {
        avatarModal.classList.remove("show");
    });

    avatarModal.addEventListener("click", (e) => {
        if (e.target.classList.contains("avatar-overlay")) {
            avatarModal.classList.remove("show");
        }
    });

    // ========== TẢI ẢNH LÊN ==========
    uploadBtn.addEventListener("click", () => {
        fileInput.click(); // mở hộp thoại chọn ảnh
    });

    fileInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImages.unshift(e.target.result);   // lưu base64
            loadAvatarPhotos();                        // reload UI
        };
        reader.readAsDataURL(file);
    });

});



// ====================== PAGE: FRIENDS ======================
document.addEventListener("DOMContentLoaded", () => {

    const navItems = document.querySelectorAll(".p-nav-item");
    //const contentArea = document.querySelector(".content-area");

    // Khi bấm vào tab Bạn bè
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            if (item.textContent.trim() === "Bạn bè") {
                renderFriendsPage();
            }
        });
    });   

});

// ===========================================================
    // RENDER TRANG BẠN BÈ
    // ===========================================================
    function renderFriendsPage() {
      const contentArea = document.querySelector(".content-area"); // 👈 FIX QUAN TRỌNG

        contentArea.innerHTML = `
            <div class="friends-section">
                <div class="card" style="padding:20px; width:100%;">
                    <div class="friends-header">Bạn bè</div>

                    <div class="friends-tabs">
                        <div class="friends-tab active" data-tab="all">Tất cả bạn bè</div>
                        <div class="friends-tab" data-tab="following">Đang theo dõi</div>
                    </div>

                    <div class="friend-list" id="friendList"></div>
                </div>
            </div>
        `;

        loadFriends();

        const tabs = document.querySelectorAll(".friends-tab");
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");

                const type = tab.dataset.tab;
                if (type === "all") loadFriends();
                else loadFollowing();
            });
        });
    }
    // ==================== TOAST FUNCTION ====================
    function showToast(message) {
        const box = document.getElementById("toastContainer");
        if (!box) {
            alert(message); // fallback nếu container chưa load
            return;
        }

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;

        box.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2600);
    }

    // ===========================================================
    // TAB 1 — TẤT CẢ BẠN BÈ
    // ===========================================================
    function loadFriends() {
        const friendList = document.getElementById("friendList");
        if (!friendList) return;

        const friends = [
            {name: "Hue Do", img:"messenger-clone/assets/images/contact-2.png", mutual: "6 bạn chung"},
            {name: "Thúy Nguyễn", img:"messenger-clone/assets/images/contact-1.png", mutual: "4 bạn chung"},
            {name: "Anh Việt", img:"messenger-clone/assets/images/contact-3.png", mutual: "3 bạn chung"},
            {name: "Lê Văn Hùng", img:"messenger-clone/assets/images/contact-4.png", mutual: "5 bạn chung"},
        ];

        friendList.innerHTML = friends.map(f => `
            <div class="friend-card">
                <img src="${f.img}" />
                <div class="friend-info">
                    <div class="friend-name">${f.name}</div>
                    <div class="friend-mutual">${f.mutual}</div>
                </div>

                <div class="friend-more"><i class="fas fa-ellipsis-h"></i></div>

                <ul class="friend-menu">
                    <li>⭐ Yêu thích</li>
                    <li>📝 Chỉnh sửa danh sách bạn bè</li>
                    <li>🚫 Bỏ theo dõi</li>
                    <li>❌ Hủy kết bạn</li>
                </ul>
            </div>
        `).join("");

        // Sự kiện menu 3 chấm
        document.querySelectorAll(".friend-more").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const menu = btn.nextElementSibling;

                document.querySelectorAll(".friend-menu.show").forEach(m => {
                    if (m !== menu) m.classList.remove("show");
                });

                menu.classList.toggle("show");
            });
        });

        // Click ra ngoài để đóng
        document.addEventListener("click", () => {
            document.querySelectorAll(".friend-menu.show").forEach(m => m.classList.remove("show"));
        });

        // =============== SỰ KIỆN CHO 4 NÚT MENU ===============
        document.querySelectorAll(".friend-menu li").forEach(li => {
            li.addEventListener("click", () => {
                const action = li.textContent.trim();

                if (action.includes("Yêu thích"))
                    showToast("✔ Đã thêm vào danh sách yêu thích");

                else if (action.includes("Chỉnh sửa"))
                    showToast("✏ Mở trình chỉnh sửa danh sách bạn bè");

                else if (action.includes("Bỏ theo dõi"))
                    showToast("🚫 Bạn sẽ không nhìn thấy bài viết từ người này nữa");

                else if (action.includes("Hủy kết bạn"))
                    showToast("❌ Đã hủy kết bạn");

                li.parentElement.classList.remove("show");
            });
        });
    }

    // ===========================================================
    // TAB 2 — ĐANG THEO DÕI
    // ===========================================================
    function loadFollowing() {
        const friendList = document.getElementById("friendList");
        if (!friendList) return;

        const following = [
            {name: "Nguyễn Trọng Công", img:"messenger-clone/assets/images/contact-1.png", mutual:"7 bạn chung"},
            {name: "Phạm Xuân Tích", img:"messenger-clone/assets/images/contact-2.png", mutual:"7 bạn chung"},
            {name: "BB Trần", img:"messenger-clone/assets/images/contact-3.png", mutual:"5 bạn chung"},
            {name: "Nguyễn TúAnh", img:"messenger-clone/assets/images/contact-4.png", mutual:"2 bạn chung"},
            {name: "CLB Vovinam - Việt Võ Đạo", img:"messenger-clone/assets/images/contact-1.png", mutual:"3 bạn chung"},
            {name: "Ms Hoa Giao tiếp", img:"messenger-clone/assets/images/contact-2.png", mutual:"4 bạn chung"},
            {name: "Shark Tank Việt Nam", img:"messenger-clone/assets/images/contact-3.png", mutual:""},
            {name: "Datio English", img:"messenger-clone/assets/images/contact-4.png", mutual:"Thành phố Hồ Chí Minh"},
        ];

        friendList.innerHTML = following.map(f => `
            <div class="friend-card">
                <img src="${f.img}" />
                <div class="friend-info">
                    <div class="friend-name">${f.name}</div>
                    <div class="friend-mutual">${f.mutual}</div>
                </div>

                <button class="friend-follow-btn">Hủy lời mời</button>
            </div>
        `).join("");

        document.querySelectorAll(".friend-follow-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                btn.textContent = "Đã hủy";
                btn.style.background = "var(--hover-bg)";
            });
        });
    }
  

    



// ====================== PAGE: PHOTOS ======================
document.addEventListener("DOMContentLoaded", () => {

    const navItems = document.querySelectorAll(".p-nav-item");
    //const contentArea = document.querySelector(".content-area");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            if (item.textContent.trim() === "Ảnh") {
                renderPhotosPage();
            }
        });
    });

    
});

function renderPhotosPage() {
    const contentArea = document.querySelector(".content-area"); // 👈 FIX QUAN TRỌNG
        contentArea.innerHTML = `
            <div class="photos-section">
                <div class="card" style="padding:20px; width:100%;">

                    <div class="photos-header">Ảnh</div>

                    <div class="photos-tabs">
                        <div class="photos-tab active" data-tab="your">Ảnh của bạn</div>
                        <div class="photos-tab" data-tab="album">Album</div>
                    </div>

                    <div class="photo-grid-big" id="photoGrid"></div>
                </div>
            </div>
        `;

        loadYourPhotos();

        document.querySelectorAll(".photos-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                document.querySelectorAll(".photos-tab")
                    .forEach(t => t.classList.remove("active"));
                tab.classList.add("active");

                if (tab.dataset.tab === "your") {
                    loadYourPhotos();
                } else {
                    loadAlbumPhotos();
                }
            });
        });
    }

    // ===== TAB 1: ẢNH CỦA BẠN =====
    function loadYourPhotos() {
        const photos = [
            "messenger-clone/assets/images/avatar_change_1.png",
            "messenger-clone/assets/images/avatar_change_2.png",
            "messenger-clone/assets/images/avatar_change_3.jpg",
            "messenger-clone/assets/images/avatar_change_4.jpg",
            "messenger-clone/assets/images/avatar_change_5.png",
            "messenger-clone/assets/images/avatar_change_6.jpg"
        ];

        const photoGrid = document.getElementById("photoGrid");
        photoGrid.innerHTML = photos
            .map(src => `<img src="${src}" />`)
            .join("");
    }

    // ===== TAB 2: ALBUM =====
    function loadAlbumPhotos() {
        const photos = [
            "messenger-clone/assets/images/avatar_change_3.jpg",
            "messenger-clone/assets/images/avatar_change_4.jpg",
            "messenger-clone/assets/images/avatar_change_5.png",
            "messenger-clone/assets/images/avatar_change_6.jpg"
        ];

        const photoGrid = document.getElementById("photoGrid");
        photoGrid.innerHTML = photos
            .map(src => `<img src="${src}" />`)
            .join("");
    }


    //click vào xem tất cả ảnh trên trang cá nhân sẽ vào phần ảnh ở trên
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("#viewAllPhotosBtn");
      if (!btn) return;

      // Active tab Ảnh
      document.querySelectorAll(".p-nav-item").forEach(i => i.classList.remove("active"));

      const photosTab = [...document.querySelectorAll(".p-nav-item")]
          .find(i => i.textContent.trim() === "Ảnh");

      if (photosTab) photosTab.classList.add("active");

      // Render trang ảnh
      renderPhotosPage();

      // Scroll xuống content-area
      document.querySelector(".content-area").scrollIntoView({
          behavior: "smooth"
      });
    });




// ====================== PAGE: GIỚI THIỆU (FULL FACEBOOK) ======================
document.addEventListener("DOMContentLoaded", () => {

    let contentArea = document.querySelector(".content-area");
    const navItems = document.querySelectorAll(".p-nav-item");

    // ========= TẤT CẢ HÀM NẰM TRONG DOMContentLoaded =========

    // =========== CONFIG ===========
    const aboutFieldConfig = {
        work1: { company: true, position: true, city: true, description: true, checkbox: true },
        school1: { school: true, city: true, checkbox: true, description: true },
        school2: { school: true, city: true, checkbox: true, description: true },
        hometown: { city: true },
        current_city: { city: true },
        relationship: { description: true },
        phone: { description: true },
        email: { description: true },
        bio: { description: true }

    };

    // ================ PAGE MAIN RENDER =================
    function renderAboutPage() {
        contentArea.innerHTML = `
          <div class="about-section">
            <div class="card" style="padding:20px; width:100%;">
              <div class="about-header">Giới thiệu</div>
              <div class="about-layout">
                <div class="about-left">
                  <div class="about-tab active" data-tab="overview">Tổng quan</div>
                  <div class="about-tab" data-tab="work">Công việc và học vấn</div>
                  <div class="about-tab" data-tab="places">Nơi từng sống</div>
                  <div class="about-tab" data-tab="contact">Thông tin liên hệ và cơ bản</div>
                  <div class="about-tab" data-tab="family">Gia đình và các mối quan hệ</div>
                  <div class="about-tab" data-tab="details">Chi tiết về bạn</div>
                </div>
                <div class="about-right" id="aboutContent">
                  ${renderOverview()}
                </div>
              </div>
            </div>
          </div>
        `;

        document.querySelectorAll(".about-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                document.querySelectorAll(".about-tab").forEach(t => t.classList.remove("active"));
                tab.classList.add("active");

                const box = document.getElementById("aboutContent");
                const type = tab.dataset.tab;

                if (type === "overview") box.innerHTML = renderOverview();
                if (type === "work") box.innerHTML = renderWork();
                if (type === "places") box.innerHTML = renderPlaces();
                if (type === "contact") box.innerHTML = renderContact();
                if (type === "family") box.innerHTML = renderFamily();
                if (type === "details") box.innerHTML = renderDetails();
            });
        });
    }
    // 🔹 expose ra global để file JS khác gọi được
    window.renderAboutPage = renderAboutPage;
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            if (item.textContent.trim() === "Giới thiệu") {
                renderAboutPage();
            }
        });
    });


    // ============== NỘI DUNG TỪNG TAB ==============
    function renderOverview() {
        return `
            <div class="about-box">
                ${btnAdd("Thêm nơi làm việc", "work1", "work1")}
                ${btnAdd("Thêm trường trung học", "school1", "school1")}
                ${btnAdd("Thêm trường cao đẳng/đại học", "school2", "school2")}
                ${btnAdd("Thêm tỉnh/thành phố hiện tại", "current_city", "current_city")}
                ${btnAdd("Thêm quê quán", "hometown", "hometown")}
                ${btnAdd("Thêm tình trạng mối quan hệ", "relationship", "relationship")}
            </div>
        `;
    }

    function renderWork() {
        return `
            <div class="section-title">Nơi làm việc</div>
            <div class="about-box">
                ${btnAdd("Thêm nơi làm việc", "work1", "work1")}
            </div>
        `;
    }

    function renderPlaces() {
        return `
            <div class="section-title">Tỉnh/thành phố hiện tại</div>
            <div class="about-box">
                ${btnAdd("Thêm tỉnh/thành phố hiện tại", "current_city", "current_city")}
            </div>

            <div class="section-title">Quê quán</div>
            <div class="about-box">
                ${btnAdd("Thêm quê quán", "hometown", "hometown")}
            </div>
        `;
    }

    function renderContact() {
        return `
            <div class="section-title">Thông tin liên hệ</div>
            <div class="about-box">
                ${btnAdd("Thêm số điện thoại", "phone", "relationship")}
                ${btnAdd("Thêm email", "email", "relationship")}
            </div>
        `;
    }

    function renderFamily() {
        return `
            <div class="section-title">Mối quan hệ</div>
            <div class="about-box">
                ${btnAdd("Thêm tình trạng mối quan hệ", "relationship", "relationship")}
            </div>
        `;
    }

    function renderDetails() {
        return `
            <div class="section-title">Tiểu sử</div>
            <div class="about-box">
                ${btnAdd("Thêm tiểu sử", "bio", "relationship")}
            </div>
        `;
    }

    // ============ ADD BUTTON + SAVED ITEM ============
    function btnAdd(label, key, configKey) {

      const saved = JSON.parse(localStorage.getItem(key) || "{}");

      // Nếu đã có dữ liệu → chỉ hiển thị item đã lưu, KHÔNG hiển thị nút thêm
      if (saved && Object.keys(saved).length > 0) {
          return renderSavedItem(key);
      }

      // Nếu chưa có dữ liệu → hiển thị nút Thêm
      return `
          <div class="about-item" onclick="openForm('${key}', '${configKey}')">
              <i class="fas fa-plus-circle"></i> ${label}
          </div>
      `;
    }


    function renderSavedItem(key) {
      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      if (!saved || Object.keys(saved).length === 0) return "";

      const main = saved.company || saved.school || saved.city || saved.desc || "(Chưa có thông tin)";
      const sub  = saved.position ? `${saved.position} · ${saved.city}` : (saved.city || "");

      return `
          <div class="saved-item" style="position:relative;">
              <i class="fas fa-briefcase saved-icon"></i>

              <div class="saved-info">
                  <div class="saved-title">${main}</div>
                  <div class="saved-sub">${sub}</div>
              </div>

              <button class="menu-btn" onclick="toggleMenu('${key}')">⋯</button>

              <div class="menu-dropdown" id="menu_${key}" style="
                  position:absolute;
                  top:32px;
                  right:0;
                  background:white;
                  border:1px solid var(--border);
                  border-radius:8px;
                  width:130px;
                  z-index:9999;
                  display:none;
              ">
                  <div class="menu-item" onclick="editAgain('${key}')">Chỉnh sửa</div>
                  <div class="menu-item" onclick="deleteInfo('${key}')">Xóa</div>
              </div>
          </div>
      `;
    }



    // ============ FORM EDIT =============
    function renderInputForm(key, fields) {
        let saved = JSON.parse(localStorage.getItem(key) || "{}");

        return `
            <div class="edit-block">

                ${fields.company ? input("Công ty", `${key}_company`, saved.company) : ""}
                ${fields.position ? input("Chức vụ", `${key}_position`, saved.position) : ""}
                ${fields.city ? input("Thành phố/Thị xã", `${key}_city`, saved.city) : ""}
                ${fields.school ? input("Trường học", `${key}_school`, saved.school) : ""}
                ${fields.description ? textarea("Mô tả", `${key}_desc`, saved.desc) : ""}

                ${fields.checkbox ? `
                    <label class="checkbox-line">
                        <input type="checkbox" id="${key}_check" ${saved.check ? "checked" : ""}>
                        Tôi đang làm việc/học tại đây
                    </label>
                ` : ""}

                <div class="edit-actions">
                    <button class="cancel-btn" onclick="cancelEdit()">Hủy</button>
                    <button class="save-btn" onclick="saveAbout('${key}')">Lưu</button>
                </div>
            </div>
        `;
    }

    function input(label, id, value) {
        return `
            <label>${label}</label>
            <input type="text" id="${id}" value="${value || ""}">
        `;
    }

    function textarea(label, id, value) {
        return `
            <label>${label}</label>
            <textarea id="${id}">${value || ""}</textarea>
        `;
    }

    // ========== GLOBAL EXPORT ==========
    window.openForm = function (key, configKey) {
        document.getElementById("aboutContent").innerHTML =
            renderInputForm(key, aboutFieldConfig[configKey]);
    };

    window.cancelEdit = function () {
        renderAboutPage();
    };

    window.editAgain = function (key) {
      document.getElementById("aboutContent").innerHTML =
          renderInputForm(key, aboutFieldConfig[key]);
    };

    window.toggleMenu = function (key) {
      const menu = document.getElementById("menu_" + key);
      const isShow = menu.style.display === "block";

      // Ẩn hết tất cả menu khác
      document.querySelectorAll(".menu-dropdown").forEach(m => m.style.display = "none");

      // Toggle menu đang bấm
      menu.style.display = isShow ? "none" : "block";
    };


    window.saveAbout = function (key) {

      const fields = aboutFieldConfig[key];
      let data = {};

      if (fields.company) data.company = document.getElementById(`${key}_company`).value;
      if (fields.position) data.position = document.getElementById(`${key}_position`).value;
      if (fields.city) data.city = document.getElementById(`${key}_city`).value;
      if (fields.school) data.school = document.getElementById(`${key}_school`).value;
      if (fields.description) data.desc = document.getElementById(`${key}_desc`).value;
      if (fields.checkbox) data.check = document.getElementById(`${key}_check`).checked;

      // Lưu dữ liệu
      localStorage.setItem(key, JSON.stringify(data));

      // QUAN TRỌNG: reload tab hiện tại, không reload toàn page
      const currentTab = document.querySelector(".about-tab.active").dataset.tab;

      switch (currentTab) {
          case "overview": document.getElementById("aboutContent").innerHTML = renderOverview(); break;
          case "work": document.getElementById("aboutContent").innerHTML = renderWork(); break;
          case "places": document.getElementById("aboutContent").innerHTML = renderPlaces(); break;
          case "contact": document.getElementById("aboutContent").innerHTML = renderContact(); break;
          case "family": document.getElementById("aboutContent").innerHTML = renderFamily(); break;
          case "details": document.getElementById("aboutContent").innerHTML = renderDetails(); break;
      }
    };

    window.deleteInfo = function(key) {
      localStorage.removeItem(key);

      // Lấy tab hiện tại
      const currentTab = document.querySelector(".about-tab.active").dataset.tab;

      // Reload đúng tab đang mở
      switch (currentTab) {
          case "overview":
              document.getElementById("aboutContent").innerHTML = renderOverview();
              break;
          case "work":
              document.getElementById("aboutContent").innerHTML = renderWork();
              break;
          case "places":
              document.getElementById("aboutContent").innerHTML = renderPlaces();
              break;
          case "contact":
              document.getElementById("aboutContent").innerHTML = renderContact();
              break;
          case "family":
              document.getElementById("aboutContent").innerHTML = renderFamily();
              break;
          case "details":
              document.getElementById("aboutContent").innerHTML = renderDetails();
              break;
      }
    };



});


// ========== TIỂU SỬ TRANG CÁ NHÂN ==========//

const openBioEditor = document.getElementById("openBioEditor");
const bioEditor     = document.getElementById("bioEditor");
const bioDisplay    = document.getElementById("bioDisplay");
const bioInput      = document.getElementById("bioInput");
const bioCounter    = document.getElementById("bioCounter");
const btnSaveBio    = document.getElementById("saveBio");
const btnCancelBio  = document.getElementById("cancelBio");

// lưu tiểu sử (chuỗi rỗng = không có)
let currentBio = "";

// cập nhật UI chung
function updateBioUI() {
    if (currentBio.trim().length > 0) {
        // có tiểu sử → hiển thị
        bioDisplay.textContent = currentBio;
        bioDisplay.style.display = "block";
        openBioEditor.textContent = "Chỉnh sửa tiểu sử";
    } else {
        // không có tiểu sử → ẩn
        bioDisplay.style.display = "none";
        openBioEditor.textContent = "Thêm tiểu sử";
    }

    // đóng form
    bioEditor.style.display = "none";
    openBioEditor.style.display = "block";

    // reset dữ liệu trong ô nhập
    bioInput.value = currentBio;
    bioCounter.textContent = 101 - currentBio.length;
    btnSaveBio.disabled = true;
}

// mở form
openBioEditor.addEventListener("click", () => {
    openBioEditor.style.display = "none";
    bioEditor.style.display = "block";
    bioInput.focus();
});

// đếm ký tự + bật nút Lưu khi có chữ
bioInput.addEventListener("input", () => {
    const len = bioInput.value.length;
    bioCounter.textContent = 101 - len;

    // bật nút lưu nếu khác với currentBio
    btnSaveBio.disabled = (bioInput.value.trim() === currentBio.trim());
});

// Hủy → quay lại ban đầu (không đổi currentBio)
btnCancelBio.addEventListener("click", () => {
    updateBioUI();
});

// Lưu
btnSaveBio.addEventListener("click", () => {
    const newBio = bioInput.value.trim();

    if (newBio.length === 0) {
        // nếu trống → coi như không có tiểu sử
        currentBio = "";
    } else {
        currentBio = newBio;
    }

    updateBioUI();
});

// chạy 1 lần ban đầu
updateBioUI();



// ====================== GO TO ABOUT PAGE (EDIT DETAILS) ======================
document.addEventListener("click", function (e) {

    if (e.target.closest(".btn-edit-details")) {
        // Chuyển sang tab "Giới thiệu"
        document.querySelectorAll(".p-nav-item").forEach(i => i.classList.remove("active"));

        const aboutTab = Array.from(document.querySelectorAll(".p-nav-item"))
            .find(i => i.textContent.trim() === "Giới thiệu");

        if (aboutTab) aboutTab.classList.add("active");

        // Render trang Giới thiệu
        if (typeof renderAboutPage === "function") {
            renderAboutPage();
        }

        // Sau khi load → bật đúng tab “Chi tiết về bạn”
        setTimeout(() => {
            const tab = document.querySelector('.about-tab[data-tab="details"]');
            const box = document.getElementById("aboutContent");

            if (tab) {
                document.querySelectorAll(".about-tab").forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
            }

            if (box) {
                box.innerHTML = renderDetails();
            }
        }, 50);
    }
});

// ==================== CLICK "CHỈNH SỬA CHI TIẾT" ====================
document.addEventListener("click", function(e) {

    const btn = e.target.closest(".btn-edit-detail");
    if (!btn) return;

    // Chuyển tab Giới thiệu thành active
    document.querySelectorAll(".p-nav-item").forEach(item => {
        if (item.textContent.trim() === "Giới thiệu") {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Render giao diện GIỚI THIỆU
    if (window.renderAboutPage) {
        window.renderAboutPage();
    }

    // OPTIONAL: chuyển thẳng vào tab "Chi tiết về bạn"
    setTimeout(() => {
        const tab = document.querySelector('.about-tab[data-tab="details"]');
        const box = document.getElementById("aboutContent");

        if (tab) {
            document.querySelectorAll(".about-tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
        }

        if (box && typeof renderDetails === "function") {
            box.innerHTML = renderDetails();
        }
    }, 20);
});

// ====================== NÚT "CHỈNH SỬA CHI TIẾT" Ở CARD GIỚI THIỆU ======================
document.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    // So khớp đúng nút có text "Chỉnh sửa chi tiết"
    if (btn.textContent.trim() === "Chỉnh sửa chi tiết") {

        // Đánh dấu tab "Giới thiệu" ở thanh nav bên trên
        document.querySelectorAll(".p-nav-item").forEach(item => {
            if (item.textContent.trim() === "Giới thiệu") {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        // Gọi hàm renderAboutPage (đã được gán vào window)
        if (typeof window.renderAboutPage === "function") {
            window.renderAboutPage();
        }
    }
});






// === REACTION & LIKE ===
let fbxCurrentReaction = null;
const emojiMap = {
  like: "👍",
  love: "❤️",
  care: "🥰",
  haha: "😆",
  wow:  "😮",
  sad:  "😢",
  angry:"😡"
};

const fbxLikeBtn        = document.getElementById("fbxLikeBtn");
const fbxReactionBar    = document.getElementById("fbxReactionBar");
const fbxLikeIcon       = document.getElementById("fbxLikeIcon");
const fbxLikeLabel      = document.getElementById("fbxLikeLabel");
const fbxReactionDisplay= document.getElementById("fbxReactionDisplay");

// Hover nút Like để show bar
fbxLikeBtn.addEventListener("mouseenter", ()=>{
    fbxReactionBar.style.display = "flex";
});
fbxReactionBar.addEventListener("mouseleave", ()=>{
    fbxReactionBar.style.display = "none";
});

// Chọn emoji
document.querySelectorAll(".fbx-react").forEach(span=>{
    span.addEventListener("click", ()=>{
        const type = span.dataset.type;
        fbxCurrentReaction = type;

        fbxReactionDisplay.textContent = `${emojiMap[type]} Bạn`;
        fbxLikeIcon.className = "fa-solid fa-thumbs-up";
        fbxLikeIcon.style.color = "#1877f2";
        fbxLikeLabel.style.color = "#1877f2";
    });
});

// Click Like (bật/tắt)
fbxLikeBtn.addEventListener("click", ()=>{
    if(!fbxCurrentReaction){
        fbxCurrentReaction = "like";
        fbxReactionDisplay.textContent = `${emojiMap["like"]} Bạn`;
        fbxLikeIcon.className = "fa-solid fa-thumbs-up";
        fbxLikeIcon.style.color = "#1877f2";
        fbxLikeLabel.style.color = "#1877f2";
    }else{
        fbxCurrentReaction = null;
        fbxReactionDisplay.textContent = "";
        fbxLikeIcon.className = "fa-regular fa-thumbs-up";
        fbxLikeIcon.style.color = "";
        fbxLikeLabel.style.color = "";
    }
});

// === COMMENT ===
let fbxCommentTotal = 0;
const cBtn   = document.getElementById("fbxCommentBtn");
const cInput = document.getElementById("fbxCommentInput");
const cList  = document.getElementById("fbxCommentList");
const cCount = document.getElementById("fbxCommentCount");

cBtn.addEventListener("click", ()=> cInput.focus());

cInput.addEventListener("keypress", e=>{
    if(e.key==="Enter" && cInput.value.trim()){
        fbxCommentTotal++;

        const item = document.createElement("div");
        item.className = "fbx-comment-item";
        item.innerHTML = `
            <img class="fbx-cavatar" src="/facebook_mini_ui/messenger-clone/assets/images/6.png" />
            <div class="bubble">
                <b>Bạn</b><br>${cInput.value}
            </div>
        `;

        // prepend => bình luận mới ở TRÊN
        cList.prepend(item);
        cInput.value = "";
        cCount.textContent = fbxCommentTotal + " bình luận";
    }
});

// === SHARE ===
const sharePopup  = document.getElementById("fbxSharePopup");
const shareBtn    = document.getElementById("fbxShareBtn");
const shareClose  = document.getElementById("fbxShareClose");
const shareSend   = document.getElementById("fbxShareSend");
const shareTarget = document.getElementById("fbxShareTarget");
const shareFriend = document.getElementById("fbxShareFriend");
const toast       = document.getElementById("fbxToast");

// hiện / ẩn input tên bạn bè theo lựa chọn
shareTarget.addEventListener("change", ()=>{
    if(shareTarget.value === "messenger"){
        shareFriend.style.display = "block";
    }else{
        shareFriend.style.display = "none";
    }
});

shareBtn.addEventListener("click", ()=>{
    sharePopup.style.display = "flex";
});

shareClose.addEventListener("click", ()=>{
    sharePopup.style.display = "none";
});

// giả lập chia sẻ
shareSend.addEventListener("click", ()=>{
    sharePopup.style.display = "none";

    let where = "";
    if(shareTarget.value==="feed") where = "Bảng feed của bạn";
    else if(shareTarget.value==="private") where = "Chỉ mình bạn";
    else where = "Messenger tới: " + (shareFriend.value || "bạn bè");

    toast.textContent = "Đã chia sẻ tới: " + where;
    toast.style.display = "block";
    setTimeout(()=> toast.style.display = "none", 2200);
});







// ================== POPUP TẠO BÀI VIẾT ==================
document.addEventListener("DOMContentLoaded", () => {
  const modal     = document.getElementById("postCreatorModal");
  const closeBtn  = document.getElementById("postCreatorClose");
  const openComposer = document.querySelector(".composer");
  const openPhoto    = document.querySelector(".c-action-photo");

  const resetForm = () => {
    document.getElementById("postCreatorText").value = "";
    document.getElementById("postImageInput").value = "";
    document.getElementById("postImagePreview").innerHTML = "";
  };

  const openModal = () => modal.classList.remove("hide-modal");
  const closeModal = () => {
    modal.classList.add("hide-modal");
    resetForm();
  };

  if (openComposer) openComposer.addEventListener("click", openModal);
  if (openPhoto)    openPhoto.addEventListener("click", openModal);

  closeBtn.addEventListener("click", closeModal);
  modal.querySelector(".post-creator-overlay").addEventListener("click", closeModal);
});

// ================== UPLOAD ẢNH ==================
const postAddImage     = document.getElementById("postAddImage");
const postImageInput   = document.getElementById("postImageInput");
const postImagePreview = document.getElementById("postImagePreview");

postAddImage.addEventListener("click", () => postImageInput.click());

postImageInput.addEventListener("change", () => {
  const file = postImageInput.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  postImagePreview.innerHTML = `<img src="${url}">`;
});

// ================== TẠO HTML BÀI VIẾT MỚI ==================
document.getElementById("postCreatorSubmit").addEventListener("click", () => {
  const text = document.getElementById("postCreatorText").value.trim();
  const file = postImageInput.files[0];

  if (!text && !file) {
    alert("Bạn chưa viết gì!");
    return;
  }

  let imageHTML = "";
  if (file) {
    const url = URL.createObjectURL(file);
    imageHTML = `
      <div class="fbx-media">
        <img src="${url}">
      </div>`;
  }

  const html = `
  <div class="fbx-post">

    <div class="fbx-header">
      <img class="fbx-avatar" src="messenger-clone/assets/images/6.png">
      <div class="fbx-meta">
        <div class="fbx-author">Lê Ngọc</div>
        <div class="fbx-time">Vừa xong · <i class="fas fa-globe-asia"></i></div>
      </div>
    </div>

    <div class="fbx-content">${text}</div>
    ${imageHTML}

    <!-- STATS: reaction + số bình luận -->
    <div class="fbx-stats">
      <div class="fbx-likes">
        <span class="fbx-reaction-display"></span>
      </div>
      <div class="fbx-comments-count">0 bình luận</div>
    </div>

    <div class="fbx-divider"></div>

    <!-- ACTION BAR -->
    <div class="fbx-actions">
      <button class="fbx-act-btn fbx-like-btn">
        <i class="fa-regular fa-thumbs-up fbx-like-icon"></i>
        <span class="fbx-like-label">Thích</span>
      </button>
      <button class="fbx-act-btn fbx-comment-btn">
        <i class="fa-regular fa-comment"></i> Bình luận
      </button>
      <button class="fbx-act-btn fbx-share-btn">
        <i class="fa-solid fa-share"></i> Chia sẻ
      </button>
    </div>

    <!-- REACTION BAR -->
    <div class="fbx-reaction-bar" style="display:none;">
      <span class="fbx-react" data-type="like">👍</span>
      <span class="fbx-react" data-type="love">❤️</span>
      <span class="fbx-react" data-type="care">🥰</span>
      <span class="fbx-react" data-type="haha">😆</span>
      <span class="fbx-react" data-type="wow">😮</span>
      <span class="fbx-react" data-type="sad">😢</span>
      <span class="fbx-react" data-type="angry">😡</span>
    </div>

    <!-- COMMENT AREA -->
    <div class="fbx-comment-area">
      <div class="fbx-comment-list"></div>

      <div class="fbx-comment-input-wrap">
        <img src="messenger-clone/assets/images/6.png" class="fbx-cavatar">
        <input class="fbx-comment-input" placeholder="Viết bình luận...">
      </div>
    </div>

    <!-- SHARE POPUP -->
    <div class="fbx-share-popup" style="display:none;">
      <div class="fbx-share-box">

        <h3>Chia sẻ bài viết</h3>

        <select class="fbx-share-target">
          <option value="feed">Bảng feed của bạn</option>
          <option value="private">Chỉ mình tôi</option>
          <option value="messenger">Gửi bằng Messenger</option>
        </select>

        <input class="fbx-share-friend" placeholder="Tên bạn bè…" style="display:none;">

        <textarea class="fbx-share-text"
                  placeholder="Hãy nói gì đó về nội dung này…"></textarea>

        <div class="fbx-share-actions">
          <button class="fbx-share-send">Chia sẻ ngay</button>
          <button class="fbx-share-close">Đóng</button>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <div id="fbxToast" class="fbx-toast"></div>


  </div>
`;


  const postList = document.querySelector("#post-list");
  postList.insertAdjacentHTML("afterbegin", html);

  document.getElementById("postCreatorModal").classList.add("hide-modal");
  document.getElementById("postCreatorText").value = "";
  document.getElementById("postImageInput").value = "";
  document.getElementById("postImagePreview").innerHTML = "";
});

// ================== EVENT DELEGATION CHO TẤT CẢ BÀI ==================
// ===== LIKE + REACTION =====

// hover nút like để hiện reaction bar
document.addEventListener("mouseover", (e) => {
  const likeBtn = e.target.closest(".fbx-like-btn");
  if (!likeBtn) return;

  const post = likeBtn.closest(".fbx-post");
  const bar  = post.querySelector(".fbx-reaction-bar");
  if (!bar) return;

  bar.style.display = "flex";

  bar.onmouseleave = () => {
    bar.style.display = "none";
  };
});

// chọn emoji
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("fbx-react")) return;

  const type = e.target.dataset.type;
  const post = e.target.closest(".fbx-post");
  const display = post.querySelector(".fbx-reaction-display");
  const likeBtn = post.querySelector(".fbx-like-btn");
  const icon    = post.querySelector(".fbx-like-icon");
  const label   = post.querySelector(".fbx-like-label");
  const bar     = post.querySelector(".fbx-reaction-bar");

  // chỉ hiển thị "❤️ Bạn" như FB
  display.textContent = `${emojiMap[type]} Bạn`;

  // đổi màu nút Thích
  likeBtn.classList.add("active-like");
  icon.classList.remove("fa-regular");
  icon.classList.add("fa-solid");

  if (bar) bar.style.display = "none";
});

// click vào nút Thích (bật/tắt nếu chưa chọn reaction)
document.addEventListener("click", (e) => {
  const likeBtn = e.target.closest(".fbx-like-btn");
  if (!likeBtn) return;

  const post = likeBtn.closest(".fbx-post");
  const display = post.querySelector(".fbx-reaction-display");
  const icon = post.querySelector(".fbx-like-icon");

  // nếu chưa có reaction nào -> mặc định "like"
  if (!display.textContent.trim()) {
    display.textContent = `${emojiMap.like} Bạn`;
    likeBtn.classList.add("active-like");
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  } else {
    // tắt like
    display.textContent = "";
    likeBtn.classList.remove("active-like");
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
  }
});


  // bấm nút "Bình luận" -> focus ô nhập
document.addEventListener("click", (e) => {
  const cBtn = e.target.closest(".fbx-comment-btn");
  if (!cBtn) return;

  const post = cBtn.closest(".fbx-post");
  const input = post.querySelector(".fbx-comment-input");
  if (input) input.focus();
});

// gõ Enter trong ô comment -> thêm bình luận + tăng count
document.addEventListener("keydown", (e) => {
  if (!e.target.classList.contains("fbx-comment-input")) return;
  if (e.key !== "Enter") return;

  const input = e.target;
  const text = input.value.trim();
  if (!text) return;

  const post = input.closest(".fbx-post");
  const list = post.querySelector(".fbx-comment-list");
  const countEl = post.querySelector(".fbx-comments-count");

  list.insertAdjacentHTML(
    "beforeend",
    `
    <div class="fbx-comment-item">
      <img class="fbx-cavatar" src="messenger-clone/assets/images/6.png">
      <div class="fbx-comment-bubble">
        <div class="fbx-comment-author">Bạn</div>
        <div class="fbx-comment-text">${text}</div>
      </div>
    </div>
    `
  );

  // cập nhật "x bình luận"
  const current = parseInt((countEl.textContent || "0").split(" ")[0], 10) || 0;
  countEl.textContent = (current + 1) + " bình luận";

  input.value = "";
});


  // mở popup chia sẻ
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".fbx-share-btn");
  if (!btn) return;

  const post = btn.closest(".fbx-post");
  const popup = post.querySelector(".fbx-share-popup");
  popup.style.display = "flex";
});

// đóng popup
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".fbx-share-close");
  if (!closeBtn) return;

  closeBtn.closest(".fbx-share-popup").style.display = "none";
});

// chọn nơi chia sẻ -> hiện input tên bạn bè nếu messenger
document.addEventListener("change", (e) => {
  if (!e.target.classList.contains("fbx-share-target")) return;

  const popup = e.target.closest(".fbx-share-popup");
  const friendInput = popup.querySelector(".fbx-share-friend");

  friendInput.style.display = 
    e.target.value === "messenger" ? "block" : "none";
});

// bấm "Chia sẻ ngay"
document.addEventListener("click", (e) => {
  const sendBtn = e.target.closest(".fbx-share-send");
  if (!sendBtn) return;

  const popup = sendBtn.closest(".fbx-share-popup");
  const target = popup.querySelector(".fbx-share-target").value;
  const friend = popup.querySelector(".fbx-share-friend").value.trim();
  const content = popup.querySelector(".fbx-share-text").value.trim();

  let where = "Bảng feed của bạn";
  if (target === "private") where = "Chỉ mình tôi";
  if (target === "messenger") where = "Messenger → " + (friend || "bạn bè");

  // Hiển thị toast
  const toast = document.getElementById("fbxToast");
  toast.textContent = `Đã chia sẻ tới: ${where}`;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2200);

  popup.style.display = "none";
});



// hiển thị bạn bè trên trang
const friendsPreview = [
  {
    name: "Hue Do",
    avatar: "messenger-clone/assets/images/contact-2.png",
    mutual: 6
  },
  {
    name: "Anh Việt",
    avatar: "messenger-clone/assets/images/contact-1.png",
    mutual: 3
  },
  {
    name: "Thúy Nguyễn",
    avatar: "messenger-clone/assets/images/contact-3.png",
    mutual: 4
  },
  {
    name: "Lê Văn Hùng",
    avatar: "messenger-clone/assets/images/contact-4.png",
    mutual: 5
  }
];

function renderFriendsPreview() {
  const container = document.getElementById("friends-preview");
  if (!container) return;

  let html = "";
  friendsPreview.forEach(f => {
    html += `
      <div class="friend-preview-item">
        <img src="${f.avatar}">
        <div class="friend-preview-name">${f.name}</div>
        <div class="friend-preview-mutual">${f.mutual} bạn chung</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

renderFriendsPreview();


// ==================== NÚT "Xem tất cả bạn bè" ====================
document.addEventListener("click", (e) => {
    const btn = e.target.closest("#viewAllFriendsBtn");
    if (!btn) return;

    // 1. Active tab "Bạn bè"
    document.querySelectorAll(".p-nav-item").forEach(i => i.classList.remove("active"));

    const friendsTab = [...document.querySelectorAll(".p-nav-item")]
        .find(i => i.textContent.trim() === "Bạn bè");

    if (friendsTab) friendsTab.classList.add("active");

    // 2. Render trang bạn bè
    renderFriendsPage();

    // 3. Cuộn xuống nội dung chính
    document.querySelector(".content-area").scrollIntoView({
        behavior: "smooth"
    });
});



// ========================= END FULL SCRIPT =========================
