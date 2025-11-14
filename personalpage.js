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

// ========================= END FULL SCRIPT =========================
