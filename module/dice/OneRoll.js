export class OneRoll {

    /**
     * let rollData = {
            rollPoll: pool,
            actorId:dialogData.actor,
        }
     */
    roll(rollData) {

        this.pool = rollData.pool;
        this.actorId = rollData.actorId;
        this.dieType = rollData.dieType;
        
        var rawRoll = this.buildArray(this.pool);
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
        let expr = "1" + this.dieType;
        for (i=0; i < count; i++){

            let die = new Roll(expr);
            let thisDie = die.roll({async:false});
            rollArr.push(thisDie.total);
        }
		console.log("raw roll: " + rollArr);
        return rollArr.sort();

    }

    countSets(raw) {
        console.warn("Raw Array: ", raw);
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