import generate from './Generate';
import styleImage from './website_src/image-viewer-css';
import scriptImage from './website_src/image-viewer-js';
import styleProgressBar from './website_src/reading-progress-bar-css';
import scriptProgressBar from './website_src/reading-progress-bar-js';

const output = (content: Array<any>, style: string) => {
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
  ${styleProgressBar}
  ${styleImage}
  </style>`;

  const body = `
  <body>
    <div class='container'>
      <div class='report'>
        ${generate(content, true)}
      </div>
    </div>

    <div id="image-viewer">
        <span class="close">&times;</span>
        <img class="modal-content" id="full-image">
    </div>`;

  const script = `
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script>
    ${scriptProgressBar}
    </script>
    <script>
    ${scriptImage}
    </script>
  </body>
  </html>`;

  return head + allStyle + body + script;
};

export default output;
