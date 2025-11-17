// Facebook Home Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initPostActions();
  initCreatePost();
  initStories();
  initScrollEffects();
  initNavigation();
});


// Post Actions (Like, Comment, Share)
function initPostActions() {
  const actionButtons = document.querySelectorAll('.action-btn');
  
  actionButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const actionText = this.querySelector('span').textContent;
      
      // Add active state
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 100);
      
      // Handle different actions
      if (actionText === 'Thích') {
        handleLike(this);
      } else if (actionText === 'Bình luận') {
        handleComment(this);
      } else if (actionText === 'Chia sẻ') {
        handleShare(this);
      }
    });
  });
}

function handleLike(button) {
  const span = button.querySelector('span');
  if (span.textContent === 'Thích') {
    span.textContent = 'Đã thích';
    button.style.color = 'var(--primary)';
    
    // Update reaction count
    const postCard = button.closest('.post-card');
    const reactionCount = postCard.querySelector('.reaction-count');
    if (reactionCount) {
      const currentCount = parseInt(reactionCount.textContent);
      reactionCount.textContent = currentCount + 1;
    }
  } else {
    span.textContent = 'Thích';
    button.style.color = 'var(--sub)';
    
    // Update reaction count
    const postCard = button.closest('.post-card');
    const reactionCount = postCard.querySelector('.reaction-count');
    if (reactionCount) {
      const currentCount = parseInt(reactionCount.textContent);
      reactionCount.textContent = currentCount - 1;
    }
  }
}

function handleComment(button) {
  alert('Chức năng bình luận đang được phát triển');
}

function handleShare(button) {
  alert('Chức năng chia sẻ đang được phát triển');
}

// Create Post
function initCreatePost() {
  const createPostInput = document.querySelector('.create-post-input');
  const postActions = document.querySelectorAll('.post-action');
  
  if (createPostInput) {
    createPostInput.addEventListener('click', function() {
      alert('Chức năng tạo bài viết đang được phát triển');
    });
  }
  
  postActions.forEach(action => {
    action.addEventListener('click', function(e) {
      e.preventDefault();
      const actionType = this.querySelector('span').textContent;
      
      // Add click animation
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 100);
      
      alert(`Chức năng "${actionType}" đang được phát triển`);
    });
  });
}

// Stories
function initStories() {
  const stories = document.querySelectorAll('.story');
  
  stories.forEach(story => {
    story.addEventListener('click', function() {
      if (this.classList.contains('create-story')) {
        alert('Chức năng tạo tin đang được phát triển');
      } else {
        const storyName = this.querySelector('.story-name').textContent;
        alert(`Đang xem tin của ${storyName}`);
      }
    });
  });
  
  // Add scroll snap for stories container
  const storiesContainer = document.querySelector('.stories-container');
  if (storiesContainer) {
    storiesContainer.style.scrollBehavior = 'smooth';
  }
}

// Scroll Effects
function initScrollEffects() {
  let lastScrollTop = 0;
  const topbar = document.querySelector('.topbar');
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow to topbar on scroll
    if (scrollTop > 0) {
      topbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    } else {
      topbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop;
  });
}

// Navigation
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  
  navButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      navButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Add ripple effect
      createRipple(this);
    });
  });
  
  // Menu items
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if (!this.classList.contains('see-more')) {
        e.preventDefault();
        alert('Chức năng này đang được phát triển');
      }
    });
  });
  
  // See more button
  const seeMoreBtn = document.querySelector('.see-more');
  if (seeMoreBtn) {
    seeMoreBtn.addEventListener('click', function() {
      alert('Hiển thị thêm menu');
    });
  }
  
  // Contact items
  const contactItems = document.querySelectorAll('.contact-item');
  contactItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const contactName = this.querySelector('.contact-name').textContent;
      window.location.href = `messenger-clone/index.html?contact=${encodeURIComponent(contactName)}`;
    });
  });
  
  // Sponsored items
  const sponsoredItems = document.querySelectorAll('.sponsored-item');
  sponsoredItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Đây là quảng cáo demo');
    });
  });
}

// Ripple effect
function createRipple(element) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = rect.width / 2;
  const y = rect.height / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x - size / 2 + 'px';
  ripple.style.top = y - size / 2 + 'px';
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(0, 0, 0, 0.1)';
  ripple.style.transform = 'scale(0)';
  ripple.style.animation = 'ripple 0.6s ease-out';
  ripple.style.pointerEvents = 'none';
  
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add CSS animation for ripple
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Handle post image clicks
document.querySelectorAll('.post-image').forEach(img => {
  img.addEventListener('click', function() {
    alert('Chức năng xem ảnh đầy đủ đang được phát triển');
  });
});

