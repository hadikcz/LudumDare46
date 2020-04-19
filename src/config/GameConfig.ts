import phaserBasicSettings from 'config/json/phaserBasicSettings.json';
import ui from 'config/json/ui.json';

export default {
    PhaserBasicSettings: phaserBasicSettings,
    UI: ui,
    World: {
        size: {
            width: 1024,
            height: 768
        }
    },
    Animal: {
        WaitForPooOrFoodBeforeDie: 30
    }
};
