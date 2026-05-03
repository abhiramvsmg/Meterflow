import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, ShieldCheck, Mail, Lock, RefreshCw } from 'lucide-react'
import { api } from '../services/api'

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fullName, setFullName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        const data = await api.login(email, password)
        if (data.access_token) {
          onLogin(data.access_token)
        } else {
          setError(data.detail || 'Access Denied: Invalid Credentials')
        }
      } else {
        const data = await api.register(email, password, fullName)
        if (data.message) {
          setIsLogin(true)
          alert('Registration successful! Initializing access protocols.')
        } else {
          setError(data.detail || 'Registration Protocol Failed')
        }
      }
    } catch (err) {
      setError('Neural Link Refused. Ensure backend is active.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="neural-grid opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass panel p-10 border-white/10 shadow-2xl shadow-black/40">
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-indigo-800 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-6"
            >
              <Zap size={40} fill="currentColor" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white tracking-tight">MeterFlow</h2>
            <div className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-bold mt-2">Neural Access Terminal</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Operational Identity (Name)" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-primary transition-all text-sm text-white placeholder:text-slate-500"
                  required
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="Neural ID (Email)" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-primary transition-all text-sm text-white placeholder:text-slate-500"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Security Key (Password)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-primary transition-all text-sm text-white placeholder:text-slate-500"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-400 text-[10px] font-bold text-center bg-rose-500/10 py-2 rounded-lg border border-rose-500/20"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full h-14 text-sm font-bold mt-4 flex items-center justify-center gap-3"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : (isLogin ? 'Establish Link' : 'Initialize Protocol')}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-400 text-xs hover:text-white transition-colors"
            >
              {isLogin ? "No identity? Initialize here" : "Return to Link Terminal"}
            </button>
          </div>

          <div className="mt-8 flex justify-center gap-4 opacity-30 grayscale contrast-200">
             <ShieldCheck size={16} className="text-white" />
             <div className="w-px h-4 bg-white/20" />
             <Zap size={16} className="text-white" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
