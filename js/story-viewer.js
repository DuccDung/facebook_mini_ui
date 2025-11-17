// ============================================
// FACEBOOK STORY VIEWER - JAVASCRIPT
// ============================================

// ===== GLOBAL STATE =====
let currentStoryIndex = 0;
let currentUserIndex = -1;
let isPaused = false;
let isMuted = false;
let progressInterval = null;
let startTime = 0;
let pausedTime = 0;
let stories = [];
let allUserStories = [];
let hasStorySelected = false;

// ===== CONSTANTS =====
const STORY_DURATION = 5000; // 5 seconds per story
const reactionEmojis = {
  like: '👍',
  love: '❤️',
  haha: '😆',
  wow: '😮',
  sad: '😢',
  angry: '😠'
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  loadAllStories();
  renderStoryList();
  initEventListeners();
  
  // Load first user's story if specified in URL
  const urlParams = new URLSearchParams(window.location.search);
  const userIndex = parseInt(urlParams.get('user'));
  if (!isNaN(userIndex) && userIndex >= 0 && userIndex < allUserStories.length) {
    loadUserStories(userIndex);
  }
});

// ===== LOAD ALL STORIES =====
function loadAllStories() {
  // Default stories data (có thể lấy từ localStorage hoặc API)
  allUserStories = [
    {
      user: { name: 'Lê Ngọc', avatar: 'messenger-clone/assets/images/contact-1.png', time: '2 giờ' },
      stories: [
        { type: 'image', url: 'messenger-clone/assets/images/contact-1.png', duration: STORY_DURATION },
        { type: 'image', url: 'messenger-clone/assets/images/contact-2.png', duration: STORY_DURATION }
      ],
      seen: false
    },
    {
      user: { name: 'Trần Mai', avatar: 'messenger-clone/assets/images/contact-2.png', time: '5 giờ' },
      stories: [
        { type: 'image', url: 'messenger-clone/assets/images/contact-3.png', duration: STORY_DURATION },
        { type: 'text', text: 'Đi chơi cùng nhau nào! 🎉', background: 'gradient-bg-3', duration: STORY_DURATION }
      ],
      seen: false
    },
    {
      user: { name: 'Phạm Thảo', avatar: 'messenger-clone/assets/images/contact-3.png', time: '8 giờ' },
      stories: [
        { type: 'text', text: 'Hôm nay thật là một ngày tuyệt vời! 🌟', background: 'gradient-bg', duration: STORY_DURATION }
      ],
      seen: false
    },
    {
      user: { name: 'Ngô Hải', avatar: 'messenger-clone/assets/images/contact-4.png', time: '12 giờ' },
      stories: [
        { type: 'image', url: 'messenger-clone/assets/images/contact-4.png', duration: STORY_DURATION }
      ],
      seen: false
    },
    {
      user: { name: 'Đỗ Linh', avatar: 'messenger-clone/assets/images/contact-5.png', time: '1 ngày' },
      stories: [
        { type: 'text', text: 'Cuối tuần vui vẻ mọi người! 🎉🎊', background: 'gradient-bg-2', duration: STORY_DURATION }
      ],
      seen: true
    },
    {
      user: { name: 'Mai Anh', avatar: 'messenger-clone/assets/images/contact-1.png', time: '11 giờ' },
      stories: [
        { type: 'image', url: 'messenger-clone/assets/images/contact-2.png', duration: STORY_DURATION }
      ],
      seen: false
    },
    {
      user: { name: 'Hải Minh', avatar: 'messenger-clone/assets/images/contact-3.png', time: '16 giờ' },
      stories: [
        { type: 'image', url: 'messenger-clone/assets/images/contact-4.png', duration: STORY_DURATION }
      ],
      seen: false
    }
  ];
}

// ===== RENDER STORY LIST =====
function renderStoryList() {
  const storyList = document.getElementById('storyList');
  storyList.innerHTML = '';
  
  allUserStories.forEach((userStory, index) => {
    const storyItem = document.createElement('div');
    storyItem.className = 'story-item';
    storyItem.dataset.index = index;
    
    const avatarClass = userStory.seen ? 'story-user-avatar seen' : 'story-user-avatar';
    const storyCount = userStory.stories.length > 1 ? `${userStory.stories.length} tin` : '1 tin';
    
    storyItem.innerHTML = `
      <div class="story-avatar-wrapper">
        <img src="${userStory.user.avatar}" alt="${userStory.user.name}" class="${avatarClass}">
      </div>
      <div class="story-item-info">
        <div class="story-item-name">${userStory.user.name}</div>
        <div class="story-item-time">${userStory.user.time}</div>
      </div>
      <div class="story-count">${storyCount}</div>
    `;
    
    storyItem.addEventListener('click', () => loadUserStories(index));
    storyList.appendChild(storyItem);
  });
}

