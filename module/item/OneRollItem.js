export default class OneRollItem extends Item {
    
    prepareBaseData(){
        super.prepareBaseData();

        const itemStats = this.system; // actorData is "actor.data.data"

        // console.warn("prepareBaseData object: ", actorData);
        
    }

    adjustPool(dir) {
       // console.warn("Item adjustPool fired");
        let sys = this.system;
        let max = sys.max_points;
        let min = sys.min_points;
        let cur = sys.curr_points;

       // console.warn("Direction", dir);
        if(dir == "inc") {
            cur++;
            sys.curr_points = Math.min(cur, max);
        } else if (dir == "dec") {
            cur--;
            sys.curr_points = Math.max(cur, min);
        } else {
            return;
        }
       // console.warn("sys.curr_points: ", sys.curr_points);
        this.update({"system":sys});
        //console.warn("after changes: ", this);
    }
}