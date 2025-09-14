import * as chars from "./chars";

export const batteryChargingIcons = [
    chars.BATTERY_CHARGING_FULL,
    chars.BATTERY_CHARGING_20,
    chars.BATTERY_CHARGING_30,
    chars.BATTERY_CHARGING_50,
    chars.BATTERY_CHARGING_60,
    chars.BATTERY_CHARGING_80,
    chars.BATTERY_CHARGING_90,
    chars.BATTERY_CHARGING_FULL,
] as const;

export const brightnessIcons = [
    chars.BRIGHTNESS_5,
    chars.BRIGHTNESS_6,
    chars.BRIGHTNESS_7,
] as const;

export const bluetoothIcons = {
    "audio-headphones": chars.HEADPHONES,
    "audio-headset": chars.HEADSET_MIC,
    "audio-speakers": chars.SPEAKER,
    "camera-photo": chars.CAMERA,
    "camera-video": chars.VIDEOCAM,
    computer: chars.COMPUTER,
    "input-gaming": chars.SPORTS_ESPORTS,
    "input-keyboard": chars.KEYBOARD,
    "input-mouse": chars.MOUSE,
    phone: chars.MOBILE,
    printer: chars.PRINT,
    scanner: chars.SCANNER,
    "video-display": chars.VIDEOCAM,
} as const;

export const iconRange = (icons: readonly string[], value: number) => {
    const index = Math.min(
        Math.max(0, Math.floor(value * icons.length)),
        icons.length - 1,
    );
    return icons[index];
};

export const batteryChargingRange = (percent: number) =>
    iconRange(batteryChargingIcons, percent);

export const brightnessRange = (brightness: number) =>
    iconRange(brightnessIcons, brightness);

export const bluetoothIcon = <F extends string | undefined>(
    icon: string,
    fallback: F,
) =>
    icon in bluetoothIcons
        ? bluetoothIcons[icon as keyof typeof bluetoothIcons]
        : fallback;
