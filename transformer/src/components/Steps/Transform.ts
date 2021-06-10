
class Information {
    htm: string;
    json: { [key: string]: string | Array<{ [key: string]: string | Array<{ [key: string]: string }> }> };

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

            // Delete the span
            let content = body.substr(elem1, elem2-elem1);
            content = content.replace("&nbsp;", "");

            
            this.json.sections.push({
                title: body.substr(index1+1, index2-index1-1),
                content: content
            });
        }

        console.log(this.json); 
    }
};

export default Information;