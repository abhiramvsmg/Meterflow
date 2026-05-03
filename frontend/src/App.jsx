import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Key, 
  BarChart3, 
  LayoutGrid, 
  Terminal, 
  LogOut, 
  Bell,
  ShieldCheck,
  CreditCard,
  Cpu,
  Fingerprint,
  Activity
} from 'lucide-react'

import Login from './components/Login'
import ApiRegistry from './components/ApiRegistry'
import KeyManager from './components/KeyManager'
import Billing from './components/Billing'
import Playground from './components/Playground'
import { api } from './services/api'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const userData = await api.getMe()
      if (userData) {
        setUser(userData)
      } else {
        setToken(null)
      }
    } catch (err) {
      console.error("Auth sync failed")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (newToken) => {
    setToken(newToken)
    localStorage.setItem('token', newToken)
  }

  const handleLogout = () => {
    api.logout()
    setToken(null)
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-aurora-50 flex items-center justify-center">
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-indigo-100 rounded-full blur-2xl absolute -inset-0"
          />
          <Zap size={40} className="text-indigo-600 relative z-10 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!token) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-aurora-50 text-aurora-900 flex overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="neural-grid-light opacity-60 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[150px] -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-[150px] -z-0 pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-80 glass-panel m-6 rounded-[2.5rem] flex flex-col z-10 shadow-2xl shadow-indigo-100/50">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap size={24} className="text-white" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-indigo-950 m-0 leading-none">MeterFlow</h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Neural Active</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className={`sidebar-item-light ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutGrid size={20} />
            <span>Overview</span>
          </div>
          <div 
            onClick={() => setActiveTab('apis')}
            className={`sidebar-item-light ${activeTab === 'apis' ? 'active' : ''}`}
          >
            <BarChart3 size={20} />
            <span>API Registry</span>
          </div>
          <div 
            onClick={() => setActiveTab('keys')}
            className={`sidebar-item-light ${activeTab === 'keys' ? 'active' : ''}`}
          >
            <Key size={20} />
            <span>API Keys</span>
          </div>
          <div 
            onClick={() => setActiveTab('billing')}
            className={`sidebar-item-light ${activeTab === 'billing' ? 'active' : ''}`}
          >
            <CreditCard size={20} />
            <span>Billing & Subs</span>
          </div>
          <div 
            onClick={() => setActiveTab('playground')}
            className={`sidebar-item-light ${activeTab === 'playground' ? 'active' : ''}`}
          >
            <Terminal size={20} />
            <span>Live Console</span>
          </div>
        </nav>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Fingerprint size={20} className="text-indigo-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-indigo-950 truncate">{user?.full_name || 'System Operator'}</p>
                <p className="text-[10px] text-slate-500 font-bold truncate">Level 4 Access</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:text-rose-500 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> Terminate Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0">
        <header className="h-24 px-10 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
              <Cpu size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{activeTab}</h2>
              <p className="text-xs font-medium text-slate-400">Node: Localhost-8002</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-indigo-500" />
                <span className="text-xs font-bold text-slate-600">Latency: <span className="text-indigo-600">12ms</span></span>
              </div>
              <div className="w-px h-4 bg-slate-100" />
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-500" />
                <span className="text-xs font-bold text-slate-600">Secure</span>
              </div>
            </div>
            
            <button className="p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-2xl border border-slate-100 shadow-sm transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <div className="flex-grow p-10 pt-0 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto pb-20"
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <h1 className="text-4xl font-black tracking-tight mb-2">Neural Overview</h1>
                      <p className="text-slate-400 font-medium">Real-time status of your metered API infrastructure.</p>
                    </div>
                  </div>
                  <ApiRegistry token={token} />
                </div>
              )}
              {activeTab === 'apis' && <ApiRegistry token={token} />}
              {activeTab === 'keys' && <KeyManager token={token} />}
              {activeTab === 'billing' && <Billing token={token} />}
              {activeTab === 'playground' && <Playground token={token} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default App
