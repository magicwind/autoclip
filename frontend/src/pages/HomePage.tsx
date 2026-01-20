import React, { useState, useEffect, useCallback } from 'react'
import { 
  Layout, 
  Typography, 
  Select, 
  Spin, 
  Empty,
  message,
  Pagination,
  Input
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import FileUpload from '../components/FileUpload'
import BilibiliDownload from '../components/BilibiliDownload'

import { projectApi } from '../services/api'
import { Project, useProjectStore } from '../store/useProjectStore'
import { useProjectPolling } from '../hooks/useProjectPolling'
// import { useWebSocket, WebSocketEventMessage } from '../hooks/useWebSocket'  // 已禁用WebSocket系统

const { Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { projects, setProjects, deleteProject, loading, setLoading } = useProjectStore()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'upload' | 'bilibili'>('upload')
  const [searchText, setSearchText] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)

  // WebSocket连接已禁用，使用新的简化进度系统
  // const handleWebSocketMessage = (message: WebSocketEventMessage) => {
  //   console.log('HomePage收到WebSocket消息:', message)
  //   
  //   switch (message.type) {
  //     case 'task_progress_update':
  //       console.log('📊 收到任务进度更新:', message)
  //       // 刷新项目列表以获取最新状态
  //       loadProjects()
  //       break
  //       
  //     case 'project_update':
  //       console.log('📊 收到项目更新:', message)
  //       // 刷新项目列表以获取最新状态
  //       loadProjects()
  //       break
  //       
  //     default:
  //       console.log('忽略未知类型的WebSocket消息:', (message as any).type)
  //   }
  // }

  // const { isConnected, syncSubscriptions } = useWebSocket({
  //   userId: 'homepage-user',
  //   onMessage: handleWebSocketMessage
  // })

  // 使用项目轮询Hook
  const { refreshNow } = useProjectPolling({
    onProjectsUpdate: async (updatedProjects) => {
      // 当轮询检测到更新时，重新加载当前页面的项目
      await loadProjects()
    },
    enabled: true,
    interval: 10000 // 10秒轮询一次
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async (page: number = currentPage, size: number = pageSize, status: string = statusFilter, search: string = searchText) => {
    setLoading(true)
    try {
      // 从后端API获取真实项目数据
      const response = await projectApi.getProjects(page, size, status, search)
      console.log('API Response:', response) // Debug log
      setProjects(response.items || [])
      setTotal(response.total || 0)
      setCurrentPage(response.page || page)
      setPageSize(response.size || size)
      setTotalPages(response.pages || 0)
      console.log('Pagination state:', { total: response.total, page: response.page, size: response.size }) // Debug log
    } catch (error) {
      message.error('加载项目失败')
      console.error('Load projects error:', error)
      // 如果API调用失败，设置空数组
      setProjects([])
      setTotal(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  // 使用集合差异对齐订阅项目WebSocket主题
  // WebSocket订阅已禁用，使用新的简化进度系统
  // useEffect(() => {
  //   if (isConnected && projects.length > 0) {
  //     const desiredChannels = projects.map(project => `project_${project.id}`)
  //     console.log('同步订阅项目频道:', desiredChannels)
  //     syncSubscriptions(desiredChannels)
  //   } else if (isConnected && projects.length === 0) {
  //     // 如果没有项目，清空所有订阅
  //     console.log('清空所有项目订阅')
  //     syncSubscriptions([])
  //   }
  // }, [isConnected, projects, syncSubscriptions])

  const handleDeleteProject = async (id: string) => {
    try {
      await projectApi.deleteProject(id)
      deleteProject(id)
      message.success('项目删除成功')
      // 重新加载当前页
      await loadProjects()
    } catch (error) {
      message.error('删除项目失败')
      console.error('Delete project error:', error)
    }
  }

  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize
    setCurrentPage(page)
    if (size && size !== pageSize) {
      setPageSize(newPageSize)
    }
    loadProjects(page, newPageSize, statusFilter, searchText)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1) // 重置到第一页
    loadProjects(1, pageSize, value, searchText)
  }

  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearchText(value)
      setCurrentPage(1) // 重置到第一页
      loadProjects(1, pageSize, statusFilter, value)
    }, 500),
    [pageSize, statusFilter]
  )

  // 简单的防抖函数
  function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout
    return ((...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }) as T
  }

  const handleRetryProject = async (projectId: string) => {
    try {
      // 查找项目状态
      const project = projects.find(p => p.id === projectId)
      if (!project) {
        message.error('项目不存在')
        return
      }
      
      // 统一使用retryProcessing API，它会自动处理视频文件不存在的情况
      await projectApi.retryProcessing(projectId)
      message.success('已开始重试处理项目')
      
      await loadProjects()
    } catch (error) {
      message.error('重试失败，请稍后再试')
      console.error('Retry project error:', error)
    }
  }

  const handleStartProcessing = async (projectId: string) => {
    try {
      await projectApi.startProcessing(projectId)
      message.success('项目已开始处理，请稍等片刻查看进度')
      // 立即刷新项目列表以显示最新状态
      setTimeout(async () => {
        try {
          await loadProjects()
        } catch (refreshError) {
          console.error('Failed to refresh after starting processing:', refreshError)
        }
      }, 1000)
    } catch (error: unknown) {
      const errorMessage = (error as { userMessage?: string })?.userMessage || '启动处理失败'
      message.error(errorMessage)
      console.error('Start processing error:', error)
      
      // 如果是超时错误，提示用户项目可能仍在处理
      if ((error as { code?: string; message?: string })?.code === 'ECONNABORTED' || (error as { code?: string; message?: string })?.message?.includes('timeout')) {
        message.info('请求超时，但项目可能已开始处理，请查看项目状态', 5)
        // 延迟刷新项目列表
        setTimeout(async () => {
          try {
            await loadProjects()
          } catch (refreshError) {
            console.error('Failed to refresh after timeout:', refreshError)
          }
        }, 3000)
      }
    }
  }

  const handleProjectCardClick = (project: Project) => {
    // 导入中状态的项目不能点击进入详情页
    if (project.status === 'pending') {
      message.warning('项目正在导入中，请稍后再查看详情')
      return
    }
    
    // 其他状态可以正常进入详情页
    navigate(`/project/${project.id}`)
  }

  return (
    <Layout style={{ 
      minHeight: '100vh'
    }}>
      <Content style={{ padding: '40px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* 文件上传区域 */}
          <div style={{ 
            marginBottom: '48px',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '800px',
              background: 'var(--bg-secondary)',
              borderRadius: '16px',
              border: '1px solid rgba(24, 144, 255, 0.2)',
              padding: '20px',
              boxShadow: '0 8px 32px var(--shadow-light)'
            }}>
              {/* 标签页切换 */}
              <div style={{
                display: 'flex',
                marginBottom: '16px',
                borderRadius: '8px',
                background: 'var(--bg-tertiary)',
                padding: '3px'
              }}>
                 <button 
                   className={`homepage-tab-button ${activeTab === 'bilibili' ? 'active' : ''}`}
                   onClick={() => setActiveTab('bilibili')}
                 >
                   📺 链接导入
                 </button>
                <button 
                   className={`homepage-tab-button ${activeTab === 'upload' ? 'active' : ''}`}
                   onClick={() => setActiveTab('upload')}
                 >
                   📁 文件导入
                 </button>
              </div>
              
              {/* 内容区域 */}
              <div>
                {activeTab === 'bilibili' && (
                  <BilibiliDownload onDownloadSuccess={async (projectId: string) => {
                    // 处理完成后刷新项目列表
                    await loadProjects()
                    // 不再显示重复的toast提示，BilibiliDownload组件已经显示了统一的提示
                  }} />
                )}
                {activeTab === 'upload' && (
                  <FileUpload onUploadSuccess={async (projectId: string) => {
                    // 处理完成后刷新项目列表
                    await loadProjects()
                    message.success('项目创建成功，正在处理中...')
                  }} />
                )}
              </div>
            </div>
          </div>

          {/* 项目管理区域 */}
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '24px',
            border: '1px solid rgba(24, 144, 255, 0.15)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px var(--shadow-light)'
          }}>
            {/* 项目列表标题区域 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Title 
                  level={2} 
                  style={{ 
                    margin: 0,
                    color: 'var(--text-primary)',
                    fontSize: '24px',
                    fontWeight: 600
                  }}
                >
                  我的项目
                </Title>
                <div style={{
                  padding: '8px 16px',
                  background: 'rgba(24, 144, 255, 0.1)',
                  borderRadius: '20px',
                  border: '1px solid rgba(24, 144, 255, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Text style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '14px' }}>
                    共 {total} 个项目
                  </Text>
                </div>
              </div>
              
              {/* 搜索和筛选区域 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '12px'
              }}>
                <Input.Search
                  placeholder="搜索项目名称..."
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onSearch={handleSearchChange}
                  style={{ 
                    width: '200px',
                    height: '36px'
                  }}
                  prefix={<SearchOutlined style={{ color: 'var(--text-tertiary)' }} />}
                  allowClear
                />
                <Select
                  placeholder="选择状态"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  style={{ 
                    minWidth: '140px',
                    height: '36px',
                    fontSize: '14px'
                  }}
                  suffixIcon={
                    <span style={{ 
                      color: 'var(--text-tertiary)', 
                      fontSize: '10px',
                      transition: 'all 0.2s ease'
                    }}>
                      ⌄
                    </span>
                  }
                  allowClear
                >
                  <Option value="all">全部状态</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="processing">处理中</Option>
                  <Option value="error">处理失败</Option>
                </Select>
              </div>
            </div>

            {/* 项目列表内容 */}
             <div>
               {loading ? (
                 <div style={{ 
                   textAlign: 'center', 
                   padding: '60px 0',
                   background: 'var(--bg-tertiary)',
                   borderRadius: '12px',
                   border: '1px solid var(--border-secondary)'
                 }}>
                   <Spin size="large" />
                   <div style={{ 
                     marginTop: '20px', 
                     color: 'var(--text-secondary)',
                     fontSize: '16px'
                   }}>
                     正在加载项目列表...
                   </div>
                 </div>
               ) : projects.length === 0 ? (
                 <div style={{
                   textAlign: 'center',
                   padding: '60px 0',
                   background: 'var(--bg-tertiary)',
                   borderRadius: '12px',
                   border: '1px solid var(--border-secondary)'
                 }}>
                   <Empty
                     image={Empty.PRESENTED_IMAGE_SIMPLE}
                     description={
                       <div>
                         <Text type="secondary">
                           {total === 0 ? '还没有项目，请使用上方的导入区域创建第一个项目' : '没有找到匹配的项目'}
                         </Text>
                       </div>
                     }
                   />
                 </div>
               ) : (
                 <>
                   <div style={{
                     display: 'grid',
                     gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                     gap: '16px',
                     justifyContent: 'start',
                     padding: '6px 0',
                     marginBottom: '24px'
                   }}>
                     {projects.map((project: Project) => (
                       <div key={project.id} style={{ position: 'relative', zIndex: 1 }}>
                         <ProjectCard 
                           project={project} 
                           onDelete={handleDeleteProject}
                           onRetry={() => handleRetryProject(project.id)}
                           onClick={() => handleProjectCardClick(project)}
                         />
                       </div>
                     ))}
                   </div>
                   
                   {/* Debug info - remove this later */}
                   <div style={{ 
                     padding: '10px', 
                     background: '#f0f0f0', 
                     margin: '10px 0',
                     fontSize: '12px',
                     borderRadius: '4px'
                   }}>
                     Debug: total={total}, currentPage={currentPage}, pageSize={pageSize}, projects.length={projects.length}
                   </div>
                   
                   {/* 分页组件 */}
                   {total > 0 && (
                     <div style={{
                       display: 'flex',
                       justifyContent: 'center',
                       alignItems: 'center',
                       padding: '20px 0',
                       borderTop: '1px solid var(--border-secondary)'
                     }}>
                       <Pagination
                         current={currentPage}
                         total={total}
                         pageSize={pageSize}
                         onChange={handlePageChange}
                         onShowSizeChange={handlePageChange}
                         showSizeChanger
                         showQuickJumper
                         showTotal={(total, range) => 
                           `第 ${range[0]}-${range[1]} 项，共 ${total} 项`
                         }
                         pageSizeOptions={['10', '20', '50', '100']}
                         style={{
                           '& .ant-pagination-item': {
                             borderRadius: '6px',
                           },
                           '& .ant-pagination-item-active': {
                             background: 'var(--accent-primary)',
                             borderColor: 'var(--accent-primary)',
                           }
                         }}
                       />
                     </div>
                   )}
                 </>
               )}
             </div>
           </div>
         </div>
      </Content>
    </Layout>
  )
}

export default HomePage