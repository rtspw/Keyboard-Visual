'use strict';

function registerEventListeners(category) {
  category.categoryTitle.addEventListener('click', () => {
    category.toggleMenu();
  });
}

class ScaleListCategory {
  constructor(categoryNode) {
    this.categoryTitle = categoryNode.querySelector('.scale-list__category-title');
    this.dropdownList = categoryNode.querySelector('.scale-list__category-list');
    this.dropdownArrow = categoryNode.querySelector('.dropdown-arrow');
    registerEventListeners(this);
  }

  toggleMenu() {
    this.categoryTitle.classList.toggle('scale-list__category-title--active');
    this.dropdownList.classList.toggle('scale-list__category-list--hidden');
    this.dropdownArrow.classList.toggle('dropdown-arrow--active');
  }

  expandMenu() {
    this.categoryTitle.classList.add('scale-list__category-title--active');
    this.dropdownList.classList.remove('scale-list__category-list--hidden');
    this.dropdownArrow.classList.add('dropdown-arrow--active');
  }

  collapseMenu() {
    this.categoryTitle.classList.remove('scale-list__category-title--active');
    this.dropdownList.classList.add('scale-list__category-list--hidden');
    this.dropdownArrow.classList.remove('dropdown-arrow--active');
  }
}

module.exports = ScaleListCategory;
