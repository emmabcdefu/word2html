const simpleElem: any = (content: any, e: number, numbers: any) => {
  const tag = content[e].element;
  if (tag === 'p') {
    return `<p>${content[e].content}</p>`;
  }
  if (tag === 'list') {
    let txt = ``;
    if (e === 0 || content[e - 1].element !== 'list') {
      txt += `<ul>`;
    }
    txt += `<li>${content[e].content}</li>`;
    if (e === content.length - 1 || content[e + 1].element !== 'list') {
      txt += `</ul>`;
    }
    return txt;
  }
  if (tag === 'img') {
    return `<img class="center-image image-clickable" src="${content[e].content}">`;
  }
  if (tag === 'iframe') {
    return `<iframe class="center-image" width="800" height="600" src="${content[e].content}" frameborder="0" allowfullscreen="true"></iframe>`;
  }
  if (tag === 'fig-caption') {
    return `<p class="fig-caption">${content[e].content}</p>`;
  }
  if (tag === 'footnote') {
    return `${content[e].content}</br>`;
  }
  if (tag === 'h1') {
    return `<h1>${content[e].content}</h1>`;
  }
  if (tag === 'h2') {
    if (content[e].number) return `<h2 id="${numbers.h2}" class="number"><span class="chapter">${numbers.h2}. </span>${content[e].content}</h2>`
    return `<h2>${content[e].content}</h2>`;
  }
  if (tag === 'h3') {
    return `<h3 id="${numbers.h2}.${numbers.h3}"><span class="chapter">${numbers.h2}.${numbers.h3}</span>${content[e].content}</h3>`;
  }
  if (tag === 'h4') {
    return `<h4 id="${numbers.h2}.${numbers.h3}.${numbers.h4}"><span class="chapter">${numbers.h2}.${numbers.h3}.${numbers.h4}</span>${content[e].content}</h4>`;
  }
  console.error(`The element ${tag} is not yet handle !`);
  return '';
};

