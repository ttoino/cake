declare const SRC: string;

declare module "inline:*" {
    const content: string;
    export default content;
}

declare module "*.scss" {
    const content: string;
    export default content;
}

declare module "*.blp" {
    const content: string;
    export default content;
}

declare module "*.css" {
    const content: string;
    export default content;
}

// HACK: This just fixes typechecking because we don't depend on Adw or AstalTray

declare module "gi://Adw?version=1" {
    const init: () => void;
}

declare module "gi://Adw" {
    class ToggleGroup {
        active: string;
        active_name: string;
        activeName: string;
    }
}

declare module "gi://AstalTray" {
    class Tray {
        items: unknown[];
    }
}
