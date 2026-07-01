(function () {
    var carousels = document.querySelectorAll('.recommendation-carousel');

    Array.prototype.forEach.call(carousels, function (carousel) {
        var items = Array.prototype.slice.call(carousel.querySelectorAll('[data-carousel-item]'));
        var dotsContainer = carousel.querySelector('.recommendation-dots');
        var prevButton = carousel.querySelector('.recommendation-control-prev');
        var nextButton = carousel.querySelector('.recommendation-control-next');
        var activeIndex = 0;

        if (!items.length) {
            return;
        }

        function normalizeIndex(index) {
            return (index + items.length) % items.length;
        }

        function updateCarousel() {
            var prevIndex = normalizeIndex(activeIndex - 1);
            var nextIndex = normalizeIndex(activeIndex + 1);

            items.forEach(function (item, index) {
                item.classList.remove('is-active', 'is-prev', 'is-next');
                item.setAttribute('aria-hidden', 'true');

                if (index === activeIndex) {
                    item.classList.add('is-active');
                    item.setAttribute('aria-hidden', 'false');
                } else if (index === prevIndex) {
                    item.classList.add('is-prev');
                } else if (index === nextIndex) {
                    item.classList.add('is-next');
                }
            });

            if (dotsContainer) {
                var dots = dotsContainer.querySelectorAll('.recommendation-dot');

                Array.prototype.forEach.call(dots, function (dot, index) {
                    dot.classList.toggle('is-active', index === activeIndex);
                });
            }
        }

        if (dotsContainer) {
            items.forEach(function (_, index) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'recommendation-dot';
                dot.setAttribute('aria-label', 'Show reference ' + (index + 1));
                dot.addEventListener('click', function () {
                    activeIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', function () {
                activeIndex = normalizeIndex(activeIndex - 1);
                updateCarousel();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', function () {
                activeIndex = normalizeIndex(activeIndex + 1);
                updateCarousel();
            });
        }

        items.forEach(function (item, index) {
            item.addEventListener('click', function () {
                if (index !== activeIndex) {
                    activeIndex = index;
                    updateCarousel();
                }
            });
        });

        updateCarousel();
    });
}());
