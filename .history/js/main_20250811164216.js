/**
 * メインJavaScriptファイル
 * ポートフォリオサイトの主要機能を実装
 */

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
  // 機能の初期化
  initMobileMenu();
  initActiveNavigation();
  initScrollAnimations();
  initSkillProgressBars();
  initHeaderScroll();
});

/**
 * モバイルメニューの初期化
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.header__menu-toggle');
  const nav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.header__nav-link');
  
  if (!menuToggle || !nav) return;
  
  // メニューボタンクリック時の処理
  menuToggle.addEventListener('click', function() {
    const isActive = nav.classList.contains('active');
    
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  // ナビゲーションリンククリック時にメニューを閉じる
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // メニューを開く
  function openMenu() {
    nav.classList.add('active');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-label', 'メニューを閉じる');
    document.body.style.overflow = 'hidden'; // スクロール無効
  }
  
  // メニューを閉じる
  function closeMenu() {
    nav.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = ''; // スクロール有効
  }
  
  // ESCキーでメニューを閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
    }
  });
}

/**
 * アクティブナビゲーションの初期化
 */
function initActiveNavigation() {
  const navLinks = document.querySelectorAll('.header__nav-link');
  const sections = document.querySelectorAll('main section');
  
  if (!navLinks.length || !sections.length) return;
  
  // Intersection Observerの設定
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -80% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        updateActiveNavLink(sectionId);
      }
    });
  }, observerOptions);
  
  // 各セクションを監視
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // アクティブなナビゲーションリンクを更新
  function updateActiveNavLink(activeId) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }
}

/**
 * スクロールアニメーションの初期化
 */
function initScrollAnimations() {
  const animationElements = document.querySelectorAll('.skill-card, .work-card, .contact__item');
  
  if (!animationElements.length) return;
  
  // アニメーション用のクラスを追加
  animationElements.forEach((element, index) => {
    element.classList.add('fade-in');
    // 要素によって異なるアニメーションを適用
    if (index % 2 === 0) {
      element.classList.add('slide-in-left');
    } else {
      element.classList.add('slide-in-right');
    }
  });
  
  // Intersection Observerでアニメーションを制御
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // アニメーション開始のための遅延を追加
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.random() * 200); // ランダムな遅延でよりナチュラルに
        
        // 一度アニメーションが完了したら監視を停止
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animationElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * スキルプログレスバーの初期化
 */
function initSkillProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar__fill');
  
  if (!progressBars.length) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -20% 0px',
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const skillLevel = progressBar.getAttribute('data-skill');
        
        // プログレスバーのアニメーション
        setTimeout(() => {
          progressBar.style.width = skillLevel + '%';
        }, 300);
        
        // 一度アニメーションが完了したら監視を停止
        observer.unobserve(progressBar);
      }
    });
  }, observerOptions);
  
  progressBars.forEach(bar => {
    observer.observe(bar);
  });
}

/**
 * ヘッダーのスクロール効果
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function updateHeader() {
    const currentScrollY = window.scrollY;
    
    // スクロール位置に応じてヘッダーのスタイルを調整
    if (currentScrollY > 100) {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
}

/**
 * フォームバリデーション（将来的な拡張用）
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * ローディング状態の管理
 */
function showLoading() {
  // ローディング表示の実装（必要に応じて）
}

function hideLoading() {
  // ローディング非表示の実装（必要に応じて）
}

/**
 * エラーハンドリング
 */
function handleError(error) {
  console.error('エラーが発生しました:', error);
  // エラー処理の実装（必要に応じて）
}

/**
 * デバイス判定
 */
function isMobileDevice() {
  return window.innerWidth <= 767;
}

function isTabletDevice() {
  return window.innerWidth >= 768 && window.innerWidth <= 1023;
}

function isDesktopDevice() {
  return window.innerWidth >= 1024;
}

/**
 * パフォーマンス最適化：デバウンス関数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * パフォーマンス最適化：スロットル関数
 */
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

// ウィンドウリサイズ時の処理（デバウンス適用）
window.addEventListener('resize', debounce(function() {
  // リサイズ時の処理（必要に応じて実装）
  console.log('ウィンドウサイズが変更されました');
}, 300));

// エラー発生時のグローバルハンドラ
window.addEventListener('error', function(e) {
  handleError(e.error);
});

// 未処理のPromise拒否のハンドラ
window.addEventListener('unhandledrejection', function(e) {
  handleError(e.reason);
});

// コンソールに初期化完了メッセージを表示
console.log('🎨 ポートフォリオサイトが正常に初期化されました');
console.log('📱 レスポンシブデザイン対応');
console.log('♿ アクセシビリティ対応');
console.log('⚡ パフォーマンス最適化済み');
