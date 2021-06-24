/*
 * Reading Progress Bar
 * Adapted from https://codepen.io/blucube/pen/bdGgzg
 */

jQuery.extend(jQuery.easing, {
    easeInOutCubic: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    }
});

$(document).ready(function () {

    // set up and create progress bar in DOM
    $('h2.number').eq(0).before('<div class="progressbar"></div>');
    var container = $('.progressbar');
    container.append('<div class="shim"></div>');
    var shim = $('.progressbar .shim');
    container.append('<div class="holder clearfix"></div>');
    var holder = $('.progressbar .holder');
    holder.append('<div class="bar"></div>');
    var bar = $('.progressbar .bar');
    bar.append('<div class="indicator"></div>');
    var indicator = $('.progressbar .indicator');
    holder.append('<div class="labels"></div>');
    var labels = $('.progressbar .labels');
    $('h2.number').each(function () {
        var code = '<div class="labels-element"><h4>' + $(this).text() + '</h4><span></span></div>';
        labels.append(code);
    });
    var divs = labels.find('div');
    divs.css('width', 100 / $('h2.number').length + '%');

    // match height of shim
    // stop layout jumping when progress bar fixes to / unfixes
    // from top of viewport
    function setShimHeight() {
        shim.css('height', container.height() + 'px');
    }
    setShimHeight();
    $(window).resize(function () {
        setShimHeight();
    });

    // position indicator bar so it starts at first dot
    function setIndicatorX() {
        var xpos = divs.eq(0).offset().left + divs.eq(0).width() /2;
        indicator.css('left', xpos + 'px');
    }
    setIndicatorX();
    $(window).resize(function () {
        setIndicatorX();
    });

    // fix/unfix progress bar to top of viewport
    function fixPosition() {
        if (container.is(':visible')) {
            if (!container.hasClass('fixed')) {
                if (holder.offset().top <= $(window).scrollTop()) {
                    container.addClass('fixed');
                }
            } else {
                if (shim.offset().top > $(window).scrollTop()) {
                    container.removeClass('fixed');
                }
            }
        }
    }
    fixPosition();
    $(window).scroll(function () {
        fixPosition()
    });
    $(window).resize(function () {
        fixPosition();
    });

    // set trigger point
    // i.e. how far down viewport is the "eye line"
    var triggerPoint = 0;

    function setTriggerPoint() {
        triggerPoint = $(window).height() * .18;
    }
    setTriggerPoint();
    $(window).resize(function () {
        setTriggerPoint();
    });

    // update progress bar
    function setPosition() {
        if (container.is(':visible')) {
            var section = false;
            var sectionIndex = 0;
            var currentPosition = $(window).scrollTop() + triggerPoint;
            // dots
            // if before first section
            if (currentPosition < $('h2.number').eq(0).offset().top) {
                divs.removeClass('reading read');
                section = -1;
            }
            // if after first section
            else {
                $('h2.number').each(function () {
                    var sectionTop = $(this).offset().top;
                    if (currentPosition >= sectionTop) {
                        divs.removeClass('reading');
                        divs.eq(sectionIndex).addClass('reading');
                        divs.eq(sectionIndex).addClass('read');
                        section = sectionIndex;
                    } else {
                        divs.eq(sectionIndex).removeClass('read');
                    }
                    sectionIndex++;
                });
            }
            // bar
            var barWidth = 0;
            // if before start
            if (section == -1) {
                var point = divs.eq(0);
                barWidth = point.offset().left + (point.width() / 2);
            }
            // if after end
            else if (section >= (divs.length - 1)) {
                var point = divs.eq((divs.length - 1));
                barWidth = point.offset().left + (point.width() / 2);
            }
            // if within document
            else {
                var startPoint = divs.eq(section);
                var startPointX = startPoint.offset().left;
                var startPointWidth = startPoint.width();
                var startSection = $('h2.number').eq(section);
                var endSection = $('h2.number').eq(section + 1);
                var startSectionY = startSection.offset().top;
                var endSectionY = endSection.offset().top;
                var sectionLength = endSectionY - startSectionY;
                var scrollY = currentPosition - startSectionY;
                var sectionProgress = scrollY / sectionLength;
                barWidth = startPointX + (startPointWidth / 2) + (startPointWidth * sectionProgress);
            }
            barWidth -= indicator.offset().left;
            indicator.css('width', barWidth + 'px');
        }
    }
    setPosition();
    $(window).scroll(function () {
        setPosition();
        setIndicatorX();
    });
    $(window).resize(function () {
        setPosition();
    });

    // on click, scroll to target section
    divs.click(function () {
        var sectionIndex = divs.index($(this));
        var targetY = $('h2.number').eq(sectionIndex).offset().top - (triggerPoint * .92);
        $('html, body').animate({
            scrollTop: targetY
        }, 0, 'easeInOutCubic');
    });

});
