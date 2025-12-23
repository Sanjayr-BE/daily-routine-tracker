import React, { useState } from "react";
import Meal from "./Meal";
import Expences from "./Expences";
import Routine from "./Routine";

const DailyActivities = () => {
  const [activityTab, setActivityTab] = useState("Expences");

  return (
    <div className=" rounded-lg bg-[var(--primary-bg)] p-3 sm:p-7  ">
      <div>
        <p className="font-bold text-[1.2rem]">Daily Activities</p>
      </div>

      {/* {Daily Activities Tab Switch} */}
      <div className="mt-6">
        <div
          className="border-2  border-[var(--border-main)] rounded-lg bg-[var(--primary-bg)]  p-1 
                     flex sm:flex-row flex-col gap-1"
        >
          <button
            onClick={()=>setActivityTab("Meals")}
            className={`cursor-pointer flex-1 font-medium
              ${activityTab === "Meals" ? "bg-[var(--click-btn)] text-white" : " bg-transparent"}
               py-1 rounded-md
                       transition-all`}
          >
            Meals
          </button>

          <button
            onClick={()=>setActivityTab("Expences")}
            className={`cursor-pointer flex-1 font-medium
             ${activityTab === "Expences" ? "bg-[var(--click-btn)] text-white" : " bg-transparent"}
               py-1 rounded-md
                      transition-all`}
          >
            Expences
          </button>
          <button
             onClick={()=>setActivityTab("Routines")}
            className={`cursor-pointer flex-1 font-medium
             ${activityTab === "Routines" ? "bg-[var(--click-btn)]  text-white" : " bg-transparent"}
              py-1 rounded-md
                      transition-all`}
          >
            Routines
          </button>
        </div>
        {/* {conditonal based rentering page} */}

        <div className="mt-6 w-full min-h-[60vh]">
          {activityTab === "Meals"&& <Meal/>}
          {activityTab === "Expences"&& <Expences/>}
          {activityTab === "Routines"&& <Routine/>}
        </div>
      </div>
    </div>
  );
};

export default DailyActivities;
