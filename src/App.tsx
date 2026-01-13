import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PipelinePage from './pages/PipelinePage'
import PipelineEmbedPage from './pages/PipelineEmbedPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/pipeline/embed" element={<PipelineEmbedPage />} />
        <Route path="/" element={<PipelinePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

