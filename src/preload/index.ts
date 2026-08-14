import { contextBridge } from 'electron'

// 目前使用 localStorage 在渲染进程中持久化数据，无需 IPC
// 预加载脚本保留用于未来扩展

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform
})
