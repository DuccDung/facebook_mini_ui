// ============================================
// FACEBOOK HOME - COMPLETE IMPLEMENTATION
// ============================================

// ===== GLOBAL STATE =====
let currentStoryIndex = 0;
let storyAutoPlayTimer = null;
const stories = [
  { name: 'Lê Ngọc', avatar: 'messenger-clone/assets/images/contact-1.png', image: 'messenger-clone/assets/images/contact-1.png', time: '2 giờ' },
  { name: 'Trần Mai', avatar: 'messenger-clone/assets/images/contact-2.png', image: 'messenger-clone/assets/images/contact-2.png', time: '5 giờ' },
  { name: 'Phạm Thảo', avatar: 'messenger-clone/assets/images/contact-3.png', image: 'messenger-clone/assets/images/contact-3.png', time: '8 giờ' },
  { name: 'Ngô Hải', avatar: 'messenger-clone/assets/images/contact-4.png', image: 'messenger-clone/assets/images/contact-4.png', time: '12 giờ' },
  { name: 'Đỗ Linh', avatar: 'messenger-clone/assets/images/contact-5.png', image: 'messenger-clone/assets/images/contact-5.png', time: '1 ngày' },
];

const reactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
const reactionEmojis = {
  like: '👍', love: '❤️', haha: '😆', 
  wow: '😮', sad: '😢', angry: '😠'
};
const reactionNames = {
  like: 'Thích', love: 'Yêu thích', haha: 'Haha',
  wow: 'Wow', sad: 'Buồn', angry: 'Phẫn nộ'
};

const comments = [];
let currentPost = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  initStoryViewer();
  initReactionsPicker();
  initReactionsModal();
  initCommentsModal();
  initCreatePostModal();
  initSharePostModal();
  initNavigation();
});

// ==========================================
// STORY VIEWER
// ==========================================
function initStoryViewer() {
  const storyElements = document.querySelectorAll('.story:not(.create-story)');

  storyElements.forEach((story, index) => {
    story.addEventListener('click', () => {
      // Chuyển đến trang story-viewer với index của user
      window.location.href = `story-viewer.html?user=${index}`;
    });
  });
}

// Story viewer functions are no longer needed
// Stories now open in separate page (story-viewer.html)

// ==========================================
// REACTIONS SYSTEM
// ==========================================
function initReactionsPicker() {
  const likeButtons = document.querySelectorAll('.action-btn');
  const picker = document.getElementById('reactionsPicker');
  
  let currentButton = null;
  let hoverTimeout = null;
  let isPickerShowing = false;
  
  likeButtons.forEach(button => {
    const span = button.querySelector('span');
    if (!span || !span.textContent.includes('Thích')) return;
    
    // Lưu reaction hiện tại của button và SVG gốc
    button.currentReaction = null;
    button.originalSVG = button.querySelector('svg') ? button.querySelector('svg').outerHTML : null;
    
    // Click trực tiếp = Toggle reaction
    button.addEventListener('click', function(e) {
      // Chỉ xử lý click khi picker không hiển thị
      if (!isPickerShowing) {
        handleQuickClick(this);
      }
    });
    
    // Hover = hiển thị thanh reactions (tăng delay lên 500ms)
    button.addEventListener('mouseenter', function() {
      currentButton = this;
      clearTimeout(hoverTimeout);
      
      hoverTimeout = setTimeout(() => {
        isPickerShowing = true;
        showReactionsPicker(this);
      }, 1000);
    });
    
    button.addEventListener('mouseleave', function() {
      clearTimeout(hoverTimeout);
      
      setTimeout(() => {
        if (!picker.matches(':hover')) {
          picker.classList.remove('active');
          isPickerShowing = false;
        }
      }, 100);
    });
  });
  
  // Picker events
  picker.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);
  });
  
  picker.addEventListener('mouseleave', () => {
    picker.classList.remove('active');
    isPickerShowing = false;
  });
  
  // Reaction buttons click
  const reactionButtons = picker.querySelectorAll('.reaction-btn');
  reactionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const reaction = this.dataset.reaction;
      if (currentButton) {
        selectReaction(currentButton, reaction);
      }
      picker.classList.remove('active');
      isPickerShowing = false;
    });
  });
}

function showReactionsPicker(button) {
  const picker = document.getElementById('reactionsPicker');
  const rect = button.getBoundingClientRect();
  
  // Đặt vị trí picker ngay trên nút
  picker.style.left = rect.left + 'px';
  picker.style.top = rect.top + 'px';
  
  picker.classList.add('active');
}

