import React from "react";

import LeftSideBarServerComponent from "@/components/shared/server/LeftSideBar";
import RightSideBarServer from "@/components/shared/server/RightSideBarServer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="max-w-screen min-h-screen ">
        <main className="grid grid-cols-12 min-h-full w-full max-w-[90%] ml-auto  max-sm:max-w-[100%] ">
          {/* Left Sidebar: Visible on md+ screens */}
          <div className="col-span-2 sticky top-0  border-gray-300 h-screen max-h-screen lg:pr-4">
            <LeftSideBarServerComponent />
          </div>

          {/* Main Content Area: Adjusts for full width on smaller screens */}
          <section className="col-span-10  lg:col-span-6 w-full min-h-full border-r border-l border-gray-400">
            {children}
          </section>

          {/* Right Sidebar: Visible on lg+ screens */}
          <div className="hidden lg:block lg:col-span-3  ">
            <RightSideBarServer />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
