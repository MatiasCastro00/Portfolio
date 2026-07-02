$(function() {

    $('.navbar-toggle').click(function() {
        $(this).toggleClass('act');
            if($(this).hasClass('act')) {
                $('.main-menu').addClass('act');
            }
            else {
                $('.main-menu').removeClass('act');
            }
    });

    //jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.site-header',
        offset: 10
    });

	/* Progress bar */
    var $section = $('.section-skills');
    function loadDaBars() {
	    $('.progress .progress-bar').progressbar({
	        transition_delay: 500
	    });
    }
    
    $(document).bind('scroll', function(ev) {
        var scrollOffset = $(document).scrollTop();
        var containerOffset = $section.offset().top - window.innerHeight;
        if (scrollOffset > containerOffset) {
            loadDaBars();
            // unbind event not to load scrolsl again
            $(document).unbind('scroll');
        }
    });

    /* Counters  */
    if ($(".section-counters .start").length>0) {
        $(".section-counters .start").each(function() {
            var stat_item = $(this),
            offset = stat_item.offset().top;
            $(window).scroll(function() {
                if($(window).scrollTop() > (offset - 1000) && !(stat_item.hasClass('counting'))) {
                    stat_item.addClass('counting');
                    stat_item.countTo();
                }
            });
        });
    };

	// another custom callback for counting to infinity
	$('#infinity').data('countToOptions', {
		onComplete: function (value) {
		  count.call(this, {
		    from: value,
		    to: value + 1
		  });
		}
	});

	$('#infinity').each(count);

    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }

    // Recommendation skills
    var recommendationSkills = {
        'NostalgicBrains': ['Unity', 'Mobile', 'Firebase Analytics', 'Tenjin', 'Backend API', 'Optimization'],
        'Freelance Game Developer': ['Unity', 'Gameplay', 'UI', 'Systems', 'Client Work'],
        'Pilgrims Games Studio': ['Unity', 'Mobile Porting', 'WebGL', 'Google Play', 'Nintendo Switch', 'Optimization'],
        'Compromiso Digital': ['Unreal Engine 4', 'Blueprints', 'Gameplay'],
        'Tharax': ['Unity', 'WebGL', 'Multiplayer', 'Gameplay'],
        'Other / Not listed': []
    };

    var $recommendationForm = $('#recommendation-form');
    var $companySelect = $recommendationForm.find('.recommendation-company-select');
    var $skillOptions = $recommendationForm.find('.recommendation-skill-options');
    var $skillPlaceholder = $recommendationForm.find('.recommendation-skills-placeholder');

    function renderRecommendationSkills(company) {
        var skills = recommendationSkills[company] || [];

        $skillOptions.empty();

        if (!company) {
            $skillPlaceholder.text('Choose a company to validate related skills.').show();
            return;
        }

        if (!skills.length) {
            $skillPlaceholder.text('Add the skills you can validate in the field below.').show();
            return;
        }

        $skillPlaceholder.hide();

        skills.forEach(function(skill) {
            var skillId = 'skill-' + skill.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            var $label = $('<label/>', {
                'class': 'recommendation-skill-option',
                'for': skillId
            });
            var $input = $('<input/>', {
                type: 'checkbox',
                id: skillId,
                name: 'validated_skills',
                value: skill
            });

            $label.append($input).append($('<span/>', {
                text: skill
            }));
            $skillOptions.append($label);
        });
    }

    $companySelect.on('change', function() {
        renderRecommendationSkills($(this).val());
    });

    renderRecommendationSkills($companySelect.val());

    function buildFormSubmitData(form, normalizeSeparators) {
        var sourceData = new FormData(form);
        var submitData = new FormData();
        var normalizedSeparators = false;

        sourceData.forEach(function(value, key) {
            if (normalizeSeparators && typeof value === 'string') {
                var normalizedValue = value.replace(/\s*\|\s*/g, ' / ');

                if (normalizedValue !== value) {
                    normalizedSeparators = true;
                }

                submitData.append(key, normalizedValue);
                return;
            }

            submitData.append(key, value);
        });

        if (normalizedSeparators) {
            submitData.append('delivery_note', 'Vertical bar separators were converted to slashes for reliable email delivery.');
        }

        return submitData;
    }

    // FormSubmit forms
    $('.js-formsubmit-form').each(function() {
        var $form = $(this);
        var $status = $form.find('.contact-status');

        $form.on('submit', function(event) {
            event.preventDefault();

            var form = this;
            var $submit = $form.find('button[type="submit"]');
            var successUrl = $form.data('success-url') || 'thanks.html';
            var formData = buildFormSubmitData(form, $form.is('#recommendation-form'));

            $status.removeClass('is-error').text('Sending...');
            $submit.prop('disabled', true);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(function(response) {
                if (!response.ok) {
                    throw new Error('Form submission failed');
                }

                window.location.href = successUrl;
            }).catch(function() {
                $status.addClass('is-error').text('Something went wrong. Please email me directly at matiasnicolascastro00@gmail.com.');
                $submit.prop('disabled', false);
            });
        });
    });

    // Navigation overlay
    var s = skrollr.init({
            forceHeight: false,
            smoothScrolling: false,
            mobileDeceleration: 0.004,
            mobileCheck: function() {
                //hack - forces mobile version to be off
                return false;
            }
    });
    
});
