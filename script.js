console.log('====================================');
console.log("Connected");
console.log('====================================');
console.log('====================================');
console.log("Bundle Builder Connected");
console.log('====================================');

// Bundle Builder Class
class BundleBuilder {
  constructor() {
    this.selectedProducts = new Map();
    this.discountThreshold = 3;
    this.discountRate = 0.3;

    this.init();
  }

  init() {
    const buttons = document.querySelectorAll(".add-to-bundle-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => this.toggleProduct(e));
    });

    const addBundleBtn = document.querySelector(".add-bundle-btn");
    if (addBundleBtn) {
      addBundleBtn.addEventListener("click", () => this.addBundleToCart());
    }

    this.updateUI();
    window.addEventListener("scroll", () => this.animateSidebar());
  }

  toggleProduct(e) {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);

    if (this.selectedProducts.has(id)) {
      this.selectedProducts.delete(id);
      e.target.textContent = "Add to Bundle";
    } else {
      this.selectedProducts.set(id, { name, price });
      e.target.textContent = "Remove";
    }

    this.updateUI();
  }

  updateUI() {
    const count = this.selectedProducts.size;
    const progressFill = document.querySelector(".progress-fill");
    const progressText = document.querySelector(".progress-text");
    const addBundleBtn = document.querySelector(".add-bundle-btn");
    const discountInfo = document.querySelector(".discount-info");
    const discountRow = document.querySelector(".discount-row");

    if (progressFill) progressFill.style.width = `${(count / this.discountThreshold) * 100}%`;
    if (progressText) progressText.textContent = `${count}/${this.discountThreshold} items selected`;
    if (addBundleBtn) addBundleBtn.disabled = count === 0;

    this.updateSelectedProductsList();

    const subtotal = [...this.selectedProducts.values()].reduce((sum, item) => sum + item.price, 0);
    const discount = count >= this.discountThreshold ? subtotal * this.discountRate : 0;
    const total = subtotal - discount;

    if (discountInfo) discountInfo.style.display = discount > 0 ? "block" : "none";
    if (discountRow) discountRow.style.display = discount > 0 ? "flex" : "none";

    const subtotalEl = document.querySelector(".subtotal");
    const discountEl = document.querySelector(".discount-amount");
    const totalEl = document.querySelector(".total");

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }

  updateSelectedProductsList() {
    const container = document.querySelector(".selected-products");
    if (!container) return;

    container.innerHTML = "";

    if (this.selectedProducts.size === 0) {
      container.innerHTML = '<div class="empty-state"><p>Select 3 items to unlock 30% discount</p></div>';
      return;
    }

    this.selectedProducts.forEach((item, id) => {
      const productEl = document.createElement("div");
      productEl.className = "selected-item";
      productEl.innerHTML = `
        <span>${item.name}</span>
        <span>$${item.price.toFixed(2)}</span>
      `;
      container.appendChild(productEl);
    });
  }

  addBundleToCart() {
    if (this.selectedProducts.size === 0) return;

    const bundle = [...this.selectedProducts.values()];
    console.log("Bundle added to cart:", bundle);
    alert("Your bundle has been added to the cart!");

    this.resetBundle();
  }

  resetBundle() {
    this.selectedProducts.clear();

    const buttons = document.querySelectorAll(".add-to-bundle-btn");
    buttons.forEach((button) => {
      button.textContent = "Add to Bundle";
    });

    this.updateUI();
  }

  animateSidebar() {
    const sidebar = document.querySelector(".bundle-sidebar");
    if (!sidebar) return;

    if (window.innerWidth <= 1024) {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      sidebar.style.transform = `translateY(${rate}px)`;
    } else {
      sidebar.style.transform = "translateY(0)";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new BundleBuilder());
