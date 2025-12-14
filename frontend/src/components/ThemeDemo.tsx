import React from 'react'
import { Card, Button, Input, Select, Tag, Alert, Typography, Space, Divider } from 'antd'
import { UserOutlined, SettingOutlined, HeartOutlined } from '@ant-design/icons'
import { useThemeStore } from '../stores/useThemeStore'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const ThemeDemo: React.FC = () => {
  const { theme } = useThemeStore()

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>主题演示页面</Title>
      <Text type="secondary">当前主题: {theme === 'dark' ? '深色模式' : '浅色模式'}</Text>
      
      <Divider />
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 卡片演示 */}
        <Card title="卡片组件演示" extra={<Button type="link">更多</Button>}>
          <Paragraph>
            这是一个卡片组件的演示。在不同主题下，卡片的背景色、边框和文字颜色会自动适配。
          </Paragraph>
          <Space>
            <Tag color="blue">蓝色标签</Tag>
            <Tag color="green">绿色标签</Tag>
            <Tag color="red">红色标签</Tag>
            <Tag color="orange">橙色标签</Tag>
          </Space>
        </Card>

        {/* 项目卡片演示 */}
        <Card className="project-card" title="项目卡片演示" extra={<Button type="primary" size="small">查看</Button>}>
          <Paragraph>
            这是一个项目卡片的演示，使用了 project-card 类名。
          </Paragraph>
          <Space>
            <Button type="default">编辑</Button>
            <Button type="primary">处理</Button>
          </Space>
        </Card>

        {/* 视频卡片演示 */}
        <Card className="clip-card" title="视频片段卡片" extra={<Button type="text">播放</Button>}>
          <Paragraph>
            这是一个视频片段卡片的演示，使用了 clip-card 类名。
          </Paragraph>
          <div style={{ 
            height: '120px', 
            background: 'var(--bg-tertiary)', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <Text type="secondary">视频缩略图区域</Text>
          </div>
        </Card>

        {/* 表单组件演示 */}
        <Card title="表单组件演示">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input 
              placeholder="请输入文本" 
              prefix={<UserOutlined />}
            />
            <Select 
              placeholder="请选择选项" 
              style={{ width: '100%' }}
            >
              <Option value="option1">选项 1</Option>
              <Option value="option2">选项 2</Option>
              <Option value="option3">选项 3</Option>
            </Select>
          </Space>
        </Card>

        {/* 按钮演示 */}
        <Card title="按钮组件演示">
          <Space wrap>
            <Button type="primary" icon={<SettingOutlined />}>
              主要按钮
            </Button>
            <Button type="default">
              默认按钮
            </Button>
            <Button type="text">
              文本按钮
            </Button>
            <Button type="link">
              链接按钮
            </Button>
            <Button type="primary" danger>
              危险按钮
            </Button>
          </Space>
        </Card>

        {/* 警告框演示 */}
        <Alert
          message="信息提示"
          description="这是一个信息提示框，用于展示主题适配效果。"
          type="info"
          showIcon
          closable
        />

        {/* 状态演示 */}
        <Card title="状态演示">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert message="成功状态" type="success" showIcon />
            <Alert message="警告状态" type="warning" showIcon />
            <Alert message="错误状态" type="error" showIcon />
          </Space>
        </Card>

        {/* 图标演示 */}
        <Card title="图标演示">
          <Space size="large">
            <UserOutlined style={{ fontSize: '24px' }} />
            <SettingOutlined style={{ fontSize: '24px' }} />
            <HeartOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
          </Space>
        </Card>

        {/* 可编辑标题演示 */}
        <Card title="可编辑标题演示">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>普通可编辑标题：</Text>
              <div className="editable-title" style={{ 
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                color: 'var(--text-primary)'
              }}>
                这是一个可编辑的标题示例 
                <span style={{ 
                  color: 'var(--accent-primary)', 
                  fontSize: '12px',
                  opacity: 0.7,
                  marginLeft: '6px'
                }}>✏️</span>
              </div>
            </div>
            <div>
              <Text strong>长标题示例：</Text>
              <div className="editable-title" style={{ 
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                color: 'var(--text-primary)'
              }}>
                这是一个比较长的可编辑标题示例，用来测试在不同主题下的显示效果和文字换行情况
                <span style={{ 
                  color: 'var(--accent-primary)', 
                  fontSize: '12px',
                  opacity: 0.7,
                  marginLeft: '6px'
                }}>✏️</span>
              </div>
            </div>
          </Space>
        </Card>

        {/* 按钮样式演示 */}
        <Card title="视频卡片按钮演示" className="clip-card">
          <Space wrap>
            <Button 
              type="text" 
              size="small"
              icon={<span>▶</span>}
              style={{
                color: 'var(--accent-primary)',
                border: '1px solid rgba(24, 144, 255, 0.3)',
                borderRadius: '6px',
                fontSize: '12px',
                height: '28px',
                padding: '0 12px',
                background: 'rgba(24, 144, 255, 0.1)'
              }}
            >
              播放
            </Button>
            <Button 
              type="text" 
              size="small"
              icon={<span>⬇</span>}
              style={{
                color: 'var(--success)',
                border: '1px solid rgba(82, 196, 26, 0.3)',
                borderRadius: '6px',
                fontSize: '12px',
                height: '28px',
                padding: '0 12px',
                background: 'rgba(82, 196, 26, 0.1)'
              }}
            >
              下载
            </Button>

          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default ThemeDemo