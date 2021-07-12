import generate from './Generate';

const myStyle = `
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
  text-align: center;
  font-size: 48px;
  line-height: 60px;
}

.container h2 {
  font-size: 22px;
  line-height: 28px;
  padding-top: 0.25em;
  border-top: 4px solid #80C342;
}

.container h2.number {
  font-size: 24px;
  line-height: 30px;
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

.container p.small, .container li.small {
  font-size: 13px;
  line-height: 20px;
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
  list-style: none;
}

.container li::before {
  content: "";
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="100 0, 100 100, 0 100" fill="%2379b51e"/></svg>');
  background-repeat: no-repeat;
  background-position: left center;
  padding-right: 14px;
  margin-right: 14px;
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

const render = (content: Array<any>, path: string) => {
  return myStyle + generate(content, path, false, false);
};

export default render;
