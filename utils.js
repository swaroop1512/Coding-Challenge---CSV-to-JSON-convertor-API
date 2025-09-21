export function getFields(headers) {
    let template = {};
    for (let i = 0; i < headers.length; i++) {

        let feild = headers[i].split(".");
        let curr = template;

        let j = 0;

        for (j = 0; j < feild.length - 1; j++) {
            let key = feild[j].trim();
            if (typeof curr[key] !== "object") //|| curr[key] === null
            {
                curr[key] = {};
            }
            curr = curr[key];
        }
        let key = feild[j];
        curr[key] = "";

    }
    return template;
}


export function convertToJSON(headers, values, template) {

    let filled = JSON.parse(JSON.stringify(template));
    for (let i = 0; i < headers.length; i++) {
        
        let feild = headers[i].split(".");
        let curr = filled;
        
        let j = 0;
        for (j = 0; j < feild.length - 1; j++) {
            let key = feild[j];
            curr = curr[key];
        }
        let key = feild[j];
        curr[key] = values[i].trim();
    }

    return filled;
}
// module.exports = getFields;

    // headers.forEach((h, idx) => {
    //     let feild = h.split(".");
    //     let curr = filled;

    //     for (let j = 0; j < feild.length; j++) {
    //         let key = feild[j];
    //         if (j === feild.length - 1) {
    //             curr[key] = values[idx].trim();  // assign value
    //         } else {
    //             curr = curr[key];
    //         }
    //     }
    // });
    // console.log(filled);