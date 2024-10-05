import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './utils/AuthContext.jsx'
import { QueryProvider } from './lib/react-query/QueryProvider.jsx'


createRoot(document.getElementById('root')).render(
 <BrowserRouter>
<QueryProvider>
 <AuthProvider>
   <App />
   </AuthProvider>
   </QueryProvider>
  
 </BrowserRouter>
)
