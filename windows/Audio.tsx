import { Accessor, createBinding, createComputed, For } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Wp from "gi://AstalWp";

import {
    CHEVRON_DOWN,
    CHEVRON_UP,
    MICROPHONE,
    MICROPHONE_OFF,
    VOLUME_MUTE,
} from "../lib/chars";
import { volumeRange } from "../lib/icons";
import ExpandableWindow from "../widgets/ExpandableWindow";
import IconSlider from "../widgets/IconSlider";
import ScrollText from "../widgets/ScrollText";

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
        icon={
            isSpeaker
                ? createBinding(device, "volume").as(volumeRange)
                : MICROPHONE
        }
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
    <togglebutton
        active={createBinding(device, "mute")}
        class="icon"
        label={createComputed(
            [createBinding(device, "mute"), createBinding(device, "volume")],
            (mute, volume) =>
                isSpeaker
                    ? mute
                        ? VOLUME_MUTE
                        : volumeRange(volume)
                    : mute
                      ? MICROPHONE_OFF
                      : MICROPHONE,
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
            <button
                class="icon"
                onClicked={() => (stack.visibleChildName = next)}
            >
                {icon}
            </button>
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
                    title={createBinding(selectedDevice, "description").as(
                        (description) =>
                            description ??
                            (isSpeaker ? "Speaker" : "Microphone"),
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
                            <button
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
                            </button>
                        )}
                    </For>
                </box>
            </box>
        </stack>
    );
};

const AudioContent = ({
    collapseButton,
    ...props
}: {
    $type: "named";
    collapseButton: JSX.Element;
    name: "expanded";
}) => {
    if (!audio) return <></>;

    return (
        <scrolledwindow
            hscrollbarPolicy={Gtk.PolicyType.NEVER}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            {...props}
        >
            <box orientation={Gtk.Orientation.VERTICAL} spacing={16}>
                <box spacing={16}>
                    {collapseButton}
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
        </scrolledwindow>
    );
};

export default function Audio(props: Partial<JSX.IntrinsicElements["window"]>) {
    if (!audio) return <></>;

    return (
        <window
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
            application={app}
            margin={16}
            name="audio"
            {...props}
        >
            <ExpandableWindow
                collapsed={
                    <>
                        <VolumeSlider device={audio.defaultSpeaker} isSpeaker />
                        <MuteButton device={audio.defaultSpeaker} isSpeaker />
                    </>
                }
                expanded={AudioContent}
            />
        </window>
    );
}
