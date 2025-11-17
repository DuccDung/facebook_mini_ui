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

// Store comments for each post by post ID
const postComments = new Map();
let currentPost = null;
let currentPostId = null;
let replyingTo = null; // Track which comment is being replied to
let currentCommentReactionElement = null; // Track element for comment/reply reactions
let commentReactionHoverTimeout = null;
let isCommentReactionPickerShowing = false;

// Initialize post IDs for existing posts
function initializePostIds() {
  const posts = document.querySelectorAll('.post-card');
  posts.forEach((post, index) => {
    if (!post.dataset.postId) {
      post.dataset.postId = `post-${Date.now()}-${index}`;
      // Initialize with some mock comments for existing posts
      initializeMockComments(post.dataset.postId, index);
    }
  });
}

function initializeMockComments(postId, postIndex) {
  const mockCommentsData = [
    // Comments for first post
    [
      {
        id: 1,
        user: 'Nguyễn Mai Anh',
        avatar: 'messenger-clone/assets/images/contact-1.png',
        text: 'Bài viết rất hay! 👍 Mình rất thích nội dung này',
        time: '2 giờ',
        reactions: { like: 5, love: 2 },
        liked: false,
        replies: [
          {
            id: 101,
            user: 'Lê Ngọc',
            avatar: 'messenger-clone/assets/images/contact-3.png',
            text: 'Mình cũng nghĩ vậy!',
            time: '1 giờ',
            reactions: { like: 2 },
            liked: false,
            replies: []
          }
        ]
      },
      {
        id: 2,
        user: 'Trần Mai',
        avatar: 'messenger-clone/assets/images/contact-2.png',
        text: 'Cảm ơn bạn đã chia sẻ!',
        time: '1 giờ',
        reactions: { like: 3 },
        liked: false,
        replies: []
      }
    ],
    // Comments for second post
    [
      {
        id: 3,
        user: 'Phạm Thảo',
        avatar: 'messenger-clone/assets/images/contact-3.png',
        text: 'Cuối tuần đi cafe nhé! ☕',
        time: '3 giờ',
        reactions: { love: 2 },
        liked: false,
        replies: []
      }
    ],
    // Comments for third post
    [
      {
        id: 4,
        user: 'Ngô Hải',
        avatar: 'messenger-clone/assets/images/contact-4.png',
        text: 'Chúc bạn một ngày tốt lành! 💪',
        time: '5 giờ',
        reactions: { like: 4, love: 1 },
        liked: false,
        replies: [
          {
            id: 401,
            user: 'Đỗ Linh',
            avatar: 'messenger-clone/assets/images/contact-5.png',
            text: 'Cảm ơn bạn nhiều!',
            time: '4 giờ',
            reactions: { like: 1 },
            liked: false,
            replies: []
          }
        ]
      }
    ]
  ];
  
  if (postIndex < mockCommentsData.length) {
    postComments.set(postId, mockCommentsData[postIndex]);
  } else {
    postComments.set(postId, []);
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  initializePostIds();
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
    clearTimeout(commentReactionHoverTimeout);
  });
  
  picker.addEventListener('mouseleave', () => {
    picker.classList.remove('active');
    isPickerShowing = false;
    isCommentReactionPickerShowing = false;
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
  
  // Auto-resize textarea and update send button state
  input.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    updateCommentSendButton();
  });
  
  // Image upload functionality
  const photoBtn = document.getElementById('commentPhotoBtn');
  const imageInput = document.getElementById('commentImageInput');
  const imagePreview = document.getElementById('commentImagePreview');
  
  photoBtn.addEventListener('click', () => {
    imageInput.click();
  });
  
  imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(event) {
        imagePreview.innerHTML = `
          <img src="${event.target.result}" alt="Preview">
          <button class="comment-image-remove" onclick="removeCommentImage()">✖</button>
        `;
        imagePreview.classList.add('active');
        updateCommentSendButton();
      };
      reader.readAsDataURL(file);
    }
  });
}

function updateCommentSendButton() {
  const input = document.getElementById('commentInput');
  const sendBtn = document.getElementById('sendComment');
  const imagePreview = document.getElementById('commentImagePreview');
  const hasImage = imagePreview.classList.contains('active');
  const hasText = input.value.trim().length > 0;
  
  sendBtn.disabled = !hasText && !hasImage;
}

