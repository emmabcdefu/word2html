
class Information {
    htm: string;
    json: any;

    constructor(htm: string) {
        this.htm = htm;
        this.json = {};
    };

    analyse() {

        // Collect the title
        const title_start = this.htm.indexOf("<title>");
        const tittle_end = this.htm.indexOf("</title>");
        this.json.title = this.htm.substr(title_start+7, tittle_end-title_start-7);

        // Collect only the body part
        const body_start = this.htm.indexOf("<body");
        const body_end = this.htm.indexOf("</body>");
        const body = this.htm.substr(body_start, body_end-body_start+7);

        // Detect sections
        let indexSection = [];
        let index = body.indexOf("<p class=E1Level", 0);
        while (index != -1) {
            indexSection.push(index);
            index = body.indexOf("<p class=E1Level", indexSection[indexSection.length-1] + 1);
        };
        this.json.sections = [];

        // Detect title of sections and element inside them
        for (let i in indexSection) {
            // Detect title
            let span = body.indexOf("><span", indexSection[i]);
            let index1 = body.indexOf(">", span + 1);
            let index2 = body.indexOf("<", index1);
            
            // Element inside detection
            let elem1 = body.indexOf("</p>", index2 ) + 5;
            let elem2 = 0;
            if (parseInt(i) != indexSection.length - 1) {
                elem2 = indexSection[parseInt(i)+1];
            } else {
                // In case of the last section
                let start_looking = elem1;
                let start_finding = elem1;
                let div = true;
                while (div) {
                    elem2 = body.indexOf("</div>", start_finding);
                    let end_looking = elem2

                    let str = body.substr(start_looking, end_looking-start_looking);
                    // In case if there is multiple div in the section, we need to choose the right one
                    if (str.indexOf("<div") != -1) {
                        start_looking = start_looking + str.indexOf("<div") + 1;
                        start_finding = elem2 + 1;
                    } else {
                        div = false;
                    }
                }
            }

            // Select the content
            let section = body.substr(elem1, elem2-elem1);

            // Clean content
            section = section.trim()
            while (section.indexOf("<span") != -1) {
                let cut1 = section.indexOf("<span")
                let cut2 =section.indexOf(">", cut1);
                section = section.substr(0, cut1) + section.substr(cut2 + 1, section.length);
            }
            while (section.indexOf("</span>") != -1) {
                section = section.replace("</span>", "");
            }
            while (section.indexOf("&nbsp;") != -1) {
                section = section.replace("&nbsp;", "");
            }
            while (section.indexOf("�") != -1) {
                section = section.replace("�", "");
            }
            while (section.indexOf("&gt;") != -1) {
                section = section.replace("&gt;", "");
            }
            while (section.indexOf("</i><i>") != -1) {
                section = section.replace("</i><i>", "");
            }
            while (section.indexOf("<sup><sup>") != -1) {
                section = section.replace("<sup><sup>", "<sup>");
            }
            while (section.indexOf("</sup></sup>") != -1) {
                section = section.replace("</sup></sup>", "</sup>");
            }
            while (section.indexOf("<b></b>") != -1) {
                section = section.replace("<b></b>", "");
            }
            while (section.indexOf("<b>") != -1) {
                section = section.replace("<b>", "<strong>");
            }
            while (section.indexOf("</b>") != -1) {
                section = section.replace("</b>", "</strong>");
            }

            // Detect what is inside the content

            // function to analyse what class is a p html tag
            const detect_class_p = (elem: string) => {
                if (elem.indexOf("class=") == -1) {
                    console.error(`The element ${elem} has no class !`);
                    return null;
                } else {
                    let c_start = elem.indexOf("class=") + 6;
                    if (elem.indexOf(" ", c_start) == -1) {
                        let c_end = elem.indexOf(">", c_start);
                        return elem.substr(c_start, c_end - c_start);
                    } else {
                        let c_end = Math.min(elem.indexOf(" ", c_start), elem.indexOf(">", c_start));
                        return elem.substr(c_start, c_end - c_start);
                    }
                    
                }
            }

            // function to analyse what is inside a p html tag
            const detect_inside_p = (className: string, elem: string) => {
                if (className == "MsoNormal") { // p or img
                    if (elem.substr(0, 4) == "<img") {
                        let srcStart = elem.indexOf("src=") + 5;
                        let srcEnd = elem.indexOf('"', srcStart);
                        return {
                            element: "img",
                            src: elem.substr(srcStart, srcEnd-srcStart)
                        };
                    } else {
                        return {
                            element: "p",
                            content: elem
                        };
                    }
                } else if (className == "MsoCaption" || className == "MsoCommentText") { // figure caption
                    return {
                        element: "fig-caption",
                        content: elem
                    };
                } else if (className == "MsoListParagraph") { // list
                    return {
                        element: "list",
                        content: elem
                    }
                } else if (className == "EHead2") { // title
                    if (elem.substr(0, 4) == "<img") {
                        let srcStart = elem.indexOf("src=") + 5;
                        let srcEnd = elem.indexOf('"', srcStart);
                        return {
                            element: "img",
                            src: elem.substr(srcStart, srcEnd-srcStart)
                        };
                    } else {
                        return {
                            element: "h2",
                            content: elem
                        };
                    }
                } else {
                    console.error(`The element ${className} isn't recognize`);
                    return { element: null }
                };
            }

            let content: any;
            content = [];
            let end = 0;
            while (section.indexOf("<", end) != -1) {
                let j = section.indexOf("<", end);
                let start = section.indexOf(">", j + 1);

                if (section[j + 1] == "p") { // p, img, list, title, figure caption
                    end = section.indexOf("</p>", start + 1);

                    let elem = section.substr(start+1, end-start-1).trim();
                    if (elem != "") {
                        let className = detect_class_p(section.substr(j, start-j+1));
                        if (className != null) {
                            let result = detect_inside_p(className, elem);
                            if (result.element !== null) {
                                content.push(result);
                            }
                        };
                    };
                    

                } else if (section.substr(end+1, 5) == "table") {
                    end = section.indexOf("</table>", start + 1);
                    const table = section.substr(start+1, end-start-1);
                    
                    let tr_end = 0;
                    while (table.indexOf("<tr", tr_end) != -1) {
                        let tr_start = table.indexOf(">", table.indexOf("<tr", tr_end)) + 1;
                        tr_end = table.indexOf("</tr>", tr_start);
                        let tr_inside = table.substr(tr_start, tr_end-tr_start).trim();

                        let nb_td = table.split('</td>').length;
                        if (nb_td == 1) {
                            let td_start = tr_inside.indexOf(">", table.indexOf("<td")) + 1;
                            let td_end = tr_inside.indexOf("</td>", td_start);
                            let td_inside = tr_inside.substr(td_start, td_end-td_start).trim();
    
                            let p_end = 0;
                            while (td_inside.indexOf("<p", p_end) != -1) {
                                let k = td_inside.indexOf("<p", p_end);
                                let p_start = td_inside.indexOf(">", k) + 1;
                                p_end = tr_inside.indexOf("</p>", p_start) + 4;
                                let p_inside = tr_inside.substr(p_start, p_end-p_start).trim();

                                // No table inside a table
                                if (p_inside != "") {
                                    let className = detect_class_p(td_inside.substr(k, p_start-k+1));
                                    if (className != null) {
                                        let result = detect_inside_p(className, p_inside)
                                        if (result.element !== null) {
                                            content.push(result);
                                        }
                                    };
                                };
                            };
                        } else if (nb_td == 2) {
                            let td_start1 = tr_inside.indexOf(">", table.indexOf("<td")) + 1;
                            let td_end1 = tr_inside.indexOf("</td>", td_start1);
                            let td_inside1 = tr_inside.substr(td_start1, td_end1-td_start1).trim();

                            let content1: any;
                            content1 = [];
                            let p_end = 0;
                            while (td_inside1.indexOf("<p", p_end) != -1) {
                                let k = td_inside1.indexOf("<p", p_end);
                                let p_start = td_inside1.indexOf(">", k) + 1;
                                p_end = tr_inside.indexOf("</p>", p_start) + 4;
                                let p_inside = tr_inside.substr(p_start, p_end-p_start).trim();

                                // No table inside a table
                                if (p_inside != "") {
                                    let className = detect_class_p(td_inside1.substr(k, p_start-k+1));
                                    if (className != null) {
                                        let result = detect_inside_p(className, p_inside)
                                        if (result.element !== null) {
                                            content1.push(result);
                                        }
                                    };
                                };
                            };

                            let td_start2 = tr_inside.indexOf(">", table.indexOf("<td")) + 1;
                            let td_end2 = tr_inside.indexOf("</td>", td_start2);
                            let td_inside2 = tr_inside.substr(td_start2, td_end2-td_start2).trim();

                            let content2: any;
                            content2 = [];
                            p_end = 0;
                            while (td_inside2.indexOf("<p", p_end) != -1) {
                                let k = td_inside2.indexOf("<p", p_end);
                                let p_start = td_inside2.indexOf(">", k) + 1;
                                p_end = tr_inside.indexOf("</p>", p_start) + 4;
                                let p_inside = tr_inside.substr(p_start, p_end-p_start).trim();

                                // No table inside a table
                                if (p_inside != "") {
                                    let className = detect_class_p(td_inside2.substr(k, p_start-k+1));
                                    if (className != null) {
                                        let result = detect_inside_p(className, p_inside)
                                        if (result.element !== null) {
                                            content2.push(result);
                                        }
                                    };
                                };
                            };

                            content.push({
                                element: "div",
                                content1: content1,
                                content2: content2
                            });
                        }
                    }
                } else {
                    end += 1;
                }
            }

            
            this.json.sections.push({
                title: body.substr(index1+1, index2-index1-1),
                content: content
            });
        }

        console.log(this.json); 
    }
};

export default Information;