// Handle post more button
document.querySelectorAll('.post-more').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Menu tùy chọn bài viết:\n- Lưu bài viết\n- Ẩn bài viết\n- Báo cáo\n- Sao chép liên kết');
  });
});

// Handle post engagement clicks
document.querySelectorAll('.post-engagement span').forEach(span => {
  span.addEventListener('click', function() {
    const text = this.textContent;
    alert(`Xem ${text}`);
  });
});

// Handle reaction clicks
document.querySelectorAll('.post-reactions').forEach(reactions => {
  reactions.addEventListener('click', function() {
    alert('Danh sách người đã bày tỏ cảm xúc');
  });
});

// Icon buttons in sidebar
document.querySelectorAll('.icon-btn-small').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const title = this.getAttribute('title');
    alert(`Chức năng "${title}" đang được phát triển`);
  });
});


// Top right icon buttons
// ====== XỬ LÝ CÁC NÚT Ở GÓC PHẢI ======
const bellBtn = document.querySelector('.icon-btn[title="Thông báo"]');
const notiPanel = document.getElementById('notificationPanel');

// Toggle bật/tắt bảng thông báo
if (bellBtn && notiPanel) {
  bellBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notiPanel.classList.toggle('show');
  });

  // Ẩn panel khi click ra ngoài
  document.addEventListener('click', (e) => {
    if (!bellBtn.contains(e.target) && !notiPanel.contains(e.target)) {
      notiPanel.classList.remove('show');
    }
  });
}

// Messenger
const messengerBtn = document.querySelector('.icon-btn[title="Messenger"]');
if (messengerBtn) {
  messengerBtn.addEventListener('click', () => {
    window.location.href = 'messenger-clone/index.html';
  });
}

// Menu grid (9 chấm)
const menuBtn = document.querySelector('.icon-btn[title="Menu"]');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    alert('Menu ứng dụng sẽ hiển thị tại đây');
  });
}

// ========== MENU BA CHẤM TRONG THÔNG BÁO ==========
document.querySelectorAll('.noti-more').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = btn.parentElement.querySelector('.noti-menu-box');
    // Ẩn các menu khác
    document.querySelectorAll('.noti-menu-box').forEach(m => {
      if (m !== menu) m.classList.remove('show');
    });
    // Toggle menu hiện tại
    menu.classList.toggle('show');
  });
});

// Ẩn menu khi click ra ngoài
document.addEventListener('click', (e) => {
  if (!e.target.closest('.noti-right')) {
    document.querySelectorAll('.noti-menu-box').forEach(menu => menu.classList.remove('show'));
  }
});

// Hành động trong menu
document.querySelectorAll('.noti-menu-box li').forEach(item => {
  item.addEventListener('click', (e) => {
    const action = e.target.textContent.trim();
    if (action.includes('Đánh dấu')) {
      alert('✅ Thông báo đã được đánh dấu là chưa đọc');
    } else if (action.includes('Xóa')) {
      const notiItem = e.target.closest('.noti-item');
      notiItem.remove();
    } else if (action.includes('Báo cáo')) {
      alert('📨 Đã gửi báo cáo sự cố đến đội ngũ phụ trách.');
    }
  });
});
 

// ========== CHUYỂN TAB "TẤT CẢ" / "CHƯA ĐỌC" ==========

const allTab = document.querySelector('.noti-tabs button:nth-child(1)');
const unreadTab = document.querySelector('.noti-tabs button:nth-child(2)');
const notiList = document.querySelector('.noti-list');

