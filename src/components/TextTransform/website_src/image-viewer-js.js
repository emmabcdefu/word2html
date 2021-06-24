const scriptImage = `
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

export default scriptImage;
