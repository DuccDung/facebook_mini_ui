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
document.querySelectorAll('.top-right .icon-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const title = this.getAttribute('title');
    if (title === 'Messenger') {
      window.location.href = 'messenger-clone/index.html';
    } else {
      alert(`Chức năng "${title}" đang được phát triển`);
    }
  });
});

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
