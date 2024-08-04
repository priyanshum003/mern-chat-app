import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { ChatProvider } from './context/ChatContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <ChatProvider>
    <App />
    </ChatProvider>
    </AuthProvider>
)