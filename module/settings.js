export const registerSettings = function() {
    
    // Register core die type
    game.settings.register("ore", "coreDieType", {
        name: 'ORE.settings.dice.setType.lbl',
        hint: 'ORE.settings.dice.setType.hint',
        scope: 'world',
        config: true,
        type: String,
        default: 'd10',
        choices: {
            'd6':'Use D6s',
            'd8':'Use D8s',
            'd10': 'Use D10s (default)',
            'd12': 'Use D12s', 
            'd20': 'Use D20s'
        },
        onChange: (rule) => {
         // console.warn("New CoreDieType", game.settings.get("ore", "coreDieType"));
        }

    });

    game.settings.register("ore", "bod", {
        name: "ORE.settings.displayName.body.lbl",
        hint: "ORE.settings.displayName.body.hint",
        scope: "world",
        config: true,
        type: String,
        default: "Body"
    });

    game.settings.register("ore", "crd", {
        name: "ORE.settings.displayName.coordination.lbl",
        hint: "ORE.settings.displayName.coordination.hint",
        scope: "world",
        config: true,
        type: String,
        default: "Coordination"
    });

    game.settings.register("ore", "sns", {
        name: "ORE.settings.displayName.sense.lbl",
        hint: "ORE.settings.displayName.sense.hint",
        scope: "world",
        config: true,
        type: String,
        default: "Sense"
    });

    game.settings.register("ore", "mnd", {
        name: "ORE.settings.displayName.mind.lbl",
        hint: "ORE.settings.displayName.mind.hint",
        scope: "world",
        config: true,
        type: String,
        default: "Mind"
    });

    game.settings.register("ore", "cmd", {
        name: "ORE.settings.displayName.command.lbl",
        hint: "ORE.settings.displayName.command.hint",
        scope: "world",
        config: true,
        type: String,
        default: "Command"
    });

    game.settings.register("ore", "emp", {
        name: "ORE.settings.displayName.empathy.lbl",
        hint: "ORE.settings.displayName.empathy.hint",
        scope: "world",
        config: true,
        type: String,
        default: "Empathy"
    });

    game.settings.register("ore", 'ext1Enable', {
        name: 'ORE.settings.extra1.enable.lbl',
        hint: 'ORE.settings.extra1.enable.hint',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
    });

    game.settings.register("ore", 'ext2Enable', {
        name: 'ORE.settings.extra2.enable.lbl',
        hint: 'ORE.settings.extra2.enable.hint',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
    });

    game.settings.register("ore", "ext1", {
        name: "ORE.settings.displayName.extra1.lbl",
        hint: "ORE.settings.displayName.extra1.hint",
        scope: "world",
        config: true,
        type: String,
        default: "Empathy"
    });

    game.settings.register("ore", "ext2", {
        name: "ORE.settings.displayName.extra2.lbl",
        hint: "ORE.settings.displayName.extra2.hint",
        scope: "world",
        config: true,
        type: String,
        default: "Empathy"
    });


    
}