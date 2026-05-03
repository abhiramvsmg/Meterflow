import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Zap, CheckCircle2, DollarSign } from 'lucide-react'
import { api } from '../services/api'

const Billing = ({ token }) => {
  const [plans, setPlans] = useState([])
  const [usage, setUsage] = useState(null)

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    const p = await api.getPlans()
    const u = await api.getUsage(token)
    setPlans(p)
    setUsage(u)
  }

  const handleUpdatePlan = async (planId) => {
    try {
      await api.updatePlan(planId, token)
      fetchBillingData()
      alert("Plan updated successfully!")
    } catch (err) {
      alert("Failed to update plan")
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Current Usage Card */}
      <div className="glass-panel p-8 rounded-[3rem] bg-gradient-to-r from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 blur-3xl -mr-20 -mt-20 rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="text-indigo-200 font-bold uppercase tracking-widest text-sm">Estimated Total for April</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h2 className="text-6xl font-black">${usage?.current_cost || '0.00'}</h2>
              <span className="text-2xl font-bold opacity-50 uppercase">{usage?.currency}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="bg-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-sm font-bold">
                <Zap size={16} fill="currentColor" /> {usage?.total_requests || 0} Requests
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-sm font-bold">
                <CheckCircle2 size={16} /> {usage?.current_plan || 'Free'} Plan
              </div>
            </div>
          </div>
          <button className="bg-white text-indigo-700 font-black py-4 px-8 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-indigo-900/20 flex items-center gap-2">
            <CreditCard size={20} /> Manage Payment Method
          </button>
        </div>
      </div>

      {/* Plans Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div 
            key={plan.id}
            whileHover={{ y: -10 }}
            className={`glass-panel p-8 rounded-[2.5rem] flex flex-col ${plan.name === usage?.current_plan ? 'border-2 border-indigo-500 shadow-2xl shadow-indigo-100' : ''}`}
          >
            {plan.name === 'Pro' && (
              <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">Most Popular</span>
            )}
            <h4 className="text-2xl font-bold text-aurora-900">{plan.name}</h4>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl font-black">${plan.monthly_price}</span>
              <span className="text-aurora-500 font-medium italic">/month</span>
            </div>
            <p className="text-sm text-aurora-500 mt-4 leading-relaxed">
              Perfect for {plan.name === 'Free' ? 'personal projects' : plan.name === 'Pro' ? 'growing startups' : 'large scale enterprises'}.
            </p>
            
            <div className="flex flex-col gap-4 mt-8 flex-1">
              {[
                `${(plan.limit_per_month || plan.limit).toLocaleString()} free requests`,
                `$${plan.request_price} per 1000 after`,
                '99.9% Uptime SLA',
                'Advanced Analytics'
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-aurora-700">
                  <CheckCircle2 size={18} className="text-indigo-500" /> {f}
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleUpdatePlan(plan.id)}
              disabled={plan.name === usage?.current_plan}
              className={`mt-10 w-full font-bold py-4 rounded-2xl transition-all ${plan.name === usage?.current_plan ? 'bg-slate-100 text-slate-400 cursor-default' : plan.name === 'Pro' ? 'aurora-btn' : 'aurora-btn-outline'}`}
            >
              {plan.name === usage?.current_plan ? 'Current Plan' : 'Upgrade to ' + plan.name}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Billing
