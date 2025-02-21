const {
    HTMLField, SchemaField, NumberField, StringField, BooleanField, FilePathField, ObjectField
  } = foundry.data.fields;
  
export default class OreBaseActorData extends foundry.abstract.TypeDataModel {

    static defineSchema() {
        return {
            img: new FilePathField({required:false, categories:["IMAGE"]}),
            bio: new HTMLField({initial:""}),
            misc: new SchemaField({
                armor_k: new NumberField({integer:true, initial:0, min:0}),
                armor_s: new NumberField({integer:true, initial:0, min:0}),
                health: new SchemaField({
                    head:new ArrayField(new NumberField(), {initial:[0,0]}),
                    torso:new ArrayField(new NumberField(), {initial:[0,0]}),
                    vitals:new ArrayField(new NumberField(), {initial:[0,0]}),
                    ra:new ArrayField(new NumberField(), {initial:[0,0]}),
                    la:new ArrayField(new NumberField(), {initial:[0,0]}),
                    rl:new ArrayField(new NumberField(), {initial:[0,0]}),
                    ll:new ArrayField(new NumberField(), {initial:[0,0]}),
                })
            })
        }
    }
}