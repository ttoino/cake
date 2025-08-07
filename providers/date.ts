import { createPoll } from "ags/time";

const FORMATTER = new Intl.DateTimeFormat([], {
    day: "numeric",
    hour: "numeric",
    hour12: false,
    minute: "numeric",
    month: "numeric",
    second: "numeric",
    weekday: "short",
    year: "2-digit",
});

const dateObject = () => {
    const date = new Date();
    const parts = FORMATTER.formatToParts(date);
    const ret = {
        date,
        day: "",
        hour: "",
        minute: "",
        month: "",
        second: "",
        weekday: "",
        year: "",
    };

    for (const part of parts)
        if (part.type in ret)
            ret[part.type as keyof typeof ret & typeof part.type] = part.value;

    return ret;
};

export default createPoll(dateObject(), 1000, dateObject);
