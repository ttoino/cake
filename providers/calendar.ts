import { Object, register, signal } from "ags/gobject";
import { execAsync } from "ags/process";
import { interval } from "ags/time";

@register()
export default class Calendar extends Object {
    static instance: Calendar;
    private _events: Map<string, Event> = new Map();

    constructor() {
        super();

        interval(15 * 60 * 1000, () =>
            execAsync([
                "khal",
                "list",
                "--format",
                '{{"uid":{uid!r},"title":{title!r},"description":{description!r},"location":{location!r},"start":{start!r},"end":{end!r}}}',
            ])
                .then((output) => {
                    const events = output
                        .replace(/vText\('b'(.*?)''\)/g, '"$1"')
                        .replace(/'(.*?)'/g, '"$1"')
                        .replace(/None/g, "null")
                        .replace(/True/g, "true")
                        .replace(/False/g, "false")
                        .split("\n");

                    for (const event of events) {
                        if (!event) continue;

                        const {
                            description,
                            end,
                            location,
                            start,
                            title,
                            uid,
                        }: {
                            description: string;
                            end: string;
                            location: string;
                            start: string;
                            title: string;
                            uid: string;
                        } = JSON.parse(event);
                        const allDay = !start.includes("T");

                        const existing = this._events.get(uid);

                        if (existing) {
                            // TODO
                        } else {
                            this._events.set(
                                uid,
                                new Event(
                                    uid,
                                    title,
                                    description,
                                    location,
                                    new Date(start),
                                    new Date(end),
                                    allDay,
                                ),
                            );
                            this.eventAdded(uid);
                        }
                    }
                })
                .catch((error) => console.error(error)),
        );
    }

    static get_default(): Calendar {
        if (!this.instance) this.instance = new Calendar();
        return this.instance;
    }

    @signal([String], undefined, {
        default: false,
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eventAdded(id: string) {}

    @signal([String], undefined, {
        default: false,
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eventRemoved(id: string) {}
}

export class Event {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public location: string,
        public start: Date,
        public end: Date,
        public allDay: boolean,
    ) {}
}
