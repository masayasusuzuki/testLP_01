/**
 * スムーズスクロール機能
 * アンカーリンクのクリック時にスムーズにスクロールする
 */

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
  initSmoothScroll();
});

/**
 * スムーズスクロールの初期化
 */
function initSmoothScroll() {
  // すべてのアンカーリンクを取得
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        scrollToElement(targetElement);
      }
    });
  });
}

/**
 * 指定された要素にスムーズスクロール
 * @param {Element} element - スクロール先の要素
 */
function scrollToElement(element) {
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;
  const elementTop = element.offsetTop - headerHeight - 20; // 20pxの余白を追加
  
  // スムーズスクロールの実行
  window.scrollTo({
    top: elementTop,
    behavior: 'smooth'
  });
  
  // フォーカス管理（アクセシビリティ対応）
  setTimeout(() => {
    element.focus();
  }, 300);
}

/**
 * カスタムスムーズスクロール関数
 * より細かい制御が必要な場合に使用
 * @param {number} targetY - スクロール先のY座標
 * @param {number} duration - アニメーション時間（ミリ秒）
 */
function customSmoothScroll(targetY, duration = 800) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();
  
  function scrollStep(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // イージング関数（ease-out）
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    window.scrollTo(0, startY + distance * easeOut);
    
    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }
  
  requestAnimationFrame(scrollStep);
}

/**
 * セクションへのスクロール（ID指定）
 * @param {string} sectionId - セクションのID
 */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    scrollToElement(section);
  }
}

/**
 * ページトップへのスクロール
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/**
 * 指定位置が表示されているかチェック
 * @param {Element} element - チェック対象の要素
 * @returns {boolean} 表示されているかどうか
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  );
}

/**
 * ページ内の現在位置を取得
 * @returns {string} 現在のセクションID
 */
function getCurrentSection() {
  const sections = document.querySelectorAll('main section');
  const scrollPosition = window.scrollY + window.innerHeight / 2;
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.id;
    }
  });
  
  return currentSection;
}

/**
 * スクロール位置の保存と復元
 */
const ScrollPosition = {
  // スクロール位置を保存
  save: function(key = 'scrollPosition') {
    const position = {
      x: window.scrollX,
      y: window.scrollY
    };
    sessionStorage.setItem(key, JSON.stringify(position));
  },
  
  // スクロール位置を復元
  restore: function(key = 'scrollPosition') {
    const saved = sessionStorage.getItem(key);
    if (saved) {
      const position = JSON.parse(saved);
      window.scrollTo(position.x, position.y);
      sessionStorage.removeItem(key);
    }
  }
};

// ページ離脱時にスクロール位置を保存
window.addEventListener('beforeunload', function() {
  ScrollPosition.save();
});

// ページ読み込み時にスクロール位置を復元（必要に応じて）
// window.addEventListener('load', function() {
//   ScrollPosition.restore();
// });

/**
 * スクロールイベントのパフォーマンス最適化
 */
let scrollTimeout;
let isScrolling = false;

function handleScroll() {
  if (!isScrolling) {
    isScrolling = true;
    requestAnimationFrame(function() {
      // スクロール中の処理をここに記述
      
      isScrolling = false;
    });
  }
  
  // スクロール終了時の処理
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(function() {
    // スクロール終了時の処理をここに記述
    console.log('スクロール終了');
  }, 150);
}

// スクロールイベントリスナー（スロットル適用）
window.addEventListener('scroll', throttle(handleScroll, 16)); // 60FPS

/**
 * キーボードナビゲーション対応
 */
document.addEventListener('keydown', function(e) {
  // Page Up/Page Downキーでのスクロール
  if (e.key === 'PageUp') {
    e.preventDefault();
    window.scrollBy({
      top: -window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  } else if (e.key === 'PageDown') {
    e.preventDefault();
    window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  }
  // Homeキーでページトップへ
  else if (e.key === 'Home' && e.ctrlKey) {
    e.preventDefault();
    scrollToTop();
  }
  // Endキーでページ下部へ
  else if (e.key === 'End' && e.ctrlKey) {
    e.preventDefault();
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }
});

// スロットル関数（main.jsと重複している場合は削除）
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

console.log('📜 スムーズスクロール機能が初期化されました');
