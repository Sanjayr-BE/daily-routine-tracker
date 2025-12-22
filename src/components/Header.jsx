import { useState } from "react";
import { CiLight } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //! explaination why we can use
  // --> we won't use unwanted state for handle the "view"
  // -->use thsi pathname.includes("monthly") like-->["/monthly_view".includes("monthly")]

  const view = location.pathname.includes("monthly") ? "Monthly" : "Daily";

  return (
    <>
      {/* Top Header */}
      <div className="sticky top-0 bg-[#111827] border-b-2 border-[#1F2937]">
        <div>
          <div
            className="flex items-center justify-between 
                         2xl:w-4/5 mx-auto w-[94%]
                        py-3"
          >
            <div className="font-bold text-[1.3rem] ">
              Daily Routine Tracker
            </div>

            <button
              className="cursor-pointer border-2 border-[#3B82F6] p-2 rounded-lg 
                       hover:bg-[#3B82F6] hover:text-white 
                       transition-all duration-300"
            >
              <CiLight className="cursor-pointer size-5 hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>

      {/* View Switch Buttons */}
      <div className=" 2xl:w-4/5 mx-auto w-[94%] mt-4 border bg-[#1F2937]  border-[#394b65] rounded-lg">
        <div>
          <div
            className="border-2 border-[#1F2937] rounded-lg p-1 
                     flex gap-1"
          >
            <button
              onClick={() => navigate("/daily_view")}
              className={`cursor-pointer flex-1
              ${view === "Daily" ? "bg-[#3B82F6]" : " bg-transparent"}
              text-white py-1 rounded-md
                       transition-all`}
            >
              Daily View
            </button>

            <button
              onClick={() => navigate("/monthly_view")}
              className={`cursor-pointer flex-1
             ${view === "Monthly" ? "bg-[#3B82F6]" : " bg-transparent"}
              text-white py-1 rounded-md
                      transition-all`}
            >
              Monthly View
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
