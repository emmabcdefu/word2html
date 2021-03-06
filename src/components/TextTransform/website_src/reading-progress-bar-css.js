const styleProgressBar = `
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

export default styleProgressBar;
