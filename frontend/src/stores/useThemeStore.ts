import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // 默认深色主题
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        
        // 更新 HTML 根元素的 data-theme 属性
        document.documentElement.setAttribute('data-theme', newTheme)
      },
      setTheme: (theme: Theme) => {
        set({ theme })
        document.documentElement.setAttribute('data-theme', theme)
      }
    }),
    {
      name: 'autoclip-theme-storage',
      onRehydrateStorage: () => (state) => {
        // 在状态恢复后设置 HTML 属性
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme)
        }
      }
    }
  )
)