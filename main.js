'use strict';

const {app, Menu, shell, BrowserWindow} = require('electron');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Modules to control application life and create native browser window
app.once('ready', function() {
    var template;
    if (process.platform == 'darwin') {
        template = [
            {
                label: 'VA.Chat',
                submenu: [
                    {
                        label: 'About VA.Chat',
                        selector: 'orderFrontStandardAboutPanel:'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Hide VA.Chat',
                        accelerator: 'Command+H',
                        selector: 'hide:'
                    },
                    {
                        label: 'Hide Others',
                        accelerator: 'Command+Shift+H',
                        selector: 'hideOtherApplications:'
                    },
                    {
                        label: 'Show All',
                        selector: 'unhideAllApplications:'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Quit',
                        accelerator: 'Command+Q',
                        click: function() {
                            app.quit();
                        }
                    },
                ]
            }
        ];
    } else {
        template = [
            {
                label: '&File',
                submenu: [
                    {
                        label: '&Open',
                        accelerator: 'Ctrl+O',
                    },
                    {
                        label: '&Close',
                        accelerator: 'Ctrl+W',
                        click: function() {
                            var focusedWindow = BrowserWindow.getFocusedWindow();
                            if (focusedWindow) {
                                focusedWindow.close();
                            }
                        }
                    },
                ]
            }
        ];
    }

    var appmenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(appmenu);
});


function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        resizable: false,
        width: 600,
        height: 700,
        title: "VA.Chat",
        frame: true,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegration: false
        }
    })
    mainWindow.loadURL('http://localhost:3000');

    //mainWindow.webContents.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})
