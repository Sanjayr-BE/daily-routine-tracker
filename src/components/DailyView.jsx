import { createContext, useState } from "react";
import DailySummary from "./DailySummary";
import CurrentDay from "./CurrentDay";
import DailyActivities from "./DailyActivities";


export const DateContext = createContext();


// FIX: prevent Date mutation bug
const normalizeDate = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());


const DailyView = () => {
const [selectedDay, setSelectedDay] = useState(new Date());


const dayDiff =
(normalizeDate(selectedDay) - normalizeDate(new Date())) /
(1000 * 60 * 60 * 24);


return (
<DateContext.Provider
value={{
selectedDay,
setSelectedDay,
CurrentDate: selectedDay.getDate(),
currentMonth: selectedDay.toLocaleString("default", { month: "long" }),
CurrentDay: selectedDay.toLocaleString("default", { weekday: "long" }),
CurrentYear: selectedDay.getFullYear(),
dayStatus: dayDiff === 0 ? "Today" : dayDiff < 0 ? "Past" : "Future",
}}
>
<div className="2xl:w-4/5 w-[94%] mx-auto mt-5 flex flex-col gap-5 pb-6">
<DailySummary />
<CurrentDay />
<DailyActivities />
</div>
</DateContext.Provider>
);
};


export default DailyView;