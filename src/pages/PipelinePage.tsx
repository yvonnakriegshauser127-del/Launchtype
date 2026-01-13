import { Layout } from 'antd'
import Pipeline from '../components/Pipeline'

const { Header, Content } = Layout

function PipelinePage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', color: '#fff', padding: '0 24px' }}>
        <h1 style={{ color: '#fff', margin: 0, lineHeight: '64px' }}>Pipeline Tool</h1>
      </Header>
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <Pipeline />
      </Content>
    </Layout>
  )
}

export default PipelinePage