function handleQuickClick(button) {
  const postCard = button.closest('.post-card');
  
  // Nếu đã có reaction bất kỳ -> Hủy reaction
  if (button.currentReaction) {
    removeReaction(button);
    updateReactionCount(postCard, -1);
  } 
  // Nếu chưa có reaction -> Thả Like
  else {
    setReaction(button, 'like');
    updateReactionCount(postCard, 1);
  }
}

function selectReaction(button, reaction) {
  const postCard = button.closest('.post-card');
  const wasReacted = button.currentReaction !== null;
  
  // Set reaction mới
  setReaction(button, reaction);
  
  // Cập nhật count nếu là reaction mới (chưa có reaction trước đó)
  if (!wasReacted) {
    updateReactionCount(postCard, 1);
  }
}

function setReaction(button, reaction) {
  const emoji = reactionEmojis[reaction];
  const name = reactionNames[reaction];
  
  // Lưu reaction hiện tại
  button.currentReaction = reaction;
  
  // Xóa tất cả SVG cũ trong button
  const existingSVG = button.querySelector('svg');
  if (existingSVG) {
    existingSVG.remove();
  }
  
  // Tạo nội dung mới chỉ có emoji + text
  const span = button.querySelector('span') || button;
  span.innerHTML = '<span style="font-size: 18px; margin-right: 4px;">' + emoji + '</span>' + name;
  
  // Set màu theo từng loại reaction
  const colors = {
    like: 'var(--primary)',
    love: '#f33e58',
    haha: '#f7b125',
    wow: '#f7b125',
    sad: '#f7b125',
    angry: '#e9710f'
  };
  button.style.color = colors[reaction] || 'var(--primary)';
}

function removeReaction(button) {
  // Reset về trạng thái ban đầu
  button.currentReaction = null;
  button.style.color = '';
  
  // Khôi phục SVG gốc và text
  if (button.originalSVG) {
    button.innerHTML = button.originalSVG + '<span>Thích</span>';
  } else {
    const span = button.querySelector('span') || button;
    span.textContent = 'Thích';
  }
}

function updateReactionCount(postCard, change) {
  const countElement = postCard.querySelector('.reaction-count');
  if (countElement) {
    const current = parseInt(countElement.textContent) || 0;
    countElement.textContent = Math.max(0, current + change);
  }
}

// ==========================================
// REACTIONS MODAL
// ==========================================
function initReactionsModal() {
  const reactionsLinks = document.querySelectorAll('.post-reactions');
  const modal = document.getElementById('reactionsModal');
  const closeBtn = document.getElementById('closeReactionsModal');
  const overlay = modal.querySelector('.modal-overlay');
  
  reactionsLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      currentPost = this.closest('.post-card');
      openReactionsModal();
    });
  });
  
  closeBtn.addEventListener('click', () => closeModal(modal));
  overlay.addEventListener('click', () => closeModal(modal));
  
  // Tabs
  const tabs = modal.querySelectorAll('.reactions-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      filterReactions(this.dataset.tab);
    });
  });
}

function openReactionsModal() {
  const modal = document.getElementById('reactionsModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  loadReactionsList();
}

function loadReactionsList() {
  const list = document.getElementById('reactionsList');
  list.innerHTML = '';
  
  // Mock data
  const users = [
    { name: 'Nguyễn Văn An', avatar: 'messenger-clone/assets/images/contact-1.png', reaction: 'like', time: '2 giờ' },
    { name: 'Trần Thị Bình', avatar: 'messenger-clone/assets/images/contact-2.png', reaction: 'love', time: '3 giờ' },
    { name: 'Lê Hoàng Cường', avatar: 'messenger-clone/assets/images/contact-3.png', reaction: 'care', time: '5 giờ' },
    { name: 'Phạm Mai Dung', avatar: 'messenger-clone/assets/images/contact-4.png', reaction: 'haha', time: '6 giờ' },
    { name: 'Vũ Quốc Đạt', avatar: 'messenger-clone/assets/images/contact-5.png', reaction: 'like', time: '8 giờ' },
  ];
  
  users.forEach(user => {
    const item = document.createElement('div');
    item.className = 'reaction-user-item';
    item.innerHTML = `
      <img src="${user.avatar}" alt="" class="reaction-user-avatar">
      <div class="reaction-user-info">
        <div class="reaction-user-name">${user.name}</div>
        <div class="reaction-user-time">${user.time}</div>
      </div>
      <div class="reaction-user-emoji">${reactionEmojis[user.reaction]}</div>
    `;
    list.appendChild(item);
  });
}

function filterReactions(type) {
  console.log('Filter reactions by:', type);
  // Implement filtering logic
}

// ==========================================
// COMMENTS SYSTEM
// ==========================================
function initCommentsModal() {
  const commentButtons = document.querySelectorAll('.action-btn');
  const modal = document.getElementById('commentsModal');
  const closeBtn = document.getElementById('closeCommentsModal');
  const overlay = modal.querySelector('.modal-overlay');
  const sendBtn = document.getElementById('sendComment');
  const input = document.getElementById('commentInput');
  
  commentButtons.forEach(button => {
    const span = button.querySelector('span');
    if (span && span.textContent === 'Bình luận') {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        currentPost = this.closest('.post-card');
        openCommentsModal();
      });
    }
  });
  
  closeBtn.addEventListener('click', () => closeModal(modal));
  overlay.addEventListener('click', () => closeModal(modal));
  
  sendBtn.addEventListener('click', () => sendComment());
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendComment();
    }
  });
}

