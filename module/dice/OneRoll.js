export class OneRoll {

    /**
     *     let rollData = {
                                rollPool: pool,
                                poolMod: poolMod,
                                actor:this._id,
                                dieType: dtype,
                                displayText: statSkillText,
                                expertDice: edValues,
                                maxPool: maxPoolSize
                            }
     */

    // TODO: custom Dice-so-nice integration; low priority

    constructor(data) {
      // console.warn("OneRoll received data: ", data);
        this.pool = data.rollPool;
        this.actor = data.actor;
        this.dieType = data.dieType;
        this.displayText = data.displayText;
        this.expertDice = data.expertDice;
        this.hasMaster = data.hasMaster;
        this.expertAlreadyCounted = false;
        this.rawRoll = [];
        this.parsedRoll = [];
    }

    async roll() {
       // var rollImgs = [];
        // take the initial roll information and create a sorted array of rolls
        // including any expert dice that were selected in the initial roll dialog
        
        let rawRoll = await this.buildArray(this.pool);

        // send the rawRoll array to counted into sets
        let setsFound = this.countSets(rawRoll);

        //take the now-counted sets, and convert them into image strings for display
        let parsedRoll = this.parseRoll(setsFound);

        /* rawRoll.forEach(i => {
            rollImgs.push(`<img src="systems/ore/assets/dice_img/${this.dieType}/${this.dieType}-${i}.png" style="border:none;" height="48" width="48">`);
        });*/ 

        this.rawRoll = rawRoll;
        this.parsedRoll = parsedRoll;
        
       
    }

    async buildArray(count) {
        const diceMaxes = {
            "d4": 4,
            "d6": 6,
            "d8": 8,
            "d10": 10,
            "d12": 12,
            "d20": 20
        }
        var i;
        var rollArr = new Array();
        let expr = "1" + this.dieType;
        for (i=0; i < count; i++){
            // let die = new Roll(expr);
            let thisDie = await new Roll(expr).evaluate();
            rollArr.push(thisDie.total);
        }
		console.log("raw roll: " + rollArr);

        // add expert dice, if any

        if(this.expertDice != "--" && this.expertDice.length != 0 && !this.expertAlreadyCounted) {
            let expertDiceArray = this.expertDice.split(",");
          // console.log("expert dice array: ", expertDiceArray);
            expertDiceArray.forEach(i => {
                
                let iVal = Number(i);
              // console.log("expert dice array i: ", i, "iVal: ", iVal);
              // console.log("typeof iVal: ", typeof iVal);
                if(typeof iVal == "number") {
                    rollArr.push(iVal);
                }
                
            })
            this.expertAlreadyCounted = true;

        }
        

        return rollArr.sort();

    }

    countSets(raw) {
      // console.warn("Raw Array: ", raw);

        const diceFaces = {
            "d6": 6,
            "d8": 8,
            "d10": 10,
            "d12": 12,
            "d20": 20
        }

        var setArr = [];
		var singletons = [];
        let maxFace = diceFaces[this.dieType];

        for(let i = 1; i <= maxFace; i++) {
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

    parseRoll(parsedRoll) {
        var setImgs = [];
        var looseImgs = [];
        // var parsedRoll = this.countSets(this.rawRoll);

      // console.log("Parsed Roll: ", parsedRoll);

        parsedRoll.sets.forEach(s => {
            let wh = s.split("x");
            let w = wh[0];
            let h = wh[1];
            for(let x = 0; x<w; x++) {
                setImgs.push(`<img src="systems/ore/assets/dice_img/${this.dieType}/${this.dieType}-${h}.png" style="border:none;" height="40" width="40">`);
            }
            setImgs.push("<br/>");
        });

        parsedRoll.loose.forEach(l => {
            looseImgs.push(`<img src="systems/ore/assets/dice_img/${this.dieType}/${this.dieType}-${l}.png" style="border:none; filter:opacity(50%)" height="32" width="32">`);
        })

        this.allDice = this.rawRoll;
        this.sets = parsedRoll.sets.toString();
        this.loose = parsedRoll.loose.toString();
        this.diceImgs = setImgs.join("").toString();
        this.looseImgs = looseImgs.join("").toString();
      // console.log("Set Images: ", setImgs);
        return parsedRoll;
        
    }

    addMasterDie(val) {

    }

     // Get only the sets rolled from the dice pool
     get sets() {
        return this._sets;
    }

    get pool() {
        return this._pool;
    }

    get expertDice() {
        return this._expertDice;
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

    set expertDice(ed) {
        this._expertDice = ed;
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