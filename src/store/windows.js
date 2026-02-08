import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useWindowStore = create(
  immer((set, get) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return; // Safety check
        
        win.isOpen = true;
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        state.nextZIndex++;
      }),

    closeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return; // Safety check
        
        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
      }),

    focusWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win || !win.isOpen) return; // Only focus open windows
        
        win.zIndex = state.nextZIndex++;
      }),

    minimizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        
        win.isMinimized = true;
      }),

    maximizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        
        win.isMaximized = !win.isMaximized;
        // Reset position and size if maximizing
        if (win.isMaximized) {
          win.position = { x: 0, y: 0 };
          win.size = { width: '100%', height: '100%' };
        } else {
          // Restore to default size/position
          win.position = win.defaultPosition || { x: 100, y: 100 };
          win.size = win.defaultSize || { width: 600, height: 400 };
        }
      }),

    updateWindowPosition: (windowKey, position) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win || win.isMaximized) return; // Don't update if maximized
        
        win.position = position;
      }),

    updateWindowSize: (windowKey, size) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win || win.isMaximized) return; // Don't update if maximized
        
        win.size = size;
      }),

    // Utility getter
    getActiveWindows: () => {
      const { windows } = get();
      return Object.entries(windows)
        .filter(([_, win]) => win.isOpen)
        .sort((a, b) => b[1].zIndex - a[1].zIndex);
    },

    // Reset all windows
    resetAllWindows: () =>
      set((state) => {
        Object.values(state.windows).forEach((win) => {
          win.isOpen = false;
          win.zIndex = INITIAL_Z_INDEX;
          win.data = null;
          win.isMinimized = false;
          win.isMaximized = false;
          if (win.defaultPosition) win.position = win.defaultPosition;
          if (win.defaultSize) win.size = win.defaultSize;
        });
        state.nextZIndex = INITIAL_Z_INDEX + 1;
      }),
  }))
);

export default useWindowStore;