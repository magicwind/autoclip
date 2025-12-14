import React from 'react'
import { Button, Tooltip } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useThemeStore } from '../stores/useThemeStore'

interface ThemeToggleProps {
  size?: 'small' | 'middle' | 'large'
  type?: 'default' | 'text' | 'primary'
  className?: string
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'middle', 
  type = 'text',
  className = ''
}) => {
  const { theme, toggleTheme } = useThemeStore()
  
  const isDark = theme === 'dark'
  
  return (
    <Tooltip title={isDark ? '切换到浅色主题' : '切换到深色主题'} placement="bottom">
      <Button
        type={type}
        size={size}
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        className={`theme-toggle ${className}`}
        style={{
          borderRadius: '8px',
          height: '40px',
          width: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '16px'
        }}
      />
    </Tooltip>
  )
}

export default ThemeToggle