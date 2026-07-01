(function () {
    var carousels = document.querySelectorAll('.recommendation-carousel');
    var resizeCallbacks = [];

    function closestRecommendationItem(element) {
        while (element && !element.classList.contains('recommendation-item')) {
            element = element.parentNode;
        }

        return element;
    }

    var languageControls = document.querySelectorAll('.recommendation-language');

    function updateRecommendationStageHeight(item) {
        var stage = item ? item.parentNode : null;

        if (!stage || !stage.classList.contains('recommendation-stage')) {
            return;
        }

        window.requestAnimationFrame(function () {
            var itemStyles = window.getComputedStyle(item);
            var top = parseFloat(itemStyles.top) || 0;
            var stageStyles = window.getComputedStyle(stage);
            var minHeight = parseFloat(stageStyles.minHeight) || 0;
            var neededHeight = top + item.offsetHeight + 32;

            stage.style.height = Math.max(minHeight, neededHeight) + 'px';
        });
    }

    Array.prototype.forEach.call(languageControls, function (control) {
        var item = closestRecommendationItem(control);
        var buttons = control.querySelectorAll('[data-reference-language]');
        var quotes = item ? item.querySelectorAll('[data-reference-quote]') : [];

        Array.prototype.forEach.call(buttons, function (button) {
            button.addEventListener('click', function (event) {
                var selectedLanguage = button.getAttribute('data-reference-language');

                event.preventDefault();
                event.stopPropagation();

                Array.prototype.forEach.call(buttons, function (controlButton) {
                    var isActive = controlButton === button;

                    controlButton.classList.toggle('is-active', isActive);
                    controlButton.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                });

                Array.prototype.forEach.call(quotes, function (quote) {
                    quote.hidden = quote.getAttribute('data-reference-quote') !== selectedLanguage;
                });

                if (item.classList.contains('is-active')) {
                    updateRecommendationStageHeight(item);
                }
            });
        });
    });

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
            var activeItem = items[activeIndex];

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

            updateRecommendationStageHeight(activeItem);
        }

        resizeCallbacks.push(function () {
            updateRecommendationStageHeight(items[activeIndex]);
        });

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

    window.addEventListener('resize', function () {
        resizeCallbacks.forEach(function (callback) {
            callback();
        });
    });
}());