function removeCommentImage() {
  const imagePreview = document.getElementById('commentImagePreview');
  const imageInput = document.getElementById('commentImageInput');
  
  imagePreview.innerHTML = '';
  imagePreview.classList.remove('active');
  imageInput.value = '';
  updateCommentSendButton();
}

function openCommentsModal() {
  const modal = document.getElementById('commentsModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Get current post ID
  if (currentPost) {
    currentPostId = currentPost.dataset.postId;
    if (!currentPostId) {
      currentPostId = `post-${Date.now()}`;
      currentPost.dataset.postId = currentPostId;
      postComments.set(currentPostId, []);
    }
  }
  
  loadPostPreview();
  loadComments();
}

function loadPostPreview() {
  if (!currentPost) return;
  
  const preview = document.querySelector('.comments-post-preview');
  
  // Get post data
  const avatar = currentPost.querySelector('.post-avatar').src;
  const author = currentPost.querySelector('.post-author').textContent;
  const time = currentPost.querySelector('.post-time').textContent;
  const contentElement = currentPost.querySelector('.post-content p');
  const content = contentElement ? contentElement.textContent : '';
  const imageElement = currentPost.querySelector('.post-image img');
  const imageSrc = imageElement ? imageElement.src : null;
  
  // Build preview HTML
  let previewHTML = `
    <div class="preview-post-header">
      <img src="${avatar}" alt="" class="preview-post-avatar">
      <div class="preview-post-author-info">
        <div class="preview-post-author">${author}</div>
        <div class="preview-post-time">${time}</div>
      </div>
    </div>
  `;
  
  if (content) {
    previewHTML += `
      <div class="preview-post-content">
        <p>${content}</p>
      </div>
    `;
  }
  
  if (imageSrc) {
    previewHTML += `
      <div class="preview-post-image">
        <img src="${imageSrc}" alt="Post image">
      </div>
    `;
  }
  
  preview.innerHTML = previewHTML;
}

function loadComments() {
  const list = document.getElementById('commentsList');
  list.innerHTML = '';
  
  // Get comments for current post
  const comments = postComments.get(currentPostId) || [];
  
  if (comments.length === 0) {
    list.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--sub);">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</div>';
    return;
  }
  
  comments.forEach(comment => {
    const item = createCommentElement(comment);
    list.appendChild(item);
  });
}

