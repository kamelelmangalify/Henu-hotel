const gallery = {
  currentIndex: 0,
  images: [],
  
  init() {
    // Collect all gallery items
    const items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;
    
    this.images = Array.from(items).map(item => ({
      src: item.querySelector('img').src,
      alt: item.querySelector('img').alt || ''
    }));
    
    // Create lightbox HTML if not exists
    if (!document.getElementById('lightbox')) {
      const lightboxHTML = `
        <div class="lightbox" id="lightbox">
          <button class="lightbox-close" id="lightboxClose">&times;</button>
          <button class="lightbox-nav lightbox-prev" id="lightboxPrev">&#10094;</button>
          <button class="lightbox-nav lightbox-next" id="lightboxNext">&#10095;</button>
          <img src="" alt="" id="lightboxImg">
          <div class="lightbox-counter" id="lightboxCounter"></div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', lightboxHTML);
      
      // Inject some basic styling for the lightbox if not present in main CSS
      const style = document.createElement('style');
      style.textContent = `
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .lightbox.active {
          opacity: 1;
          visibility: visible;
        }
        .lightbox img {
          max-width: 90%;
          max-height: 80vh;
          object-fit: contain;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 30px;
          font-size: 40px;
          color: white;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1001;
        }
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 40px;
          color: white;
          background: none;
          border: none;
          cursor: pointer;
          padding: 20px;
          z-index: 1001;
        }
        .lightbox-prev { left: 20px; }
        .lightbox-next { right: 20px; }
        .lightbox-counter {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-family: var(--font-body, 'Montserrat', sans-serif);
        }
      `;
      document.head.appendChild(style);
    }
    
    // Event listeners
    items.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(index);
      });
    });
    
    document.getElementById('lightboxClose').addEventListener('click', () => this.close());
    document.getElementById('lightboxPrev').addEventListener('click', () => this.prev());
    document.getElementById('lightboxNext').addEventListener('click', () => this.next());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('lightbox').classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
    
    // Click outside to close
    document.getElementById('lightbox').addEventListener('click', (e) => {
      if (e.target.id === 'lightbox') this.close();
    });
  },
  
  open(index) {
    this.currentIndex = index;
    this.updateImage();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
  },
  
  close() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  },
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  },
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  },
  
  updateImage() {
    const img = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    img.src = this.images[this.currentIndex].src;
    img.alt = this.images[this.currentIndex].alt;
    counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
  }
};

document.addEventListener('DOMContentLoaded', () => gallery.init());
