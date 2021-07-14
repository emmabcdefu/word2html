// Functions
import generate from './Generate';
import styleImage from './website_src/image-viewer-css';
import scriptImage from './website_src/image-viewer-js';
import styleProgressBar from './website_src/reading-progress-bar-css';
import scriptProgressBar from './website_src/reading-progress-bar-js';
// Types
import Info from '../../Interface/Info';

const output = (info: Info) => {
  const head = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="utf-8" />
    <link href='http://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
    <title>ENTSOG</title>
  </head>`;

  let allStyle = `<style> ${info.style}`;

  if (info.navbar) allStyle += styleProgressBar;
  if (info.imagesClickable) allStyle += styleImage;

  allStyle += '</style>';

  let body = `
  <body>
    <div class='container'>
      <div class='report'>
        ${generate(info.content, info.path, true, info.imagesClickable)}
      </div>
    </div>`;

  if (info.imagesClickable)
    body += `
    <div id="image-viewer">
        <span class="close">&times;</span>
        <img class="modal-content" id="full-image">
    </div>`;

  let script =
    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>';

  if (info.navbar) script += `<script> ${scriptProgressBar} </script>`;
  if (info.imagesClickable) script += `<script> ${scriptImage} </script>`;

  script += '</body></html>';

  return head + allStyle + body + script;
};

export default output;
