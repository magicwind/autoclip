import { useEffect } from 'react'
import { useThemeStore } from '../stores/useThemeStore'

export const useThemeInit = () => {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    // 确保 HTML 根元素有正确的主题属性
    document.documentElement.setAttribute('data-theme', theme)
    
    // 检查是否是首次访问，如果是则根据系统偏好设置主题
    const isFirstVisit = !localStorage.getItem('autoclip-theme-storage')
    if (isFirstVisit) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [theme, setTheme])

  return theme
}