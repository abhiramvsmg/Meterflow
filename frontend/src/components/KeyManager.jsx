import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Plus, Key, Trash2, CheckCircle2 } from 'lucide-react'
import { api } from '../services/api'

const KeyManager = ({ token }) => {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [apis, setApis] = useState([])
  const [selectedApiId, setSelectedApiId] = useState('')
  const [copied, setCopied] = useState(null)

  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchKeys()
    fetchApis()
  }, [])

  const fetchKeys = async () => {
    try {
      const data = await api.getKeys(token)
      setKeys(data)
    } catch (err) {
      console.error("Failed to fetch keys", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchApis = async () => {
    try {
      const data = await api.getApis(token)
      setApis(data)
    } catch (err) {
      console.error("Failed to fetch APIs", err)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name) return
    try {
      const newKey = await api.createKey(name, 1000, token, selectedApiId || null)
      setKeys([...keys, newKey])
      setName('')
      setSelectedApiId('')
    } catch (err) {
      alert("Failed to create key")
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteKey(id, token)
      setKeys(keys.filter(k => k.id !== id))
      setDeletingId(null)
    } catch (err) {
      alert("Failed to delete key")
    }
  }

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black text-aurora-900 tracking-tight">API Access Keys</h3>
          <p className="text-aurora-500 text-sm font-medium">Manage your secure access credentials</p>
        </div>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2">
          <input 
            type="text" 
            placeholder="Key Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/80 border-2 border-indigo-50 rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-200 transition-all w-full sm:w-48"
          />
          <select
            value={selectedApiId}
            onChange={(e) => setSelectedApiId(e.target.value)}
            className="bg-white/80 border-2 border-indigo-50 rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-200 transition-all w-full sm:w-48 text-aurora-500 font-medium"
          >
            <option value="">Global (Default)</option>
            {apis.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button type="submit" className="aurora-btn whitespace-nowrap">
            <Plus size={20} /> Create Key
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode='popLayout'>
          {keys.map((k) => (
            <motion.div 
              key={k.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`glass-panel p-6 rounded-[2rem] relative overflow-hidden group border-t-2 ${k.current_usage > k.usage_limit * 0.8 ? 'border-t-orange-400' : 'border-t-indigo-500/30'}`}
            >
              <div className="ai-scan-line" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Key size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-aurora-900 leading-tight">{k.name}</span>
                    <span className="text-[10px] font-bold text-aurora-400 uppercase tracking-widest">ID: {k.id}</span>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button 
                    onClick={() => copyToClipboard(k.key)}
                    className="p-2.5 hover:bg-indigo-50 rounded-xl text-aurora-400 hover:text-indigo-600 transition-all active:scale-90"
                    title="Copy to clipboard"
                  >
                    {copied === k.key ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                  
                  {deletingId === k.id ? (
                    <div className="flex gap-1 animate-in fade-in slide-in-from-right-2">
                      <button 
                        onClick={() => handleDelete(k.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setDeletingId(k.id)}
                      className="p-2.5 hover:bg-red-50 rounded-xl text-aurora-400 hover:text-red-500 transition-all active:scale-90"
                      title="Delete key"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/5 backdrop-blur-sm border border-indigo-100/50 p-4 rounded-2xl mb-6 font-mono text-xs text-aurora-700 flex items-center justify-between group-hover:border-indigo-200 transition-colors">
                <span className="truncate mr-2">{copied === k.key ? k.key : '••••••••••••••••••••••••'}</span>
                {copied !== k.key && <span className="text-[9px] opacity-40 uppercase font-bold tracking-tighter">Encrypted</span>}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-aurora-400 uppercase tracking-widest">Monthly Quota</span>
                  <div className="text-right">
                    <span className="text-sm font-black text-aurora-900">{(k.current_usage / k.usage_limit * 100).toFixed(1)}%</span>
                    <span className="text-[10px] text-aurora-400 font-bold ml-1 uppercase">Used</span>
                  </div>
                </div>
                
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-white">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((k.current_usage / k.usage_limit) * 100, 100)}%` }}
                    className={`h-full rounded-full transition-colors duration-500 ${
                      k.current_usage > k.usage_limit * 0.9 ? 'bg-red-500' : 
                      k.current_usage > k.usage_limit * 0.7 ? 'bg-orange-500' : 
                      'bg-indigo-500'
                    }`}
                  />
                </div>
                
                <div className="flex justify-between text-[9px] font-bold text-aurora-400">
                  <span>{k.current_usage.toLocaleString()} REQS</span>
                  <span>{k.usage_limit.toLocaleString()} LIMIT</span>
                </div>
              </div>

              {/* Decorative AI Glow */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-500/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default KeyManager