// ===== LOAD USER STORIES =====
function loadUserStories(userIndex) {
  if (userIndex < 0 || userIndex >= allUserStories.length) return;
  
  currentUserIndex = userIndex;
  const userData = allUserStories[userIndex];
  
  // Prepare stories for current user
  stories = userData.stories.map(story => ({
    ...story,
    author: userData.user.name,
    avatar: userData.user.avatar,
    time: userData.user.time
  }));
  
  // Mark as seen
  allUserStories[userIndex].seen = true;
  
  // Update active state in sidebar using data-index
  document.querySelectorAll('.story-item[data-index]').forEach((item) => {
    const itemIndex = parseInt(item.dataset.index);
    if (itemIndex === userIndex) {
      item.classList.add('active');
      item.querySelector('.story-user-avatar').classList.add('seen');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Show story container
  hasStorySelected = true;
  document.querySelector('.story-container').classList.add('has-story');
  
  // Update URL
  updateURL();
  
  // Load first story
  currentStoryIndex = 0;
  loadStory(0);
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
  // Back/Close button
  document.getElementById('backBtn').addEventListener('click', closeStory);
  
  // Pause button
  document.getElementById('pauseBtn').addEventListener('click', togglePause);
  
  // Mute button
  document.getElementById('muteBtn').addEventListener('click', toggleMute);
  
  // Navigation areas
  document.getElementById('prevArea').addEventListener('click', () => {
    if (hasStorySelected) prevStory();
  });
  document.getElementById('nextArea').addEventListener('click', () => {
    if (hasStorySelected) nextStory();
  });
  
  // Navigation arrows
  document.getElementById('prevArrow').addEventListener('click', () => {
    if (hasStorySelected) prevStory();
  });
  document.getElementById('nextArrow').addEventListener('click', () => {
    if (hasStorySelected) nextStory();
  });
  
  // Show/hide indicators
  document.getElementById('prevArea').addEventListener('mouseenter', () => {
    if (hasStorySelected) showIndicator('prev');
  });
  document.getElementById('prevArea').addEventListener('mouseleave', () => hideIndicator('prev'));
  document.getElementById('nextArea').addEventListener('mouseenter', () => {
    if (hasStorySelected) showIndicator('next');
  });
  document.getElementById('nextArea').addEventListener('mouseleave', () => hideIndicator('next'));
  
  // Reactions
  document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (!hasStorySelected) return;
      const reaction = this.dataset.reaction;
      reactToStory(reaction);
    });
  });
  
  // Reply
  document.getElementById('sendBtn').addEventListener('click', () => {
    if (hasStorySelected) sendReply();
  });
  document.getElementById('replyInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && hasStorySelected) {
      sendReply();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboard);
  
  // Long press to pause
  const storyContent = document.getElementById('storyContent');
  let pressTimer;
  
  storyContent.addEventListener('mousedown', () => {
    if (!hasStorySelected) return;
    pressTimer = setTimeout(() => {
      if (!isPaused) togglePause();
    }, 200);
  });
  
  storyContent.addEventListener('mouseup', () => {
    clearTimeout(pressTimer);
  });
  
  storyContent.addEventListener('touchstart', (e) => {
    if (!hasStorySelected) return;
    pressTimer = setTimeout(() => {
      if (!isPaused) togglePause();
    }, 200);
  });
  
  storyContent.addEventListener('touchend', () => {
    clearTimeout(pressTimer);
  });
}

// ===== LOAD STORY =====
function loadStory(index) {
  if (index < 0 || index >= stories.length) return;
  
  currentStoryIndex = index;
  const story = stories[index];
  const storyContent = document.getElementById('storyContent');
  
  // Update header
  document.getElementById('storyName').textContent = story.author;
  document.getElementById('storyTime').textContent = story.time;
  document.getElementById('storyAvatar').src = story.avatar;
  
  // Update seen count (random for demo)
  document.getElementById('seenCount').textContent = Math.floor(Math.random() * 200) + 50;
  
  // Clear content
  storyContent.innerHTML = '';
  storyContent.className = 'story-content';
  
  // Load story content
  if (story.type === 'image') {
    const img = document.createElement('img');
    img.src = story.url;
    img.alt = 'Story';
    img.className = 'story-media';
    img.onerror = () => {
      img.src = 'messenger-clone/assets/images/contact-1.png'; // Fallback image
    };
    storyContent.appendChild(img);
  } else if (story.type === 'text') {
    storyContent.classList.add(story.background);
    const textDiv = document.createElement('div');
    textDiv.className = 'story-text-content';
    textDiv.innerHTML = `<div class="story-text">${story.text}</div>`;
    storyContent.appendChild(textDiv);
  }
  
  // Update progress bars
  updateProgressBars(index);
  
  // Start progress
  pausedTime = 0;
  startProgress(story.duration || STORY_DURATION);
}

// ===== PROGRESS BARS =====
function updateProgressBars(currentIndex) {
  const container = document.getElementById('progressContainer');
  container.innerHTML = '';
  
  // Create progress bars for all stories
  for (let i = 0; i < stories.length; i++) {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressFill.id = `progress-${i}`;
    
    if (i < currentIndex) {
      progressFill.classList.add('completed');
      progressFill.style.width = '100%';
    } else if (i === currentIndex) {
      progressFill.classList.add('active');
    }
    
    progressBar.appendChild(progressFill);
    container.appendChild(progressBar);
  }
}

