import React from 'react'
import { Layout, Typography, Space } from 'antd'
import ThemeDemo from '../components/ThemeDemo'

const { Content } = Layout
const { Title } = Typography

const ThemeTestPage: React.FC = () => {
  return (
    <Content style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={1}>主题切换测试页面</Title>
        <ThemeDemo />
      </Space>
    </Content>
  )
}

export default ThemeTestPage