const generate = (content: Array<any>) => {
  let html = '';

  const numbers = {
    h2: 0,
    h3: 0,
    h4: 0,
    footnote: 0,
  };

  for (let e = 0; e < content.length; e++) {
    const tag = content[e].element;

    if (tag === 'h2' && content[e].number) {
      if (numbers.h2 === 0) {
        html += '<section>';
      } else {
        html += '</section><section>';
      }
      numbers.h2++;
      numbers.h3 = 0;
      numbers.h4 = 0;
    } else if (tag === 'h3') {
      numbers.h3++;
      numbers.h4 = 0;
    } else if (tag === 'h4') {
      numbers.h4++;
    } else if (tag === 'footnote') {
      if (numbers.footnote === 0) {
        html += '<p class="footnote">';
      }
      numbers.footnote++;
    }

    if (tag === 'row-images' || tag === 'div') {
      if (tag === 'row-images') {
        html += '<div class="row-images">';
      } else {
        html += '<div class="two-column">';
      }

      for (let ee = 0; ee < content[e].content.length; ee++) {
        html += '<div>';
        for (let eee = 0; eee < content[e].content[ee].length; eee++) {
          html += simpleElem(content[e].content[ee], eee, numbers)
        }
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += simpleElem(content, e, numbers);
    }
  }

  if (numbers.footnote !== 0) html += `</p>`;

  html += '</section>';
  return html;
}

const write = (content: Array<any>) => {
  return my_style + generate(content);
}

const final_write = (content: Array<any>, style: string) => {

  const head = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="utf-8" />
    <link href='http://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
    <title>ENTSOG</title>
  </head>`;

  const allStyle = `
  <style>
  ${style}
  ${progressbar_style}
  ${image_style}
  </style>`;

  const body = `
  <body>
    <div class='container'>
      <div class='report'>
        ${generate(content)}
      </div>
    </div>

    <div id="image-viewer">
        <span class="close">&times;</span>
        <img class="modal-content" id="full-image">
    </div>`

  const script = `
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script>
    ${progressbar_script}
    </script>
    <script>
    ${image_script}
    </script>
  </body>
  </html>`;

  return head + allStyle + body + script;
}

export { write, final_write }

const my_style = `
<style>.container {
  font-family: Lato;
}

.container .report {
  position: relative;
  background-color: #D6E1E5;
}

.container h1, .container h2, .container h3, .container h4, .container a, .container strong {
  color: #1f4484;
  font-weight: 700;
}

.container h1, .container h2, .container h3 {
  text-transform: uppercase;
  letter-spacing: 1px;
}

.container h1 {
  font-size: 48px;
  line-height: 60px;
}

.container h2 {
  font-size: 24px;
  line-height: 30px;
  padding-top: 0.25em;
  border-top: 4px solid #80C342;
}

.container h2 span.chapter {
  position: absolute;
  left: -1.25em;
}

.container h3 {
  font-size: 18px;
  line-height: 24px;
}

.container h3 span.chapter {
  position: absolute;
  left: -2em;
}

.container h4 {
  font-size: 16px;
  line-height: 20px;
}

.container h4 span.chapter {
  position: absolute;
  left: -2.5em;
}

.container h6 {
  font-size: 24px;
  line-height: 30px;
}

.container p, .container li {
  text-align: justify;
  font-size: 15px;
  line-height: 24px;
}

.container .footnote {
  border-top: 1px solid #666666;
  font-size: 12.75px;
  line-height: 24px;
}

.container.footnote sup::before {
  display: block;
  content: " ";
  margin-top: -150px;
  height: 150px;
  visibility: hidden;
  pointer-events: none;
}

.container li {
  list-style-image: url(./lp-green.png);
}

.container img {
  max-width: 100%;
}

.container .center-image {
  margin: auto;
  display: block;
}

.container .fig-caption {
  padding-top: 0.5em;
  border-top: 1px solid #81d742;
  color: #1f4484;
  text-align: center;
}

.container .fig-caption-above {
  padding-bottom: 0.5em;
  border-bottom: 1px solid #81d742;
  color: #1f4484;
  text-align: center;
}

.container .two-column {
  display: flex;
}

.container .two-column div {
  width: calc(50% - 20px);
}

.container .two-column div:first-of-type {
  padding-right: 40px;
}

.container .row-images {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>`;

const progressbar_style = `
/*
 * Reading Progress Bar
 * Adapted from https://codepen.io/blucube/pen/bdGgzg
 */

.clearfix:before,
.clearfix:after {
    content: " ";
    display: table;
}

.clearfix:after {
    clear: both;
}

@media only screen and (max-width: 689px) {
    .progressbar {
        display: none;
        margin: 4em 0;
    }
}

.progressbar .shim {
    display: none;
}

.progressbar.fixed .shim {
    display: block;
}

.progressbar .holder {
    position: relative;
    background-color: #D6E1E5;
    box-shadow: 0 .5em 1.5em #D6E1E5;
}

.progressbar.fixed .holder {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
}

.progressbar .bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #B6D1DA;
}

.progressbar .indicator {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #1f4484;
}

.progressbar .labels {
    display: flex;
    flex-direction: row;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2em;
}

.progressbar .labels-element {
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.progressbar h4 {
    color: #4598B5;
    transition:
        color 150ms ease-in,
        top 100ms ease-out;
}

.progressbar .reading h4 {
    color: #1f4484;
}

.progressbar span {
    position: absolute;
    bottom: 0;
    left: 50%;
    display: block;
    content: '';
    width: .9em;
    height: .9em;
    border-radius: 50%;
    border: solid 3px #B6D1DA;
    background-color: #D6E1E5;
    transform: translateX(-50%) translateY(50%);
    transition:
        border-color 100ms ease-in,
        background-color 150ms ease-in;
}

.progressbar .read span {
    border-color: #1f4484;
}`;

const image_style = `
/*
 * Image viewer
 * source code : https://codepen.io/abmin/pen/jZKrze
 */

.image-clickable {
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.image-clickable:hover {opacity: 0.7;}

#image-viewer {
  display: flex;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.9);
}
.modal-content {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
  background-color: white;
}
.modal-content { 
  animation-name: zoom;
  animation-duration: 0.6s;
}
@keyframes zoom {
  from {transform:scale(0)} 
  to {transform:scale(1)}
}
#image-viewer .close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}
#image-viewer .close:hover,
#image-viewer .close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

@media only screen and (max-width: 700px){
  .modal-content {
      width: 100%;
  }
}`;

const progressbar_script = `
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

});`;

const image_script = `
/*
 * Image viewer
 * source code : https://codepen.io/abmin/pen/jZKrze
 */

$('#image-viewer').hide();

$(".image-clickable").click(function () {
    $("#full-image").attr("src", $(this).attr("src"));
    $('#image-viewer').show();
});

$("#image-viewer .close").click(function () {
    $('#image-viewer').hide();
});`;
