
class Information {
    htm: string;
    json: { [key: string]: string | Array<{ [key: string]: string | Array<{ [key: string]: string | Array<string> }> }> };

    constructor(htm: string) {
        this.htm = htm;
        this.json = {};
    };

    clean() {

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

            // function to analyse what is inside a p html tag
            const detect_inside_p = (j: number, start: number, content: Array<{ [key: string]: string | Array<string> }>) => {
                let elem = section.substr(start+1, end-start-1).trim();
                if (elem != "") {
                    let className = section.substr(j + 9, Math.min(section.indexOf(" ", j + 9)-j-9, section.indexOf(">", j + 9)-j-9));
                    if (className == "MsoNormal") { // p or img
                        if (elem.substr(0, 4) == "<img") {
                            let srcStart = elem.indexOf("src=") + 5;
                            let srcEnd = elem.indexOf('"', srcStart);
                            content.push({
                                element: "img",
                                src: elem.substr(srcStart, srcEnd-srcStart)
                            });
                        } else {
                            content.push({
                                element: "p",
                                content: elem
                            });
                        }
                    } else if (className == "MsoCaption" || className == "MsoCommentText") { // figure caption
                        content.push({
                            element: "fig-caption",
                            content: elem
                        });
                    } else if (className == "MsoListParagraph") { // list
                        if (content.length == 0 || content[content.length - 1].element != "list") {
                            content.push({
                                element: "list",
                                content: [elem]
                            });
                        } else {
                            // This is not an error "content[content.length - 1].content!" will always be a list
                            // @ts-ignore
                            content[content.length - 1].content!.push(elem);
                        }
                    } else if (className == "EHead2") { // title
                        if (elem.substr(0, 4) == "<img") {
                            let srcStart = elem.indexOf("src=") + 5;
                            let srcEnd = elem.indexOf('"', srcStart);
                            content.push({
                                element: "img",
                                src: elem.substr(srcStart, srcEnd-srcStart)
                            });
                        } else {
                            content.push({
                                element: "h2",
                                content: elem
                            });
                        }
                    } else {
                        console.error(`The element ${className} isn't recognize`);
                    };
                }
            }

            let content = [];
            let end = 0;
            while (section.indexOf("<", end) != -1) {
                let j = section.indexOf("<", end);
                let start = section.indexOf(">", j + 1);

                if (section[j + 1] == "p") { // p, img, list, title, figure caption

                    end = section.indexOf("</p>", start + 1);
                    detect_inside_p(j, start, content);

                } else if (section.substr(end+1, 5) == "table") {
                    end = section.indexOf("</table>", start + 1);
                    const table = section.substr(start+1, end-start-1);
                    
                    let tr_end = 0;
                    while (section.indexOf("<tr", tr_end) != -1) {
                        let tr_start = table.indexOf(">", table.indexOf("<tr", start + 1) + 1) + 1;
                        let tr_end = table.indexOf("</tr>");
                        let tr_inside = table.substr(tr_start, tr_end).trim();

                        let nb_td = table.split('</td>').length;
                        if (nb_td == 1) {
                            const td_start = tr_inside.indexOf(">", table.indexOf("<td", start + 1) + 1) + 1;
                            const td_end = tr_inside.indexOf("</td>");
                            const td_inside = tr_inside.substr(td_start, td_end).trim();
    
                            let p_end = 0;
                            while (td_inside.indexOf("<p", p_end) != -1) {
                                let p_start = td_inside.indexOf(">", table.indexOf("<p", start + 1) + 1) + 1;
                                let start = td_inside.indexOf(">", j + 1);
                                // No table inside a table
                                td_inside_end = section.indexOf("</p>", start + 1);
                                detect_inside_p(j, start, content);
                            };
                        }
                    }
                    
                    
                    if (nb_tr == 1 && nb_td == 1 ) {
                        const td_start = table.indexOf(">", table.indexOf("<td", start + 1) + 1) + 1;
                        const td_end = table.indexOf("</td>");
                        const inside = table.substr(td_start, td_end).trim();

                        let inside_end = 0;
                        while (inside.indexOf("<", inside_end) != -1) {
                            let j = inside.indexOf("<", inside_end);
                            let start = inside.indexOf(">", j + 1);
                            // No table inside a table
                            inside_end = section.indexOf("</p>", start + 1);
                            detect_inside_p(j, start, content);
                        };
                    } else {
                        // let tr_end = 0;
                        // while (table.indexOf("<tr ", tr_end) != -1) {
                        //     let k = table.indexOf("<tr ", tr_end);
                        //     let tr_start = table.indexOf(">", k + 1);
                        // }
                        content.push({
                            element: "table",
                            content: section.substr(start+1, end-start-1)
                        });
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