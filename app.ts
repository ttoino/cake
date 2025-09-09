import app from "ags/gtk4/app";

import "./services/notifications";
import * as windows from "./services/windows";
import style from "./style/main.scss";

app.start({
    css: style,
    main() {
        windows.init();
    },
    requestHandler([action, ...params], res) {
        switch (action.toLowerCase()) {
            case "popup": {
                const [subaction, popup] = params;

                switch (subaction.toLowerCase()) {
                    case "dismiss":
                        popups.dismissPopup();
                        return res("Dismissed popups");
                    case "show":
                        popups.showPopup(popup);
                        return res(`Showed ${popup}`);
                    case "toggle":
                        popups.togglePopup(popup);
                        return res(`Toggled ${popup}`);
                }
                return res("Invalid popup action");
            }
        }

        res("Invalid action");
    },
});
