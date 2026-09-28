const { app, BrowserWindow, ipcMain, globalShortcut, desktopCapturer } = require('electron');
const path = require('path');

let mainWindow = null;
let isAlwaysOnTop = true;
let isHidden = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 520,
    height: 750,
    minWidth: 420,
    minHeight: 500,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      backgroundThrottling: false
    }
  });

  // Load dev URL if running with Vite, otherwise load dist/index.html
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173').catch(() => {
      setTimeout(() => {
        mainWindow.loadURL('http://localhost:5173');
      }, 1000);
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle click-through
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.setIgnoreMouseEvents(ignore, { forward: true, ...options });
    }
  });

  // Window Controls
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.handle('toggle-always-on-top', (_event, enable) => {
    if (mainWindow) {
      isAlwaysOnTop = enable !== undefined ? enable : !mainWindow.isAlwaysOnTop();
      mainWindow.setAlwaysOnTop(isAlwaysOnTop, 'screen-saver');
      return isAlwaysOnTop;
    }
    return false;
  });

  // System Desktop / Audio Sources for loopback capture
  ipcMain.handle('get-desktop-sources', async (_event, options = {}) => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ['window', 'screen'],
        thumbnailSize: { width: 150, height: 100 },
        fetchWindowIcons: true,
        ...options
      });
      return sources.map(src => ({
        id: src.id,
        name: src.name,
        thumbnail: src.thumbnail.toDataURL()
      }));
    } catch (err) {
      console.error('Error fetching desktop sources:', err);
      return [];
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Global Hotkeys
function registerShortcuts() {
  // Toggle overlay visibility (Stealth hide/show)
  globalShortcut.register('CommandOrControl+Shift+H', () => {
    if (!mainWindow) return;
    if (isHidden) {
      mainWindow.show();
      isHidden = false;
    } else {
      mainWindow.hide();
      isHidden = true;
    }
  });

  // Toggle Mute Audio Listening
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    if (mainWindow) {
      mainWindow.webContents.send('shortcut-action', 'toggle-mute');
    }
  });

  // Trigger Instant Answer / Force Listen
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (mainWindow) {
      mainWindow.webContents.send('shortcut-action', 'trigger-answer');
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  registerShortcuts();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
