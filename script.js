'use strict';

///////////////////////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const sections = document.querySelectorAll('.section');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const navLinks = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const arrowRight = document.querySelector('.slider__btn--right');
const arrowLeft = document.querySelector('.slider__btn--left');

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//craeting a new element for cookies message
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
header.append(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.remove());
message.style.backgroundColor = '#333';
message.style.width = '100vw';
message.style.height =
  parseInt(getComputedStyle(message).height, 10) + 20 + 'px';

//smooth scroll function
btnScrollTo.addEventListener('click', e => {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//event delegation for tab components
tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  //removing any existing active class
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  //adds active class to clicked tab
  clicked.classList.add('operations__tab--active');

  //activating content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//nav links hover effect
const hoverHandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const currentFocus = e.target;
    const navItems = document.querySelectorAll('.nav__link');
    navItems.forEach(link => {
      if (link !== currentFocus) link.style.opacity = this;
    });
  }
};

navLinks.addEventListener('mouseover', hoverHandler.bind(0.5));
navLinks.addEventListener('mouseout', hoverHandler.bind(1));

//implementing sticky nav
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
});
headerObserver.observe(header);

//revealing elements  when scrolled into view
const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

sections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//lazy loading images
const images = document.querySelectorAll('img[data-src]');

const imageSwap = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //replace image and remove blur
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(imageSwap, {
  root: null,
  rootMargin: '100px',
  threshold: 0,
});

images.forEach(img => imageObserver.observe(img));

//constructing the slider funtions
const sliderFunction = function () {
  const maxSlide = slides.length;
  let currentSlide = 0;

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  //dots navigator
  const dots = document.querySelector('.dots');
  const dotNavigator = function () {
    slides.forEach((_, i) =>
      dots.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    );
  };
  const dotsNav = function (e) {
    const dot = e.target;
    const { slide } = e.target.dataset;
    if (dot.classList.contains('dots__dot')) goToSlide(slide);
    activeDot(slide);
  };
  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(el => el.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"`)
      .classList.add('dots__dot--active');
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) return;
    currentSlide++;
    goToSlide(currentSlide);
    activeDot(currentSlide);
  };
  const previousSlide = function () {
    if (currentSlide === 0) return;
    currentSlide--;
    goToSlide(currentSlide);
    activeDot(currentSlide);
  };
  //navagating slide using keyboard keys
  const arrowNav = function (e) {
    //shortcircuiting
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && previousSlide();
  };

  arrowLeft.addEventListener('click', previousSlide);
  arrowRight.addEventListener('click', nextSlide);
  document.addEventListener('keydown', arrowNav);
  dots.addEventListener('click', dotsNav);

  const init = function () {
    goToSlide(0);
    dotNavigator();
    activeDot(0);
  };
  init();
};
sliderFunction();
