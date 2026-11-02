import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, BatteryMedium, Signal, ChevronLeft, RotateCcw, Monitor } from 'lucide-react';

interface DeviceSimulatorProps {
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({ children }) => {
  const { platform, setPlatform } = useApp();

  if (platform === 'web') {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  const isAndroid = platform === 'android';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900/10 dark:bg-slate-950/40 py-6 px-4 flex flex-col items-center justify-start overflow-y-auto">
      {/* Device Frame Top Controls */}
      <div className="mb-4 flex items-center justify-between w-full max-w-[430px] px-2 text-xs text-slate-500">
        <span className="font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          {isAndroid ? 'Android 14 (Flutter Material 3)' : 'iOS 18 (Flutter Cupertino)'}
        </span>
        <button
          onClick={() => setPlatform('web')}
          className="hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 text-xs font-medium"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Exit Frame</span>
        </button>
      </div>

      {/* Realistic Device Frame */}
      <div 
        className={`relative w-full max-w-[410px] min-h-[820px] bg-slate-900 rounded-[50px] p-3 shadow-2xl shadow-slate-950/50 border-[6px] ${
          isAndroid ? 'border-slate-700' : 'border-slate-800'
        }`}
      >
        {/* Physical buttons simulation */}
        <div className="absolute -left-[9px] top-28 w-[3px] h-12 bg-slate-700 rounded-l-sm"></div>
        <div className="absolute -left-[9px] top-44 w-[3px] h-12 bg-slate-700 rounded-l-sm"></div>
        <div className="absolute -right-[9px] top-32 w-[3px] h-16 bg-slate-700 rounded-r-sm"></div>

        {/* Screen Bezel & Container */}
        <div className="relative w-full h-[800px] bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden flex flex-col">
          
          {/* Status Bar */}
          <div className="h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 select-none shrink-0 z-40 border-b border-slate-100 dark:border-slate-800/40">
            {/* Clock */}
            <span>10:28</span>

            {/* iOS Dynamic Island or Android Camera Punch-Hole */}
            {isAndroid ? (
              <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-700"></div>
            ) : (
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2">
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
              </div>
            )}

            {/* Connectivity Icons */}
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="text-[10px] tracking-tight">MTN ZM</span>
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Child App Canvas with Smooth Native Scroll */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* Bottom System Bar */}
          <div className="h-5 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 z-40">
            {isAndroid ? (
              <div className="flex items-center justify-center gap-12 w-full text-slate-400">
                <div className="w-3 h-3 border-l-2 border-b-2 border-slate-400 rotate-45"></div>
                <div className="w-3 h-3 rounded-full border-2 border-slate-400"></div>
                <div className="w-3 h-3 border-2 border-slate-400"></div>
              </div>
            ) : (
              <div className="w-32 h-1 bg-slate-800 dark:bg-slate-200 rounded-full opacity-60"></div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
