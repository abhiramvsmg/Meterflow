import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Globe, Trash2, ExternalLink, ShieldCheck, Activity } from 'lucide-react'
import { api } from '../services/api'

const ApiRegistry = ({ token }) => {
  const [apis, setApis] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newApi, setNewApi] = useState({ name: '', base_url: '', description: '' })

  useEffect(() => {
    fetchApis()
  }, [])

  const fetchApis = async () => {
    try {
      const data = await api.getApis(token)
      setApis(data)
    } catch (err) {
      console.error("Failed to fetch APIs", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const registered = await api.registerApi(newApi.name, newApi.base_url, newApi.description, token)
      setApis([...apis, registered])
      setNewApi({ name: '', base_url: '', description: '' })
      setShowAdd(false)
    } catch (err) {
      alert("Failed to register API")
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteApi(id, token)
      setApis(apis.filter(a => a.id !== id))
    } catch (err) {
      alert("Failed to delete API")
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-aurora-900 tracking-tight">API Registry</h3>
          <p className="text-aurora-500 text-sm font-medium">Connect and proxy your custom backend services</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="aurora-btn"
        >
          {showAdd ? 'Cancel' : <><Plus size={20} /> Register New API</>}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleRegister} className="glass-panel p-8 rounded-[2.5rem] bg-indigo-50/30 border-indigo-200/50 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-aurora-500 uppercase tracking-widest ml-1">Service Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Inventory Microservice" 
                  value={newApi.name}
                  onChange={(e) => setNewApi({...newApi, name: e.target.value})}
                  className="bg-white border-2 border-indigo-50 rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-200 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-aurora-500 uppercase tracking-widest ml-1">Base URL</label>
                <input 
                  type="url" 
                  placeholder="https://api.yourdomain.com/v1" 
                  value={newApi.base_url}
                  onChange={(e) => setNewApi({...newApi, base_url: e.target.value})}
                  className="bg-white border-2 border-indigo-50 rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-200 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-aurora-500 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  placeholder="What does this API do?" 
                  value={newApi.description}
                  onChange={(e) => setNewApi({...newApi, description: e.target.value})}
                  className="bg-white border-2 border-indigo-50 rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-200 transition-all h-24 resize-none"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="aurora-btn px-12">
                  Complete Registration
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apis.map((api) => (
          <motion.div 
            key={api.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 rounded-[2.5rem] relative group border-l-4 border-l-indigo-500 hover:shadow-2xl transition-all"
          >
            <div className="ai-scan-line opacity-10 group-hover:opacity-30 transition-opacity" />
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-aurora-900 leading-tight">{api.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[9px] font-black uppercase rounded-md flex items-center gap-1">
                      <ShieldCheck size={10} /> Active
                    </span>
                    <span className="text-[10px] text-aurora-400 font-bold uppercase tracking-widest">ID: {api.id}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(api.id)}
                className="p-3 hover:bg-red-50 rounded-2xl text-aurora-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <p className="text-aurora-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
              {api.description || "No description provided for this service."}
            </p>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-aurora-400 uppercase tracking-widest">Target Endpoint</span>
                <div className="bg-slate-900 p-4 rounded-2xl flex items-center justify-between group/url overflow-hidden border border-slate-800">
                  <span className="text-indigo-300 font-mono text-xs truncate mr-4">{api.base_url}</span>
                  <ExternalLink size={14} className="text-indigo-500 shrink-0 opacity-50 group-hover/url:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 flex flex-col gap-1">
                  <span className="text-[9px] font-black text-indigo-400 uppercase">Health Check</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-aurora-800">Operational</span>
                  </div>
                </div>
                <div className="flex-1 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 flex flex-col gap-1">
                  <span className="text-[9px] font-black text-indigo-400 uppercase">Latency</span>
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-indigo-500" />
                    <span className="text-xs font-bold text-aurora-800">12ms</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {apis.length === 0 && !loading && (
          <div className="md:col-span-2 py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Globe className="text-indigo-200" size={40} />
            </div>
            <h4 className="text-xl font-bold text-aurora-900">No APIs registered yet</h4>
            <p className="text-aurora-400 max-w-sm mt-2 font-medium">Connect your backend services to start generating proxy keys and tracking usage.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApiRegistry
