document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Track currently visible gallery items (for next/prev navigation when filtered)
  let visibleItems = Array.from(galleryItems);
  let currentIndex = 0;

  // ==========================================
  // 1. CATEGORY FILTERING LOGIC
  // ==========================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter gallery items
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === itemCategory) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });

      // Update array of visible items so lightbox navigation stays accurate
      visibleItems = Array.from(galleryItems).filter(
        item => !item.classList.contains('hide')
      );
    });
  });

  // ==========================================
  // 2. LIGHTBOX OPEN & UPDATE LOGIC
  // ==========================================
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      currentIndex = visibleItems.indexOf(item);
      if (currentIndex !== -1) {
        updateLightboxContent();
        openLightbox();
      }
    });
  });

  function updateLightboxContent() {
    const currentItem = visibleItems[currentIndex];
    const imgElement = currentItem.querySelector('img');
    const titleText = currentItem.querySelector('.overlay h3').innerText;
    const categoryText = currentItem.querySelector('.overlay p').innerText;

    // Set lightbox image source & caption
    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    lightboxCaption.innerHTML = `<h3>${titleText}</h3><p>${categoryText}</p>`;
  }

  function openLightbox() {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  // ==========================================
  // 3. LIGHTBOX NAVIGATION (PREV / NEXT)
  // ==========================================
  function showNextImage() {
    if (visibleItems.length === 0) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxContent();
  }

  function showPrevImage() {
    if (visibleItems.length === 0) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxContent();
  }

  // Click Event Listeners
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
  });

  closeBtn.addEventListener('click', closeLightbox);

  // Close lightbox when clicking outside the content image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // ==========================================
  // 4. KEYBOARD NAVIGATION
  // ==========================================
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });
});