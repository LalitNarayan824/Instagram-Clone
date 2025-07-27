import SmallLeftBar from "../../components/SmallLeftBar/SmallLeftBar";
import LeftBar from "../../components/LeftBar/LeftBar";
import TopBar from "../../components/TopBar/TopBar";
import BottomBar from "../../components/BottomBar/BottomBar";
import {Outlet} from 'react-router'
const HomePage = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
  {/* ✅ TopBar — only on small screens */}
  <div className="block md:hidden fixed top-0 left-0 right-0 z-50">
    <TopBar />
  </div>

  {/* ✅ BottomBar — only on small screens */}
  <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
    <BottomBar />
  </div>

  {/* ✅ Main content area */}
  <div className="flex flex-1 overflow-hidden pt-[56px] pb-[56px] md:pt-0 md:pb-0">
    {/* Show sidebars only on large screens */}
    <div className="hidden md:block">
      <SmallLeftBar />
    </div>
    <div className="hidden lg:block">
      <LeftBar />
    </div>

    {/* Outlet content (scrollable) */}
    <div className="flex-1 overflow-y-auto flex">
      <Outlet />
    </div>
  </div>
</div>


  );
};

export default HomePage;
