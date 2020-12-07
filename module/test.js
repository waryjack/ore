// Unrelated macro testing; disregard

oneroll(8);

function oneroll(count) {
 
        let rawRoll = buildArray(count);
        let parsedRoll = getSets(rawRoll);
		
		let setStr = "<b>Rolling "+count+" dice</b>: "+rawRoll.toString()+"<br><b>Sets</b>: "+parsedRoll.sets.toString()+" (loose dice: "+parsedRoll.loose.sort().toString()+")";
		
		ChatMessage.create({
			content: setStr
		});
		
}

function buildArray(count) {
        var i;
        var rollArr = new Array();
        for (i=0; i < count; i++){

            let thisDie = new Roll("1d10").roll().total;
            rollArr.push(thisDie);
        }
		console.log("raw roll: " + rollArr);
        return rollArr.sort();

}

function getSets(raw) {

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
		
		let rollFinal = { 
			"sets":setArr, 
			"loose":singletons
		};
		
        return rollFinal;
		

}