// Khi bấm "Tất cả"
if (allTab && unreadTab) {
  allTab.addEventListener('click', () => {
    allTab.classList.add('active');
    unreadTab.classList.remove('active');
    notiItems.forEach(item => {
      item.style.display = 'flex';
    });

    // Nếu không có thông báo nào
    const emptyMsg = document.querySelector('.noti-empty');
    if (emptyMsg) emptyMsg.remove();
  });

  // Khi bấm "Chưa đọc"
  unreadTab.addEventListener('click', () => {
    unreadTab.classList.add('active');
    allTab.classList.remove('active');

    let unreadCount = 0;
    notiItems.forEach(item => {
      if (item.classList.contains('unread')) {
        item.style.display = 'flex';
        unreadCount++;
      } else {
        item.style.display = 'none';
      }
    });

    // Nếu không có thông báo chưa đọc, hiện thông báo trống
    if (unreadCount === 0) {
      // Xóa phần cũ nếu có
      const oldEmpty = document.querySelector('.noti-empty');
      if (oldEmpty) oldEmpty.remove();

      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'noti-empty';
      emptyDiv.innerHTML = `
        <div style="text-align:center; padding:40px 0; color:var(--sub);">
          <img src="messenger-clone/assets/icons/bell.svg" alt="" style="width:60px; opacity:0.5; margin-bottom:12px;">
          <p style="font-size:14px;">Bạn không có thông báo nào</p>
        </div>
      `;
      notiList.appendChild(emptyDiv);
    } else {
      const emptyMsg = document.querySelector('.noti-empty');
      if (emptyMsg) emptyMsg.remove();
    }
  });
}



// Avatar button
const avatarBtn = document.querySelector('.avatar-btn');
if (avatarBtn) {
  avatarBtn.addEventListener('click', function() {
    alert('Menu tài khoản:\n- Hồ sơ cá nhân\n- Cài đặt & quyền riêng tư\n- Trợ giúp & hỗ trợ\n- Đăng xuất');
  });
}

// Smooth scroll for sidebar
const leftSidebar = document.querySelector('.left-sidebar');
const rightSidebar = document.querySelector('.right-sidebar');

if (leftSidebar) {
  leftSidebar.style.scrollBehavior = 'smooth';
}

if (rightSidebar) {
  rightSidebar.style.scrollBehavior = 'smooth';
}

// Add loading effect for images
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('load', function() {
    this.style.opacity = '1';
  });
  
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.3s ease-in-out';
  
  if (img.complete) {
    img.style.opacity = '1';
  }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    // Update layout on resize
    console.log('Window resized');
  }, 250);
});

// Infinite scroll simulation (for demo purposes)
let isLoading = false;
window.addEventListener('scroll', function() {
  if (isLoading) return;
  
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    isLoading = true;
    console.log('Loading more posts...');
    
    // Simulate loading delay
    setTimeout(() => {
      isLoading = false;
    }, 1000);
  }
});


// Console welcome message
console.log('%c Facebook Clone ', 'background: #1877f2; color: white; font-size: 20px; padding: 10px;');
console.log('%c Developed by DuccDung ', 'font-size: 14px; padding: 5px;');
console.log('%c ⚠️ Cảnh báo: ', 'color: red; font-weight: bold; font-size: 16px;');
console.log('Đây là trang demo. Không nhập bất kỳ thông tin cá nhân nào!');


// ========== HIỂN THỊ BÀI VIẾT KHI BẤM THÔNG BÁO ==========
const postModal = document.getElementById("postModal");
const postPopupContent = document.getElementById("postPopupContent");
const postPopupTitle = document.getElementById("postPopupTitle");
const closePostModal = document.getElementById("closePostModal");
const notiItems = document.querySelectorAll(".noti-item");

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

// 👉 Nút đóng modal
if (closePostModal) {
  closePostModal.addEventListener("click", () => {
    postModal.classList.remove("show");
  });
}

// 👉 Click vùng overlay để đóng modal
if (postModal) {
  postModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("post-overlay")) {
      postModal.classList.remove("show");
    }
  });
}


// 👉 Sự kiện click trên các thông báo nhỏ (panel chính)
notiItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    // Nếu click vào menu ba chấm hoặc menu item thì bỏ qua
    if (
      e.target.closest(".noti-more") ||
      e.target.closest(".noti-menu-box") ||
      e.target.tagName === "LI"
    ) {
      e.stopImmediatePropagation();
      return;
    }
    openPostFromNotification(item);
  });
});

// 👉 Các nút trong menu 3 chấm của panel nhỏ
document.querySelectorAll(".noti-menu-box li").forEach((li) => {
  li.addEventListener("click", (e) => {
    e.stopPropagation();
    const act = li.textContent.trim();
    const parent = li.closest(".noti-item");
    if (act.includes("Đánh dấu")) {
      parent?.classList.toggle("unread");
      alert("✅ Đã đánh dấu là chưa đọc");
    } else if (act.includes("Xóa")) {
      parent?.remove();
    } else if (act.includes("Báo cáo")) {
      alert("📨 Báo cáo đã được gửi.");
    }
    li.closest(".noti-menu-box")?.classList.remove("show");
  });
});

