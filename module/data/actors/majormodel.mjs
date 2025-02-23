const {
    HTMLField, SchemaField, NumberField, StringField, BooleanField, FilePathField, ObjectField
  } = foundry.data.fields;

  export default class OreMajorActorData extends OreBaseModel {
    static defineSchema() {
      const baseSchema = super.defineSchema();
      return {
        ...baseSchema,
        hitlocs: new SchemaField({
          head: new SchemaField(this._hitLocSchema(4)),
          torso: new SchemaField(this._hitLocSchema(6)),
          vitals: new SchemaField(this._hitLocSchema(4)),
          la: new SchemaField(this._hitLocSchema(5)),
          ra: new SchemaField(this._hitLocSchema(5)),
          ll: new SchemaField(this._hitLocSchema(5)),
          rl: new SchemaField(this._hitLocSchema(6))
        })
      }
    }

    prepareDerivedData() {

    }


    _hitLocSchema(max) {
      return {
        box_max: new NumberField({required:true, initial:max, min:0, integer:true}),
        states: new ArrayField(new StringField(), {required:true, initial:new Array(max).fill("h").flat()}),
        shock: new NumberField({required:true, initial:0, min:0, integer:true}),
        killing: new NumberField({required:true, initial:0, min:0, integer:true})
      }
    }
  }