function openCommentsModal() {
  const modal = document.getElementById('commentsModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  loadComments();
}

function loadComments() {
  const list = document.getElementById('commentsList');
  list.innerHTML = '';
  
  // Mock comments
  const mockComments = [
    {
      id: 1,
      user: 'Nguyễn Mai Anh',
      avatar: 'messenger-clone/assets/images/contact-1.png',
      text: 'Bài viết rất hay! 👍',
      time: '2 giờ',
      reactions: { like: 5, love: 2 }
    },
    {
      id: 2,
      user: 'Trần Văn Bình',
      avatar: 'messenger-clone/assets/images/contact-2.png',
      text: 'Cảm ơn bạn đã chia sẻ',
      time: '1 giờ',
      reactions: { like: 3 }
    }
  ];
  
  mockComments.forEach(comment => {
    const item = createCommentElement(comment);
    list.appendChild(item);
  });
}

function createCommentElement(comment) {
  const div = document.createElement('div');
  div.className = 'comment-item';
  div.dataset.commentId = comment.id;
  
  div.innerHTML = `
    <img src="${comment.avatar}" alt="" class="comment-avatar">
    <div>
      <div class="comment-content">
        <div class="comment-author">${comment.user}</div>
        <div class="comment-text">${comment.text}</div>
      </div>
      <div class="comment-actions">
        <span class="comment-action" data-action="like">Thích</span>
        <span class="comment-action" data-action="reply">Phản hồi</span>
        <span class="comment-action" data-action="delete">Xóa</span>
        <span class="comment-time">${comment.time}</span>
      </div>
    </div>
  `;
  
  // Add event listeners
  const actions = div.querySelectorAll('.comment-action');
  actions.forEach(action => {
    action.addEventListener('click', function() {
      handleCommentAction(comment.id, this.dataset.action);
    });
  });
  
  return div;
}

function sendComment() {
  const input = document.getElementById('commentInput');
  const text = input.value.trim();
  
  if (!text) return;
  
  const newComment = {
    id: Date.now(),
    user: 'Bạn',
    avatar: 'messenger-clone/assets/images/avatar-default.png',
    text: text,
    time: 'Vừa xong',
    reactions: {}
  };
  
  const list = document.getElementById('commentsList');
  const commentElement = createCommentElement(newComment);
  list.appendChild(commentElement);
  
  input.value = '';
  
  // Update comment count
  if (currentPost) {
    const engagementSpan = currentPost.querySelector('.post-engagement span');
    if (engagementSpan) {
      const match = engagementSpan.textContent.match(/\d+/);
      if (match) {
        const count = parseInt(match[0]) + 1;
        engagementSpan.textContent = `${count} bình luận`;
      }
    }
  }
}

function handleCommentAction(commentId, action) {
  console.log('Comment action:', commentId, action);
  
  switch(action) {
    case 'like':
      // Toggle like on comment
      break;
    case 'reply':
      // Focus input and set reply mode
      document.getElementById('commentInput').focus();
      break;
    case 'delete':
      // Confirm and delete comment
      if (confirm('Bạn có chắc muốn xóa bình luận này?')) {
        const element = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (element) element.remove();
      }
      break;
  }
}

// ==========================================
// CREATE POST
// ==========================================
function initCreatePostModal() {
  const createPostInput = document.querySelector('.create-post-input');
  const modal = document.getElementById('createPostModal');
  const closeBtn = document.getElementById('closeCreatePostModal');
  const overlay = modal.querySelector('.modal-overlay');
  const submitBtn = document.getElementById('submitPost');
  const textarea = document.getElementById('createPostTextarea');
  const fileInput = document.getElementById('createPostFileInput');
  
  createPostInput.addEventListener('click', () => openCreatePostModal());
  
  closeBtn.addEventListener('click', () => closeModal(modal));
  overlay.addEventListener('click', () => closeModal(modal));
  
  submitBtn.addEventListener('click', () => createPost());
  
  // Option buttons
  const optionBtns = modal.querySelectorAll('.create-post-option-btn');
  optionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const option = this.dataset.option;
      handleCreatePostOption(option);
    });
  });
  
  // File input
  fileInput.addEventListener('change', function(e) {
    handleFileUpload(e.target.files);
  });
  
  // Enable/disable submit button
  textarea.addEventListener('input', function() {
    submitBtn.disabled = !this.value.trim();
  });
}

