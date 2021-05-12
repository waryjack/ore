export const registerSettings = function() {
    
    // Register core die type
    game.settings.register("ore", "coreDieType", {
        name: 'Core Die Type',
        hint: 'Set the core die type for the system. This has significant effects on success rates!',
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
           console.warn("New CoreDieType", game.settings.get("ore", "coreDieType"));
        }

    });
}