function createCommentElement(comment, level = 0) {
  const div = document.createElement('div');
  div.className = 'comment-block';
  div.dataset.commentId = comment.id;
  div.dataset.level = level;
  
  // Calculate total reactions
  const reactionCount = Object.values(comment.reactions || {}).reduce((a, b) => a + b, 0);
  const reactionEmojisArr = Object.keys(comment.reactions || {})
    .filter(key => comment.reactions[key] > 0)
    .map(key => reactionEmojis[key])
    .slice(0, 3);
  
  const reactionBadge = reactionCount > 0 ? `
    <div class="comment-reaction-count">
      ${reactionEmojisArr.map(emoji => `<span class="comment-reaction-emoji">${emoji}</span>`).join('')}
      <span class="comment-reaction-number">${reactionCount}</span>
    </div>
  ` : '';
  
  const commentImageHtml = comment.image ? `
    <div class="comment-image">
      <img src="${comment.image}" alt="Comment image">
    </div>
  ` : '';
  
  div.innerHTML = `
    <div class="comment-item">
      <img src="${comment.avatar}" alt="" class="comment-avatar">
      <div style="flex: 1;">
        <div class="comment-content">
          <div class="comment-author">${comment.user}</div>
          <div class="comment-text">${comment.text}</div>
          ${commentImageHtml}
          ${reactionBadge}
        </div>
        <div class="comment-actions">
          <span class="comment-action ${comment.liked ? 'liked' : ''}" data-action="like" data-comment-id="${comment.id}">
            ${comment.liked ? 'Đã thích' : 'Thích'}
          </span>
          <span class="comment-action" data-action="reply" data-comment-id="${comment.id}">Phản hồi</span>
          <span class="comment-time">${comment.time}</span>
        </div>
      </div>
    </div>
    
    <!-- Reply Input (hidden by default) -->
    <div class="reply-input-wrapper" data-reply-to="${comment.id}">
      <img src="messenger-clone/assets/images/avatar-default.png" alt="" class="reply-avatar">
      <div class="reply-input-container">
        <input type="text" class="reply-input" placeholder="Viết phản hồi..." data-parent-id="${comment.id}">
      </div>
      <button class="reply-cancel-btn" data-cancel-reply="${comment.id}">Hủy</button>
    </div>
  `;
  
  // Add "View all replies" button if there are 2 or more replies
  if (comment.replies && comment.replies.length >= 2) {
    const viewAllBtn = document.createElement('button');
    viewAllBtn.className = 'view-all-replies-btn';
    viewAllBtn.innerHTML = `
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 10.5l-4-4h8l-4 4z"/>
      </svg>
      Xem tất cả ${comment.replies.length} phản hồi
    `;
    viewAllBtn.dataset.commentId = comment.id;
    div.appendChild(viewAllBtn);
  }
  
  // Add reply container (will contain nested replies)
  const replyContainer = document.createElement('div');
  replyContainer.className = 'reply-container';
  replyContainer.dataset.repliesFor = comment.id;
  
  // Hide replies initially if there are 2 or more
  if (comment.replies && comment.replies.length >= 2) {
    replyContainer.style.display = 'none';
  }
  
  div.appendChild(replyContainer);
  
  // Add replies recursively if they exist
  if (comment.replies && comment.replies.length > 0) {
    comment.replies.forEach(reply => {
      const replyElement = createCommentElement(reply, level + 1);
      replyContainer.appendChild(replyElement);
    });
  }
  
  // Add click handler for "View all replies" button
  const viewAllBtn = div.querySelector('.view-all-replies-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', function() {
      const container = this.nextElementSibling;
      const isExpanded = this.classList.contains('expanded');
      
      if (isExpanded) {
        // Collapse
        container.style.display = 'none';
        this.classList.remove('expanded');
        this.innerHTML = `
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 10.5l-4-4h8l-4 4z"/>
          </svg>
          Xem tất cả ${comment.replies.length} phản hồi
        `;
      } else {
        // Expand
        container.style.display = 'flex';
        this.classList.add('expanded');
        this.innerHTML = `
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 10.5l-4-4h8l-4 4z"/>
          </svg>
          Ẩn phản hồi
        `;
      }
    });
  }
  
  // Add event listeners
  const actions = div.querySelectorAll('.comment-action');
  actions.forEach(action => {
    action.addEventListener('click', function(e) {
      const commentId = parseInt(this.dataset.commentId);
      const actionType = this.dataset.action;
      
      if (actionType === 'like') {
        // Chỉ xử lý click khi picker không hiển thị
        if (!isCommentReactionPickerShowing) {
          handleCommentQuickClick(this, comment);
        }
      } else {
        handleCommentAction(commentId, actionType, comment);
      }
    });
    
    // Hover for reactions picker (only for like action)
    if (action.dataset.action === 'like') {
      action.addEventListener('mouseenter', function() {
        currentCommentReactionElement = this;
        clearTimeout(commentReactionHoverTimeout);
        
        commentReactionHoverTimeout = setTimeout(() => {
          isCommentReactionPickerShowing = true;
          showCommentReactionsPicker(this);
        }, 900);
      });
      
      action.addEventListener('mouseleave', function() {
        clearTimeout(commentReactionHoverTimeout);
        
        setTimeout(() => {
          const picker = document.getElementById('reactionsPicker');
          if (!picker.matches(':hover')) {
            picker.classList.remove('active');
            isCommentReactionPickerShowing = false;
          }
        }, 100);
      });
    }
  });
  
  // Reply input listeners
  const replyInput = div.querySelector('.reply-input');
  const replyCancelBtn = div.querySelector('.reply-cancel-btn');
  
  if (replyInput) {
    replyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendReply(comment.id, replyInput.value.trim(), level);
        replyInput.value = '';
        div.querySelector('.reply-input-wrapper').classList.remove('active');
      }
    });
  }
  
  if (replyCancelBtn) {
    replyCancelBtn.addEventListener('click', () => {
      div.querySelector('.reply-input-wrapper').classList.remove('active');
      replyInput.value = '';
    });
  }
  
  return div;
}

