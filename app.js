// Import dependencies
const fs = require("fs");
const PDFParser = require("pdf2json");
const unixTimestamp = require("unix-timestamp");

// Get all the filenames from the patients folder
const files = fs.readdirSync("pdf");

// All of the parse patients
let patients = [];

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
                resolve({
                    yearly_cancellation: "0",
                    validity: "1362009600",
                    contract_begin: /Allgemeine Vertragsangaben[a-zA-z\s]*\s*([\d]{2}\.[\d]{2}.[\d]{4})/.exec(raw)[1].trim(),
                    contract_termination: "1451520000",
                    maximum_insured_salary: {
                        industrial_accident: {
                            men: "2774000",
                            women: "12234900"
                        },
                        non_industrial_accident: {
                            men: "2758300",
                            women: "12156300"
                        }
                    },
                    premium_rate: {
                        industrial_accident: {
                            "overall": "3.32"
                        },
                        non_industrial_accident: {
                            overall: "10.86"
                        }
                    },
                    yearly_premium: "211802",
                    premiums: {
                        discount: "0"
                    }
                });

            });

        });

        // Add the patient to the patients array
        patients.push(patient);

    }));

    //console.log(patients[0]["contract_begin"]); // access var in array
    //let temp = "25.10.2019".split('.').reverse().join('-'); // convert date format "dd.mm.yyyy -> yyyy-mm-dd"
    patients[0]["contract_begin"] = new Date(patients[0]["contract_begin"].split('.').reverse().join('-')).getTime() / 1000;
    
    // Save the extracted information to a json file
    fs.writeFileSync("offerteDaten.json", JSON.stringify(patients));

})();