// 👉 Xử lý mở/đóng modal bài viết
if (closePostModal) {
  closePostModal.addEventListener("click", () => {
    postModal.classList.remove("show");
  });
}
if (postModal) {
  postModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("post-overlay")) {
      postModal.classList.remove("show");
    }
  });
}

// ========== TRANG XEM TOÀN BỘ THÔNG BÁO ==========
const viewAllLink = document.querySelector(".noti-section-title a");
const notificationFull = document.getElementById("notificationFullPage");
const notiFullList = document.querySelector(".noti-full-list");

if (viewAllLink && notificationFull && notiFullList) {
  viewAllLink.addEventListener("click", (e) => {
    e.preventDefault();
    notiPanel.classList.remove("show");
    notificationFull.classList.add("show");
    renderFullNotifications();
  });
}

function renderFullNotifications(filterUnread = false) {
  notiFullList.innerHTML = "";
  const allNoti = Array.from(document.querySelectorAll(".noti-item"));
  const list = allNoti.filter(
    (i) => !filterUnread || i.classList.contains("unread")
  );

  list.forEach((item) => {
    const img = item.querySelector("img")?.src || "";
    const text = item.querySelector(".noti-text p")?.innerHTML || "";
    const time = item.querySelector(".noti-text span")?.textContent || "";
    const unread = item.classList.contains("unread");

    const div = document.createElement("div");
    div.className = "noti-full-item";
    if (unread) div.classList.add("unread");

    div.innerHTML = `
      <img src="${img}">
      <div style="flex:1;">
        <div class="noti-text">
          <p>${text}</p>
          <span style="font-size:13px;color:var(--sub);">${time}</span>
        </div>
      </div>
      <div class="noti-right" style="position:relative;">
        <button class="icon-btn noti-more"><img src="messenger-clone/assets/icons/dots.svg"></button>
        <div class="noti-menu-box">
          <ul>
            <li>✔ Đánh dấu là chưa đọc</li>
            <li>✖ Xóa thông báo này</li>
            <li>⚙️ Báo cáo sự cố cho đội ngũ phụ trách</li>
          </ul>
        </div>
      </div>
    `;

    // ✅ Click vùng nội dung mở bài viết
    div.addEventListener("click", (e) => {
      if (
        e.target.closest(".noti-more") ||
        e.target.closest(".noti-menu-box") ||
        e.target.tagName === "LI"
      ) {
        e.stopImmediatePropagation();
        return;
      }
      openPostFromNotification(item);
    });

    // 👉 Nút ba chấm
    const menuBtn = div.querySelector(".noti-more");
    const menuBox = div.querySelector(".noti-menu-box");
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document
        .querySelectorAll(".noti-menu-box")
        .forEach((m) => m.classList.remove("show"));
      menuBox.classList.toggle("show");
    });

    // 👉 Menu chức năng
    menuBox.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        const act = li.textContent.trim();
        if (act.includes("Đánh dấu")) {
          div.classList.toggle("unread");
          alert("✅ Đã đánh dấu là chưa đọc");
        } else if (act.includes("Xóa")) {
          div.remove();
        } else if (act.includes("Báo cáo")) {
          alert("📨 Báo cáo đã được gửi.");
        }
        menuBox.classList.remove("show");
      });
    });

    notiFullList.appendChild(div);
  });

  // Nếu không có thông báo nào
  if (list.length === 0) {
    notiFullList.innerHTML = `
      <div style="text-align:center;padding:60px 0;color:var(--sub);">
        <img src="messenger-clone/assets/icons/bell.svg" style="width:60px;opacity:0.5;"><br>
        <p>Không có thông báo nào.</p>
      </div>
    `;
  }
}

// 👉 Tabs Tất cả / Chưa đọc
const fullTabs = document.querySelectorAll(".noti-full .noti-tabs button");
if (fullTabs.length === 2) {
  const [tabAll, tabUnread] = fullTabs;
  tabAll.addEventListener("click", () => {
    tabAll.classList.add("active");
    tabUnread.classList.remove("active");
    renderFullNotifications(false);
  });
  tabUnread.addEventListener("click", () => {
    tabUnread.classList.add("active");
    tabAll.classList.remove("active");
    renderFullNotifications(true);
  });
}

// 👉 Nút quay lại
document.querySelector(".back-btn")?.addEventListener("click", () => {
  notificationFull.classList.remove("show");
});
