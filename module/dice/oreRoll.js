export class ORERoll {

    
    roll(pool) {

        var rawRoll = this.buildArray(pool);
        var parsedRoll = this.countSets(rawRoll);

        this.allDice = rawRoll;
        this.sets = parsedRoll.sets.toString();
        this.loose = parsedRoll.loose.toString();
      
    }

    // Get only the sets rolled from the dice pool
    get sets() {
        return this._sets;
    }

    set sets(setInfo) {
        this._sets = setInfo;
    }

    // Get only the loose (unmatched) dice in the array
    get loose() {
        return this._loose;
    }

    set loose(looseDice) {
        this._loose = looseDice;
    }
    // Get the full roll array
    get allRolls() {
        return this._raw;
    }

    set allRolls(allDice) {
        this._allRolls = allDice;
    }

    buildArray(count) {
        var i;
        var rollArr = new Array();
        for (i=0; i < count; i++){

            let thisDie = new Roll("1d10").roll().total;
            rollArr.push(thisDie);
        }
		// console.log("raw roll: " + rollArr);
        return rollArr.sort();

    }

    countSets(raw) {

        var setArr = [];
		var singletons = [];

        for(let i = 1; i <= 10; i++) {
            let matches = raw.filter(roll => roll == i).length;
			// console.log("matches: " + matches);
            if(matches > 1) {
                setArr.push(matches + "x" + i);
            } else if (matches == 1) {
				singletons.push(i);
			} else {}
        }
		
		let rollFinal = { 
			"sets":setArr, 
			"loose":singletons
		};
		
        return rollFinal;
		

    }

}