function openCreatePostModal() {
  const modal = document.getElementById('createPostModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('createPostTextarea').focus();
}

function handleCreatePostOption(option) {
  switch(option) {
    case 'photo':
      document.getElementById('createPostFileInput').click();
      break;
    case 'tag':
      alert('Chức năng tag bạn bè đang được phát triển');
      break;
    case 'feeling':
      alert('Chức năng cảm xúc/hoạt động đang được phát triển');
      break;
    case 'location':
      alert('Chức năng vị trí đang được phát triển');
      break;
  }
}

function handleFileUpload(files) {
  const preview = document.getElementById('createPostPreview');
  preview.innerHTML = '';
  
  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'create-post-preview-img';
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
}

function createPost() {
  const textarea = document.getElementById('createPostTextarea');
  const text = textarea.value.trim();
  
  if (!text) return;
  
  // Create new post element and add to feed
  alert('Bài viết đã được tạo: ' + text);
  
  // Close modal and reset
  closeModal(document.getElementById('createPostModal'));
  textarea.value = '';
  document.getElementById('createPostPreview').innerHTML = '';
}

// ==========================================
// SHARE POST
// ==========================================
function initSharePostModal() {
  const shareButtons = document.querySelectorAll('.action-btn');
  const modal = document.getElementById('sharePostModal');
  const closeBtn = document.getElementById('closeSharePostModal');
  const overlay = modal.querySelector('.modal-overlay');
  
  shareButtons.forEach(button => {
    const span = button.querySelector('span');
    if (span && span.textContent === 'Chia sẻ') {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        currentPost = this.closest('.post-card');
        openSharePostModal();
      });
    }
  });
  
  closeBtn.addEventListener('click', () => closeModal(modal));
  overlay.addEventListener('click', () => closeModal(modal));
  
  // Share options
  const options = modal.querySelectorAll('.share-option');
  options.forEach(option => {
    option.addEventListener('click', function() {
      const title = this.querySelector('.share-option-title').textContent;
      handleShare(title);
    });
  });
}

function openSharePostModal() {
  const modal = document.getElementById('sharePostModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Show post preview
  const preview = document.getElementById('sharePostPreview');
  if (currentPost) {
    preview.innerHTML = currentPost.innerHTML;
  }
}

function handleShare(type) {
  console.log('Share type:', type);
  alert(`Đã chia sẻ: ${type}`);
  closeModal(document.getElementById('sharePostModal'));
  
  // Update share count
  if (currentPost) {
    const shareSpan = currentPost.querySelector('.post-engagement span:last-child');
    if (shareSpan) {
      const match = shareSpan.textContent.match(/\d+/);
      if (match) {
        const count = parseInt(match[0]) + 1;
        shareSpan.textContent = `${count} lượt chia sẻ`;
      }
    }
  }
}

// ==========================================
// NAVIGATION & UTILITIES
// ==========================================
function initNavigation() {
  // Messenger button
  const messengerBtn = document.querySelector('.icon-btn[title="Messenger"]');
  if (messengerBtn) {
    messengerBtn.addEventListener('click', () => {
      window.location.href = 'messenger-clone/index.html';
    });
  }
  
  // Profile button
  const profileBtn = document.querySelector('.avatar-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      // Navigate to profile page when ready
      console.log('Profile clicked - add profile page navigation');
      // window.location.href = 'personalpage.html';
    });
  }
  
  // Logo
  const logo = document.querySelector('.brand');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'home.html';
    });
  }
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K: Focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.querySelector('.searchbar input').focus();
  }
});
