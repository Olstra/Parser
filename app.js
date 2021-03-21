// Import dependencies
const fs = require("fs");
const PDFParser = require("pdf2json");
const unixTimestamp = require("unix-timestamp");

// Get all the filenames from the patients folder
const files = fs.readdirSync("pdf");

// All of the parse patients
let patients = [];

function toUnixTimestamp(text){
    let newText = new Date( text.split('.').reverse().join('-') ).getTime() / 1000;
    return newText;
}

function parseDate(regexExpr, text){

    let result = null; // if not found value will be null

    if(regexExpr.exec(text)[1] != null){
        result = toUnixTimestamp( regexExpr.exec(text)[1].trim() );
    }

    return result;
}

// Make a IIFE so we can run asynchronous code
(async () => {

    // Await all of the patients to be passed
    // For each file in the patients folder
    await Promise.all(files.map(async (file) => {

        // Set up the pdf parser
        let pdfParser = new PDFParser(this, 1);

        // Load the pdf document
        pdfParser.loadPDF(`pdf/${file}`);

        // Parsed the patient
        let patient = await new Promise(async (resolve, reject) => {

            // On data ready
            pdfParser.on("pdfParser_dataReady", (pdfData) => {

                // The raw PDF data in text form
                const raw = pdfParser.getRawTextContent().replace(/\r\n/g, " ");
                
                // Return the parsed data
                // TODO what about "endpattern"?
                // TODO what about translations?
                // TODO make function to tranform date->Unix timestamp
                resolve({
                    yearly_cancellation: parseDate(/Diese Offerte ist gültig bis|Offerte \/ Antrag ist g.ltig bis\s+(\d\d.\d\d.\d\d\d\d)/, raw),
                    validity: parseDate(/Diese Offerte ist gültig bis|Offerte \/ Antrag ist g.ltig bis\s+(\d\d.\d\d.\d\d\d\d)/, raw),
                    contract_begin: parseDate(/Diese Offerte ist gültig bis|Offerte \/ Antrag ist g.ltig bis\s+(\d\d.\d\d.\d\d\d\d)/, raw),
                    contract_termination: parseDate(/Allgemeine Vertragsangaben[a-zA-z\s]*\s*([\d]{2}\.[\d]{2}.[\d]{4})/, raw),
                    maximum_insured_salary: {
                        industrial_accident: {
                            men: "TODO",
                            women: "TODO"
                        },
                        non_industrial_accident: {
                            men: "TODO",
                            women: "TODO"
                        }
                    },
                    premium_rate: {
                        industrial_accident: {
                            "overall": "TODO"
                        },
                        non_industrial_accident: {
                            overall: "TODO"
                        }
                    },
                    yearly_premium: "TODO",
                    premiums: {
                        discount: "TODO"
                    }
                });
            });
        });

        // Add the patient to the patients array
        patients.push(patient);

    }));

    // Save the extracted information to a json file
    fs.writeFileSync("offerteDaten.json", JSON.stringify(patients, null, "\t"));

})();