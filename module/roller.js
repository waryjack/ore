export class OneRoll extends Roll {

    
    constructor(formula){
        
        super(formula);

    }

    roll() {
        super.roll();
        console.log("OneRoll called: ", this.results);
        this.buildArray(this.terms);
        this.countSets(this.raw); 
        return this;
    }

    buildArray(terms) {
        console.log("In buildArray; terms: ", this.terms);
        var rollData = terms[0].results;
        console.log(rollData, rollData.length);
        var rollArr = new Array();
        for (let i=0; i < rollData.length; i++){
            rollArr.push(rollData[i].result);
        }
		console.log("raw roll: " + rollArr);
        this.raw = rollArr;
        console.log("this.raw: ", this.raw);

    }

    countSets(raw) {

        var setArr = [];
		var singletons = [];

        for(let i = 1; i <= 10; i++) {
            let matches = raw.filter(roll => roll == i).length;
			console.log("matches: " + matches);
            if(matches > 1) {
                setArr.push(matches + "x" + i);
            } else if (matches == 1) {
				singletons.push(i);
			} else {}
        }
        console.log("sets: "+setArr, "singles: "+singletons);
        this.sets = setArr;
        this.loose = singletons;

    }

      // Get only the sets rolled from the dice pool
    get sets() {
        return this._sets;
    }

    set sets(setInfo){
        this._sets = setInfo;
    }

    // Get only the loose (unmatched) dice in the array
    get loose() {
        return this._loose;
    }

    set loose(looseDice){
        this._loose = looseDice;
    }

    // Get the full roll array
    get allDice() {
        return this._raw;
    }

    set allDice(diceArray) {
        this._raw = diceArray;
    }

}