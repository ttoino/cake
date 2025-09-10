import { Accessor, createBinding, createComputed, For } from "ags";
import { Gtk } from "ags/gtk4";
import Wp from "gi://AstalWp";

import {
    CHEVRON_DOWN,
    CHEVRON_UP,
    MIC,
    MIC_OFF,
    VOLUME_MUTE,
} from "../lib/chars";
import { volumeRange } from "../lib/icons";
import { createDefaultBinding } from "../lib/state";
import Button from "../widgets/Button";
import IconButton from "../widgets/IconButton";
import IconSlider from "../widgets/IconSlider";
import ScrollText from "../widgets/ScrollText";
import ToggleIconButton from "../widgets/ToggleIconButton";

const audio = Wp.get_default()?.audio;

const VolumeSlider = ({
    device,
    isSpeaker,
}: {
    device: Wp.Endpoint;
    isSpeaker: boolean;
}) => (
    <IconSlider
        drawValue={false}
        hexpand
        icon={isSpeaker ? createBinding(device, "volume").as(volumeRange) : MIC}
        onNotifyValue={({ value }) => (device.volume = value)}
        step={5}
        value={createBinding(device, "volume")}
    />
);

const MuteButton = ({
    device,
    isSpeaker,
}: {
    device: Wp.Endpoint;
    isSpeaker: boolean;
}) => (
    <ToggleIconButton
        active={createBinding(device, "mute")}
        label={createComputed(
            [createBinding(device, "mute"), createBinding(device, "volume")],
            (mute, volume) =>
                isSpeaker
                    ? mute
                        ? VOLUME_MUTE
                        : volumeRange(volume)
                    : mute
                      ? MIC_OFF
                      : MIC,
        )}
        onToggled={({ active }) => device.set_mute(active)}
        valign={Gtk.Align.CENTER}
        vexpand={false}
    />
);

const Device = ({
    devices,
    isSpeaker,
    selectedDevice,
    setSelectedDevice,
}: {
    devices: Accessor<Wp.Endpoint[]>;
    isSpeaker: boolean;
    selectedDevice: Wp.Endpoint;
    setSelectedDevice: (device: Wp.Endpoint) => void;
}) => {
    let stack: Gtk.Stack;

    const Title = ({
        icon,
        next,
        title,
    }: {
        icon: string;
        next: string;
        title: Accessor<string> | string;
    }) => (
        <box spacing={8}>
            <ScrollText label={title} />
            <IconButton
                label={icon}
                onClicked={() => (stack.visibleChildName = next)}
            />
        </box>
    );

    return (
        <stack
            $={(s) => (stack = s)}
            class="audio-device"
            hexpand
            interpolateSize
            transitionType={Gtk.StackTransitionType.CROSSFADE}
            vhomogeneous={false}
            visibleChildName="volume"
        >
            <box
                $type="named"
                name="volume"
                orientation={Gtk.Orientation.VERTICAL}
                spacing={8}
            >
                <Title
                    icon={CHEVRON_DOWN}
                    next="select"
                    title={createDefaultBinding(
                        selectedDevice,
                        "description",
                        isSpeaker ? "Speaker" : "Microphone",
                    )}
                />
                <box spacing={8}>
                    <VolumeSlider
                        device={selectedDevice}
                        isSpeaker={isSpeaker}
                    />
                    <MuteButton device={selectedDevice} isSpeaker={isSpeaker} />
                </box>
            </box>
            <box
                $type="named"
                name="select"
                orientation={Gtk.Orientation.VERTICAL}
                spacing={8}
            >
                <Title
                    icon={CHEVRON_UP}
                    next="volume"
                    title={`Default ${isSpeaker ? "Speaker" : "Microphone"}`}
                />
                <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
                    <For each={devices}>
                        {(device) => (
                            <Button
                                class="device"
                                onClicked={() => {
                                    setSelectedDevice(device);
                                    stack.visibleChildName = "volume";
                                }}
                            >
                                <ScrollText
                                    label={createBinding(
                                        device,
                                        "description",
                                    ).as(
                                        (description) =>
                                            description ?? "Unknown",
                                    )}
                                />
                            </Button>
                        )}
                    </For>
                </box>
            </box>
        </stack>
    );
};

const Audio = (props: JSX.IntrinsicElements["box"]) => {
    if (!audio) return <></>;

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={16} {...props}>
            <box spacing={16}>
                <label
                    halign={Gtk.Align.START}
                    hexpand
                    justify={Gtk.Justification.LEFT}
                    label="Audio"
                />
            </box>
            <Device
                devices={createBinding(audio, "speakers")}
                isSpeaker
                selectedDevice={audio.defaultSpeaker}
                setSelectedDevice={() => {}}
            />
            <Device
                devices={createBinding(audio, "microphones")}
                isSpeaker={false}
                selectedDevice={audio.defaultMicrophone}
                setSelectedDevice={() => {}}
            />
        </box>
    );
};

export default {
    audio: Audio,
};