function startProgress(duration) {
  clearInterval(progressInterval);
  startTime = Date.now() - pausedTime;
  const progressFill = document.getElementById(`progress-${currentStoryIndex}`);
  
  if (!progressFill) return;
  
  // Remove CSS animation if any
  progressFill.style.animation = 'none';
  progressFill.style.transition = 'none';
  
  progressInterval = setInterval(() => {
    if (isPaused) {
      // Khi pause, lưu lại thời gian đã trôi qua
      pausedTime = Date.now() - startTime;
      return;
    }
    
    const elapsed = Date.now() - startTime;
    const progress = (elapsed / duration) * 100;
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      progressFill.style.width = '100%';
      nextStory();
    } else {
      progressFill.style.width = progress + '%';
    }
  }, 50);
}

// ===== NAVIGATION =====
function nextStory() {
  if (currentStoryIndex < stories.length - 1) {
    loadStory(currentStoryIndex + 1);
  } else {
    // Chuyển sang user tiếp theo nếu có
    nextUser();
  }
}

function prevStory() {
  if (currentStoryIndex > 0) {
    loadStory(currentStoryIndex - 1);
  } else {
    // Quay về user trước nếu có
    prevUser();
  }
}

function nextUser() {
  // Find next user with stories
  let nextIndex = currentUserIndex + 1;
  while (nextIndex < allUserStories.length) {
    if (allUserStories[nextIndex].stories.length > 0) {
      loadUserStories(nextIndex);
      return;
    }
    nextIndex++;
  }
  // No more users, pause at last story
  if (isPaused) return;
  togglePause();
}

function prevUser() {
  // Find previous user with stories
  let prevIndex = currentUserIndex - 1;
  while (prevIndex >= 0) {
    if (allUserStories[prevIndex].stories.length > 0) {
      loadUserStories(prevIndex);
      // Load last story of previous user
      currentStoryIndex = allUserStories[prevIndex].stories.length - 1;
      loadStory(currentStoryIndex);
      return;
    }
    prevIndex--;
  }
}

// ===== CONTROLS =====
function togglePause() {
  isPaused = !isPaused;
  const pauseBtn = document.getElementById('pauseBtn');
  const pauseIndicator = document.getElementById('pauseIndicator');
  
  if (isPaused) {
    pauseBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
    pauseIndicator.classList.add('show');
    pausedTime = Date.now() - startTime;
  } else {
    pauseBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
    pauseIndicator.classList.remove('show');
    startTime = Date.now() - pausedTime;
  }
}

function toggleMute() {
  isMuted = !isMuted;
  const muteBtn = document.getElementById('muteBtn');
  
  if (isMuted) {
    muteBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
  } else {
    muteBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>';
  }
}

function showIndicator(type) {
  const indicator = document.getElementById(`${type}Indicator`);
  indicator.classList.add('show');
}

function hideIndicator(type) {
  const indicator = document.getElementById(`${type}Indicator`);
  indicator.classList.remove('show');
}

// ===== REACTIONS =====
function reactToStory(reactionType) {
  const emoji = reactionEmojis[reactionType];
  
  // Create floating reaction animation
  const reaction = document.createElement('div');
  reaction.textContent = emoji;
  reaction.className = 'reaction-float';
  document.body.appendChild(reaction);
  
  setTimeout(() => reaction.remove(), 1000);
  
  // TODO: Send reaction to backend
  console.log('Reacted with:', reactionType);
}

// ===== REPLY =====
function sendReply() {
  const replyInput = document.getElementById('replyInput');
  const message = replyInput.value.trim();
  
  if (message) {
    console.log('Sending message:', message);
    // TODO: Send message to backend
    
    // Show feedback
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.textContent = 'Đã gửi';
    sendBtn.disabled = true;
    
    setTimeout(() => {
      sendBtn.textContent = 'Gửi';
      sendBtn.disabled = false;
      replyInput.value = '';
    }, 1500);
  }
}

// ===== KEYBOARD NAVIGATION =====
function handleKeyboard(e) {
  if (!hasStorySelected) {
    if (e.key === 'Escape') {
      closeStory();
    }
    return;
  }
  
  if (e.key === 'ArrowLeft') {
    prevStory();
  } else if (e.key === 'ArrowRight') {
    nextStory();
  } else if (e.key === ' ') {
    e.preventDefault();
    togglePause();
  } else if (e.key === 'Escape') {
    closeStory();
  } else if (e.key === 'm' || e.key === 'M') {
    toggleMute();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    prevUser();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    nextUser();
  }
}

// ===== CLOSE STORY =====
function closeStory() {
  clearInterval(progressInterval);
  
  // Go back to home page or previous page
  if (document.referrer && document.referrer.includes('home.html')) {
    window.location.href = 'home.html';
  } else {
    window.history.back();
  }
}

// ===== UTILITY FUNCTIONS =====
function updateURL() {
  if (currentUserIndex >= 0) {
    const newUrl = `${window.location.pathname}?user=${currentUserIndex}`;
    window.history.replaceState({}, '', newUrl);
  }
}

// ===== CLEANUP =====
window.addEventListener('beforeunload', () => {
  clearInterval(progressInterval);
});
