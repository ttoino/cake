import * as chars from "./chars";

export const batteryIcons = [
    chars.BATTERY_0_BAR,
    chars.BATTERY_1_BAR,
    chars.BATTERY_2_BAR,
    chars.BATTERY_3_BAR,
    chars.BATTERY_4_BAR,
    chars.BATTERY_5_BAR,
    chars.BATTERY_6_BAR,
    chars.BATTERY_FULL,
] as const;

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

export const volumeIcons = [
    chars.VOLUME_MUTE,
    chars.VOLUME_DOWN,
    chars.VOLUME_UP,
] as const;

export const wifiIcons = [
    chars.SIGNAL_WIFI_0_BAR,
    chars.NETWORK_WIFI_1_BAR,
    chars.NETWORK_WIFI_2_BAR,
    chars.NETWORK_WIFI_3_BAR,
    chars.SIGNAL_WIFI_4_BAR,
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

export const batteryRange = (charging: boolean, percent: number) =>
    iconRange(charging ? batteryChargingIcons : batteryIcons, percent);

export const brightnessRange = (brightness: number) =>
    iconRange(brightnessIcons, brightness);

export const volumeRange = (volume: number) => iconRange(volumeIcons, volume);

export const wifiRange = (strength: number) =>
    iconRange(wifiIcons, strength / 100);

export const bluetoothIcon = (icon: string, fallback?: string) =>
    icon in bluetoothIcons
        ? bluetoothIcons[icon as keyof typeof bluetoothIcons]
        : fallback;
