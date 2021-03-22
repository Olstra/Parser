import Offer from "./Offer.mjs";
//const Offer = require("./Offer.js");

class Accident extends Offer{
    constructor(){
        super()
        this.lohn = null;
    }

    returnOfferValues(){
        let results = {
            // general values
            yearly_cancellation: this.yearly_cancellation,
            validity: this.validity,
            contract_begin: this.contract_begin,
            contract_termination: this.contract_termination,

            // accident specific values
            lohn: this.lohn
        };

        return results;
    }
}

export default Accident;