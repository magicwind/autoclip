import { Routes, Route } from 'react-router-dom'
import { Layout, ConfigProvider, theme } from 'antd'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import SettingsPage from './pages/SettingsPage'
import Header from './components/Header'
import { useThemeInit } from './hooks/useThemeInit'
import './styles/themes.css'

const { Content } = Layout

function App() {
  console.log('🎬 App组件已加载');
  
  // 初始化主题系统
  const currentTheme = useThemeInit()
  
  // Ant Design 主题配置
  const antdTheme = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 8,
      colorBgContainer: currentTheme === 'dark' ? '#1a1a1a' : '#ffffff',
      colorBgElevated: currentTheme === 'dark' ? '#262626' : '#ffffff',
      colorBorder: currentTheme === 'dark' ? '#404040' : '#d9d9d9',
      colorText: currentTheme === 'dark' ? '#ffffff' : '#000000',
      colorTextSecondary: currentTheme === 'dark' ? '#cccccc' : '#666666',
    },
  }
  
  return (
    <ConfigProvider theme={antdTheme}>
      <Layout>
        <Header />
        <Content>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default App