export class OneRoll {

    /**
     *  let rollData = {
                                rollPoll: pool,
                                actor:this._id,
                                dieType: dtype,
                                displayText: statSkillText
                            }
     */

    constructor(data) {
        console.warn("OneRoll received data: ", data);
        this.pool = data.rollPool;
        this.actor = data.actor;
        this.dieType = data.dieType;
        this.displayText = data.displayText;
    }

    roll() {
        
        var rawRoll = this.buildArray(this.pool);
        var rollImgs = [];
        rawRoll.foreach(i => {
            rollImgs.push(`<img src="systems/ore/assets/dice_img/d10/d10-${i}.png" height="24" width="24">`);
        });
        var parsedRoll = this.countSets(rawRoll);

        this.allDice = rawRoll;
        this.sets = parsedRoll.sets.toString();
        this.loose = parsedRoll.loose.toString();
        this.diceImgs = rollImgs;
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

     // Get only the sets rolled from the dice pool
     get sets() {
        return this._sets;
    }

    get pool() {
        return this._pool;
    }

    get dieType() {
        return this._dieType;
    }

    get displayText() {
        return this._displayText;
    }

    get actor() {
        return this._actor;
    }

    // Get only the loose (unmatched) dice in the array
    get loose() {
        return this._loose;
    }

   
    // Get the full roll array
    get allRolls() {
        return this._raw;
    }

    get diceImgs() {
        return this._diceImgs;
    }

    set diceImgs(imgArray) {
        this._diceImgs = imgArray;
    }
    
    set allRolls(allDice) {
        this._allRolls = allDice;
    }

    set sets(setInfo) {
        this._sets = setInfo;
    }

    set pool(pool) {
        this._pool = pool;
    }

    set loose(looseDice) {
        this._loose = looseDice;
    }

    set actor(actor) {
        this._actor = actor;
    }

    set dieType(dieType) {
        this._dieType = dieType;
    }

    set displayText(text) {
        this._displayText = text;
    }


}