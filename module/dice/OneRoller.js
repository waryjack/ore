export class OneRoller extends Roll {

    
    constructor(formula){
        
        super(formula);

    }

    roll() {
        super.roll();
        // console.log("OneRoll called: ", this.results);
        this.buildArray(this.terms);
        this.countSets(this.raw); 
        return this;
    }

    buildArray(terms) {
      
        var rollData = terms[0].results;
      
        var rollArr = new Array();
        for (let i=0; i < rollData.length; i++){
            rollArr.push(rollData[i].result);
        }
	
        this.raw = rollArr;
    

    }

    countSets(raw) {

        var setArr = [];
		var singletons = [];

        for(let i = 1; i <= 10; i++) {
            let matches = raw.filter(roll => roll == i).length;
		
            if(matches > 1) {
                setArr.push(matches + "x" + i);
            } else if (matches == 1) {
				singletons.push(i);
			} else {}
        }
      
        this.sets = setArr;
        this.loose = singletons;

    }

    // Getters and setters
    get sets() {
        return this._sets;
    }

    set sets(setInfo){
        this._sets = setInfo;
    }

    get loose() {
        return this._loose;
    }

    set loose(looseDice){
        this._loose = looseDice;
    }
    
    get allDice() {
        return this._raw;
    }

    set allDice(diceArray) {
        this._raw = diceArray;
    }

}