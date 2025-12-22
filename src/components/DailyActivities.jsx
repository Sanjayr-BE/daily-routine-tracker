import React, { useState } from "react";
import Meal from "./Meal";
import Expences from "./Expences";
import Routine from "./Routine";

const DailyActivities = () => {
  const [activityTab, setActivityTab] = useState("Meals");

  return (
    <div className="border-2 border-[#1F2937] rounded-lg bg-[#1F2937] p-3 sm:p-7  ">
      <div>
        <p className="font-bold text-[1.2rem]">Daily Activities</p>
      </div>

      {/* {Daily Activities Tab Switch} */}
      <div className="mt-6">
        <div
          className="border bg-[#1F2937]  border-[#394b65] rounded-lg p-1 
                     flex sm:flex-row flex-col gap-1"
        >
          <button
            onClick={()=>setActivityTab("Meals")}
            className={`cursor-pointer flex-1
              ${activityTab === "Meals" ? "bg-[#3B82F6]" : " bg-transparent"}
              text-white py-1 rounded-md
                       transition-all`}
          >
            Meals
          </button>

          <button
            onClick={()=>setActivityTab("Expences")}
            className={`cursor-pointer flex-1
             ${activityTab === "Expences" ? "bg-[#3B82F6]" : " bg-transparent"}
              text-white py-1 rounded-md
                      transition-all`}
          >
            Expences
          </button>
          <button
             onClick={()=>setActivityTab("Routines")}
            className={`cursor-pointer flex-1
             ${activityTab === "Routines" ? "bg-[#3B82F6]" : " bg-transparent"}
              text-white py-1 rounded-md
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
