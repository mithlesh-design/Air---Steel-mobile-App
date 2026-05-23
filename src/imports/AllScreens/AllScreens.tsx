import imgLibrary from "./ab25753fef1b080e4d4bb5a00919c70f022d1fbf.png";
import imgArchives from "./f8cd1bb32753fc49cdf41a2d96c01f6fa8b87a43.png";
import imgHome from "./738820e687f092e14dd307a8cf22ae42642ae896.png";
import imgProfile from "./6397c9e9e856331515cb3bbcbb56076468464c61.png";
import imgAccessFile from "./63599a1ba7edaa2b1668bcbfb9ddb469df14a4ba.png";
import imgMenu from "./c73996881b1e31f14666c32191ef0f0960f93118.png";
import imgScreenshot20260506At15253Pm1 from "./f3fc49ed3517baddd329dc7d51e7c5478e81cc1a.png";
import imgScreenshot20260506At15331Pm1 from "./fb395a784ae4a45071ff8179b5ac6e7aae4ecb74.png";
import imgLogin from "./f09b25eb7a266337485389a920bd1724effb9d69.png";
import imgSignup from "./31b393296989ed14f0faeaab8ebd9644d58df0a7.png";
import imgSignupFill from "./8caa06c386f088bdf2cab1eb47fd10263d9aab3c.png";
import imgE6IndiaLogo1 from "./799a4c4258f135fe583a1c66fdc10b8fd21a5591.png";

function Read() {
  return (
    <div className="absolute contents left-[3934px] top-[5px]" data-name="Read">
      <div className="absolute h-[664px] left-[3934px] top-[5px] w-[377px]" data-name="Screenshot 2026-05-06 at 1.52.53 PM 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260506At15253Pm1} />
      </div>
      <div className="absolute h-[287px] left-[3935px] top-[633px] w-[377px]" data-name="Screenshot 2026-05-06 at 1.53.31 PM 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[230.66%] left-0 max-w-none top-[-130.66%] w-full" src={imgScreenshot20260506At15331Pm1} />
        </div>
      </div>
    </div>
  );
}

function Component1Splash() {
  return (
    <div className="absolute bg-[#161616] h-[844px] left-0 overflow-clip top-0 w-[390px]" data-name="1 - Splash">
      <div className="absolute h-[117px] left-[50px] top-[364px] w-[290px]" data-name="E6_India_Logo 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgE6IndiaLogo1} />
      </div>
    </div>
  );
}

export default function AllScreens() {
  return (
    <div className="relative size-full" data-name="All Screens">
      <div className="absolute h-[1472px] left-[2592px] top-[5px] w-[375px]" data-name="Library">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[117.66%] left-[-258.13%] max-w-none top-[-13.18%] w-[472.53%]" src={imgLibrary} />
        </div>
      </div>
      <div className="absolute h-[2808px] left-[2160px] top-[5px] w-[377px]" data-name="Archives">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[109.26%] left-[-257.03%] max-w-none top-[-6.91%] w-[470.03%]" src={imgArchives} />
        </div>
      </div>
      <div className="absolute h-[2112px] left-[1730px] top-[5px] w-[375px]" data-name="Home">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[112.36%] left-[-258.13%] max-w-none top-[-9.23%] w-[472.53%]" src={imgHome} />
        </div>
      </div>
      <div className="absolute h-[1404px] left-[3022px] top-[5px] w-[376px]" data-name="Profile">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[118.8%] left-[-257.71%] max-w-none top-[-13.96%] w-[471.28%]" src={imgProfile} />
        </div>
      </div>
      <div className="absolute h-[668px] left-[3434px] top-[5px] w-[379px]" data-name="Access File">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAccessFile} />
      </div>
      <div className="absolute h-[667px] left-[3434px] top-[707px] w-[376px]" data-name="Menu">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMenu} />
      </div>
      <Read />
      <div className="absolute h-[665px] left-[448px] top-0 w-[373px]" data-name="Login">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogin} />
      </div>
      <div className="absolute h-[662px] left-[879px] top-[4px] w-[374px]" data-name="Signup">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSignup} />
      </div>
      <div className="absolute h-[665px] left-[1311px] top-[4px] w-[379px]" data-name="Signup fill">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSignupFill} />
      </div>
      <Component1Splash />
    </div>
  );
}