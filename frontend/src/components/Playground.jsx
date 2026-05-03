import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Terminal, Zap, Globe } from 'lucide-react'
import { api } from '../services/api'

const Playground = () => {
  const [apiKey, setApiKey] = useState('')
  const [endpoint, setEndpoint] = useState('pokemon/ditto')
  const [method, setMethod] = useState('GET')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    if (!apiKey) return alert('API Key Required')
    setLoading(true)
    try {
      const data = await api.proxyRequest(endpoint, apiKey)
      setResponse(data)
    } catch (err) {
      setResponse({ error: 'Gateway Connection Failed', details: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-250px)]">
      {/* Configuration */}
      <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-600 text-white rounded-xl">
            <Terminal size={20} />
          </div>
          <h3 className="text-2xl font-bold text-aurora-900">Request Builder</h3>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-aurora-500 uppercase tracking-widest ml-1">API Access Key</label>
          <input 
            type="text" 
            placeholder="mf_..." 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-white/50 border-2 border-indigo-50 rounded-2xl py-3 px-4 focus:outline-none focus:border-indigo-200"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 w-32">
            <label className="text-xs font-bold text-aurora-500 uppercase tracking-widest ml-1">Method</label>
            <select 
              value={method} 
              onChange={(e) => setMethod(e.target.value)}
              className="bg-white/50 border-2 border-indigo-50 rounded-2xl py-3 px-4 focus:outline-none focus:border-indigo-200 font-bold"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-bold text-aurora-500 uppercase tracking-widest ml-1">Endpoint Path</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-aurora-400 font-mono text-sm">/gateway/</span>
              <input 
                type="text" 
                placeholder="pokemon/charizard" 
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full bg-white/50 border-2 border-indigo-50 rounded-2xl py-3 pl-24 pr-4 focus:outline-none focus:border-indigo-200"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-900/5 p-4 rounded-2xl border-2 border-dashed border-indigo-100 flex flex-col items-center justify-center text-center">
            <Globe className="text-indigo-200 mb-2" size={48} />
            <p className="text-aurora-400 text-sm font-medium">Gateway redirects to <br/><span className="text-indigo-500 font-bold">pokeapi.co</span> or <span className="text-indigo-500 font-bold">jsonplaceholder.typicode.com</span></p>
        </div>

        <button 
            onClick={handleTest}
            disabled={loading}
            className="aurora-btn h-14"
        >
          {loading ? <Zap className="animate-spin" /> : <><Send size={18} /> Execute Request</>}
        </button>
      </div>

      {/* Response */}
      <div className="glass-panel p-8 rounded-[2.5rem] bg-slate-900 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
          <span className="text-white font-bold opacity-50 uppercase text-xs tracking-widest">Server Response</span>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/20" />)}
          </div>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
          <pre className="text-indigo-300 font-mono text-sm">
            {response ? JSON.stringify(response, null, 2) : "Wait for request execution..."}
          </pre>
        </div>
        
        {response && (
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-white/50 font-bold uppercase">
                <span>STATUS: 200 OK</span>
                <span>LATENCY: 42ms</span>
            </div>
        )}
      </div>
    </div>
  )
}

export default Playground