function sendComment() {
  const input = document.getElementById('commentInput');
  const text = input.value.trim();
  const imagePreview = document.getElementById('commentImagePreview');
  const imageInput = document.getElementById('commentImageInput');
  const imageElement = imagePreview.querySelector('img');
  
  if (!text && !imageElement) return;
  
  const newComment = {
    id: Date.now(),
    user: 'Bạn',
    avatar: 'messenger-clone/assets/images/avatar-default.png',
    text: text,
    time: 'Vừa xong',
    reactions: {},
    liked: false,
    replies: [],
    image: imageElement ? imageElement.src : null
  };
  
  // Save comment to the current post's comment list
  const comments = postComments.get(currentPostId) || [];
  comments.push(newComment);
  postComments.set(currentPostId, comments);
  
  // Display the comment
  const list = document.getElementById('commentsList');
  
  // Remove "no comments" message if exists
  const noCommentsMsg = list.querySelector('div[style*="padding: 40px"]');
  if (noCommentsMsg) {
    noCommentsMsg.remove();
  }
  
  const commentElement = createCommentElement(newComment);
  list.appendChild(commentElement);
  
  input.value = '';
  input.style.height = 'auto'; // Reset textarea height
  
  // Clear image preview
  if (imageElement) {
    removeCommentImage();
  }
  
  // Smooth scroll to new comment
  setTimeout(() => {
    commentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
  
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

function sendReply(parentCommentId, text, parentLevel = 0) {
  if (!text) return;
  
  const newReply = {
    id: Date.now(),
    user: 'Bạn',
    avatar: 'messenger-clone/assets/images/avatar-default.png',
    text: text,
    time: 'Vừa xong',
    reactions: {},
    liked: false,
    replies: []
  };
  
  // Find the reply container for this comment
  const replyContainer = document.querySelector(`[data-replies-for="${parentCommentId}"]`);
  
  if (replyContainer) {
    const replyElement = createCommentElement(newReply, parentLevel + 1);
    replyContainer.appendChild(replyElement);
    
    // Smooth scroll to new reply
    setTimeout(() => {
      replyElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

// createReplyElement is now replaced by createCommentElement which handles both comments and replies recursively

function handleCommentAction(commentId, action, comment) {
  switch(action) {
    case 'like':
      toggleCommentLike(commentId, event.target);
      break;
    case 'reply':
      showReplyInput(commentId);
      break;
  }
}

function toggleCommentLike(commentId, element) {
  const isLiked = element.classList.contains('liked');
  
  if (isLiked) {
    element.classList.remove('liked');
    element.textContent = 'Thích';
  } else {
    element.classList.add('liked');
    element.textContent = 'Đã thích';
  }
  
  // Update reaction badge
  const commentWrapper = element.closest('.comment-wrapper');
  const reactionBadge = commentWrapper.querySelector('.comment-reaction-count');
  
  if (reactionBadge) {
    const numberSpan = reactionBadge.querySelector('.comment-reaction-number');
    const currentCount = parseInt(numberSpan.textContent);
    const newCount = isLiked ? currentCount - 1 : currentCount + 1;
    
    if (newCount > 0) {
      numberSpan.textContent = newCount;
    } else {
      reactionBadge.remove();
    }
  } else if (!isLiked) {
    // Add new reaction badge
    const commentContent = commentWrapper.querySelector('.comment-content');
    const badge = document.createElement('div');
    badge.className = 'comment-reaction-count';
    badge.innerHTML = `
      <span class="comment-reaction-emoji">👍</span>
      <span class="comment-reaction-number">1</span>
    `;
    commentContent.appendChild(badge);
  }
}

function toggleReplyLike(replyId, element) {
  const isLiked = element.classList.contains('liked');
  
  if (isLiked) {
    element.classList.remove('liked');
    element.textContent = 'Thích';
  } else {
    element.classList.add('liked');
    element.textContent = 'Đã thích';
  }
  
  // Update reaction badge
  const replyItem = element.closest('.reply-item');
  const reactionBadge = replyItem.querySelector('.comment-reaction-count');
  
  if (reactionBadge) {
    const numberSpan = reactionBadge.querySelector('.comment-reaction-number');
    const currentCount = parseInt(numberSpan.textContent);
    const newCount = isLiked ? currentCount - 1 : currentCount + 1;
    
    if (newCount > 0) {
      numberSpan.textContent = newCount;
    } else {
      reactionBadge.remove();
    }
  } else if (!isLiked) {
    // Add new reaction badge
    const replyContent = replyItem.querySelector('.reply-content');
    const badge = document.createElement('div');
    badge.className = 'comment-reaction-count';
    badge.innerHTML = `
      <span class="comment-reaction-emoji">👍</span>
      <span class="comment-reaction-number">1</span>
    `;
    replyContent.appendChild(badge);
  }
}

function showReplyInput(commentId) {
  // Hide all other reply inputs first
  document.querySelectorAll('.reply-input-wrapper').forEach(wrapper => {
    wrapper.classList.remove('active');
  });
  
  // Show the reply input for this comment (search in comment-block)
  const commentBlock = document.querySelector(`.comment-block[data-comment-id="${commentId}"]`);
  if (commentBlock) {
    const replyInputWrapper = commentBlock.querySelector('.reply-input-wrapper');
    if (replyInputWrapper) {
      replyInputWrapper.classList.add('active');
      const input = replyInputWrapper.querySelector('.reply-input');
      if (input) {
        input.focus();
      }
    }
  }
}

// ==========================================
// COMMENT/REPLY REACTIONS SYSTEM
// ==========================================
function showCommentReactionsPicker(element) {
  const picker = document.getElementById('reactionsPicker');
  const rect = element.getBoundingClientRect();
  
  // Position picker above the element
  picker.style.left = rect.left + 'px';
  picker.style.top = rect.top + 'px';
  
  picker.classList.add('active');
  
  // Setup reaction button clicks for comments/replies
  const reactionButtons = picker.querySelectorAll('.reaction-btn');
  reactionButtons.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', function() {
      const reaction = this.dataset.reaction;
      if (currentCommentReactionElement) {
        selectCommentReaction(currentCommentReactionElement, reaction);
      }
      picker.classList.remove('active');
      isCommentReactionPickerShowing = false;
    });
  });
}

function handleCommentQuickClick(element, comment) {
  // Nếu đã có reaction -> Hủy
  if (comment.currentReaction) {
    removeCommentReaction(element, comment);
  } 
  // Chưa có reaction -> Thả Like
  else {
    setCommentReaction(element, 'like', comment);
  }
}

function handleReplyQuickClick(element, reply, parentId) {
  // Nếu đã có reaction -> Hủy
  if (reply.currentReaction) {
    removeReplyReaction(element, reply);
  }
  // Chưa có reaction -> Thả Like
  else {
    setReplyReaction(element, 'like', reply);
  }
}

function selectCommentReaction(element, reaction) {
  const commentWrapper = element.closest('.comment-wrapper');
  const comment = { currentReaction: element.dataset.currentReaction };
  
  setCommentReaction(element, reaction, comment);
}

function setCommentReaction(element, reaction, comment) {
  const emoji = reactionEmojis[reaction];
  const name = reactionNames[reaction];
  
  // Lưu reaction
  comment.currentReaction = reaction;
  element.dataset.currentReaction = reaction;
  
  // Cập nhật text và màu
  element.textContent = emoji + ' ' + name;
  element.classList.add('has-reaction');
  
  const colors = {
    like: 'var(--primary)',
    love: '#f33e58',
    haha: '#f7b125',
    wow: '#f7b125',
    sad: '#f7b125',
    angry: '#e9710f'
  };
  element.style.color = colors[reaction] || 'var(--primary)';
  
  // Cập nhật badge
  updateCommentReactionBadge(element, reaction, 1);
}

function removeCommentReaction(element, comment) {
  const currentReaction = comment.currentReaction || element.dataset.currentReaction;
  
  // Reset
  comment.currentReaction = null;
  delete element.dataset.currentReaction;
  element.textContent = 'Thích';
  element.classList.remove('has-reaction');
  element.style.color = '';
  
  // Cập nhật badge
  updateCommentReactionBadge(element, currentReaction, -1);
}

function setReplyReaction(element, reaction, reply) {
  const emoji = reactionEmojis[reaction];
  const name = reactionNames[reaction];
  
  // Lưu reaction
  reply.currentReaction = reaction;
  element.dataset.currentReaction = reaction;
  
  // Cập nhật text và màu
  element.textContent = emoji + ' ' + name;
  element.classList.add('has-reaction');
  
  const colors = {
    like: 'var(--primary)',
    love: '#f33e58',
    haha: '#f7b125',
    wow: '#f7b125',
    sad: '#f7b125',
    angry: '#e9710f'
  };
  element.style.color = colors[reaction] || 'var(--primary)';
  
  // Cập nhật badge
  updateReplyReactionBadge(element, reaction, 1);
}

function removeReplyReaction(element, reply) {
  const currentReaction = reply.currentReaction || element.dataset.currentReaction;
  
  // Reset
  reply.currentReaction = null;
  delete element.dataset.currentReaction;
  element.textContent = 'Thích';
  element.classList.remove('has-reaction');
  element.style.color = '';
  
  // Cập nhật badge
  updateReplyReactionBadge(element, currentReaction, -1);
}

function updateCommentReactionBadge(element, reaction, change) {
  const commentBlock = element.closest('.comment-block');
  const commentContent = commentBlock.querySelector('.comment-content');
  let reactionBadge = commentContent.querySelector('.comment-reaction-count');
  
  if (change > 0) {
    if (!reactionBadge) {
      // Tạo badge mới
      reactionBadge = document.createElement('div');
      reactionBadge.className = 'comment-reaction-count';
      reactionBadge.innerHTML = `
        <span class="comment-reaction-emoji">${reactionEmojis[reaction]}</span>
        <span class="comment-reaction-number">1</span>
      `;
      commentContent.appendChild(reactionBadge);
    } else {
      // Cập nhật badge có sẵn
      const numberSpan = reactionBadge.querySelector('.comment-reaction-number');
      const currentCount = parseInt(numberSpan.textContent);
      numberSpan.textContent = currentCount + 1;
      
      // Thêm emoji nếu chưa có
      const emojis = Array.from(reactionBadge.querySelectorAll('.comment-reaction-emoji'));
      const hasEmoji = emojis.some(e => e.textContent === reactionEmojis[reaction]);
      if (!hasEmoji && emojis.length < 3) {
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'comment-reaction-emoji';
        emojiSpan.textContent = reactionEmojis[reaction];
        numberSpan.before(emojiSpan);
      }
    }
  } else if (change < 0 && reactionBadge) {
    // Giảm count
    const numberSpan = reactionBadge.querySelector('.comment-reaction-number');
    const currentCount = parseInt(numberSpan.textContent);
    const newCount = currentCount - 1;
    
    if (newCount > 0) {
      numberSpan.textContent = newCount;
    } else {
      reactionBadge.remove();
    }
  }
}

function updateReplyReactionBadge(element, reaction, change) {
  updateCommentReactionBadge(element, reaction, change);
}

// ==========================================
// REPLY TO REPLY SYSTEM
// ==========================================
// showReplyToReplyInput is removed - now using showReplyInput for all levels

// ==========================================
// CREATE POST
// ==========================================
let selectedPostFiles = [];

function initCreatePostModal() {
  const createPostInput = document.querySelector('.create-post-input');
  const modal = document.getElementById('createPostModal');
  const closeBtn = document.getElementById('closeCreatePostModal');
  const overlay = modal.querySelector('.modal-overlay');
  const submitBtn = document.getElementById('submitPost');
  const textarea = document.getElementById('createPostTextarea');
  const fileInput = document.getElementById('createPostFileInput');
  
  createPostInput.addEventListener('click', () => openCreatePostModal());
  
  closeBtn.addEventListener('click', () => {
    closeModal(modal);
    resetCreatePostForm();
  });
  overlay.addEventListener('click', () => {
    closeModal(modal);
    resetCreatePostForm();
  });
  
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
  
  // Enable/disable submit button based on content
  textarea.addEventListener('input', function() {
    updateCreatePostButton();
  });
}

function updateCreatePostButton() {
  const textarea = document.getElementById('createPostTextarea');
  const submitBtn = document.getElementById('submitPost');
  const hasText = textarea.value.trim().length > 0;
  const hasImages = selectedPostFiles.length > 0;
  
  submitBtn.disabled = !hasText && !hasImages;
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
  
  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      selectedPostFiles.push(file);
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'create-post-preview-item';
        imgWrapper.dataset.fileIndex = selectedPostFiles.length - 1;
        
        imgWrapper.innerHTML = `
          <img src="${e.target.result}" class="create-post-preview-img">
          <button class="create-post-preview-remove" onclick="removePostImage(${selectedPostFiles.length - 1})">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        `;
        
        preview.appendChild(imgWrapper);
      };
      reader.readAsDataURL(file);
    }
  });
  
  updateCreatePostButton();
  
  // Reset file input
  document.getElementById('createPostFileInput').value = '';
}

function removePostImage(index) {
  selectedPostFiles.splice(index, 1);
  
  const preview = document.getElementById('createPostPreview');
  preview.innerHTML = '';
  
  selectedPostFiles.forEach((file, newIndex) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'create-post-preview-item';
      imgWrapper.dataset.fileIndex = newIndex;
      
      imgWrapper.innerHTML = `
        <img src="${e.target.result}" class="create-post-preview-img">
        <button class="create-post-preview-remove" onclick="removePostImage(${newIndex})">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      `;
      
      preview.appendChild(imgWrapper);
    };
    reader.readAsDataURL(file);
  });
  
  updateCreatePostButton();
}

function createPost() {
  const textarea = document.getElementById('createPostTextarea');
  const text = textarea.value.trim();
  
  if (!text && selectedPostFiles.length === 0) return;
  
  // Create post HTML
  const feed = document.querySelector('.center-feed');
  const postCard = document.createElement('article');
  postCard.className = 'post-card';
  
  // Generate image HTML if there are files
  if (selectedPostFiles.length > 0) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgSrc = e.target.result;
      const imageHtml = `
        <div class="post-image">
          <img src="${imgSrc}" alt="Post image">
        </div>
      `;
      
      postCard.innerHTML = generatePostHTML(text, imageHtml);
      insertNewPost(postCard);
    };
    reader.readAsDataURL(selectedPostFiles[0]);
  } else {
    // No images, just text
    postCard.innerHTML = generatePostHTML(text, '');
    insertNewPost(postCard);
  }
  
  // Close modal and reset
  closeModal(document.getElementById('createPostModal'));
  resetCreatePostForm();
}

