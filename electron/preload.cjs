const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window management
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
  toggleAlwaysOnTop: (enable) => ipcRenderer.invoke('toggle-always-on-top', enable),
  setIgnoreMouseEvents: (ignore, options) => ipcRenderer.send('set-ignore-mouse-events', ignore, options),
  
  // Desktop capturer for loopback system audio
  getDesktopSources: (options) => ipcRenderer.invoke('get-desktop-sources', options),
  
  // App info
  isElectron: true,
  
  // Shortcut listeners from main process
  onGlobalShortcut: (callback) => {
    const handler = (_event, action) => callback(action);
    ipcRenderer.on('shortcut-action', handler);
    return () => ipcRenderer.removeListener('shortcut-action', handler);
  }
});