function generatePostHTML(text, imageHtml) {
  return `
    <div class="post-header">
      <img src="messenger-clone/assets/images/avatar-default.png" alt="" class="post-avatar">
      <div class="post-author-info">
        <div class="post-author">Bạn</div>
        <div class="post-time">Vừa xong · 🌍</div>
      </div>
      <button class="post-more">
        <img src="messenger-clone/assets/icons/dots.svg" alt="">
      </button>
    </div>
    ${text ? `<div class="post-content"><p>${text}</p></div>` : ''}
    ${imageHtml}
    <div class="post-stats">
      <div class="post-reactions">
        <div class="reaction-icons"></div>
        <span class="reaction-count">0</span>
      </div>
      <div class="post-engagement">
        <span>0 bình luận</span>
        <span>0 lượt chia sẻ</span>
      </div>
    </div>
    <div class="post-actions">
      <button class="action-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
        </svg>
        <span>Thích</span>
      </button>
      <button class="action-btn">
        <img src="messenger-clone/assets/icons/send.svg" alt="">
        <span>Bình luận</span>
      </button>
      <button class="action-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
        <span>Chia sẻ</span>
      </button>
    </div>
  `;
}

function insertNewPost(postCard) {
  // Assign unique post ID
  const newPostId = `post-${Date.now()}`;
  postCard.dataset.postId = newPostId;
  
  // Initialize empty comments array for this post
  postComments.set(newPostId, []);
  
  const createPostCard = document.querySelector('.create-post-card');
  createPostCard.after(postCard);
  
  setTimeout(() => {
    postCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    postCard.style.animation = 'slideIn 0.5s ease';
  }, 100);
  
  // Re-initialize event listeners for new post
  initReactionsPicker();
  initCommentsModal();
  initSharePostModal();
}

function resetCreatePostForm() {
  document.getElementById('createPostTextarea').value = '';
  document.getElementById('createPostPreview').innerHTML = '';
  selectedPostFiles = [];
  updateCreatePostButton();
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
