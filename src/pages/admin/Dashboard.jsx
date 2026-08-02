import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowRight } from 'lucide-react'
import AnimatedPage from '../../components/layout/AnimatedPage'
import useOrdersStore from '../../store/ordersStore'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const orders = useOrdersStore(state => state.orders)
  
  // Calculate analytics
  const revenue = orders.filter(o => o.status === 'Completed').reduce((acc, o) => acc + Number(o.total || 0), 0)
  const activeOrdersCount = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length
  const totalOrdersCount = orders.length

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `Rs. ${revenue.toLocaleString()}`, 
      icon: <DollarSign size={22} />, 
      color: 'from-green-500 to-emerald-600', 
      shadow: 'shadow-green-500/20' 
    },
    { 
      label: 'Active Orders', 
      value: activeOrdersCount, 
      icon: <ShoppingBag size={22} />, 
      color: 'from-chiya-orange to-red-500', 
      shadow: 'shadow-chiya-orange/20' 
    },
    { 
      label: 'Total Customer Orders', 
      value: totalOrdersCount, 
      icon: <Users size={22} />, 
      color: 'from-chiya-pink to-purple-600', 
      shadow: 'shadow-chiya-pink/20' 
    },
    { 
      label: 'Growth Rate', 
      value: '+24.8%', 
      icon: <TrendingUp size={22} />, 
      color: 'from-chiya-yellow to-amber-500', 
      shadow: 'shadow-chiya-yellow/20' 
    },
  ]

  return (
    <AnimatedPage className="space-y-8 p-1">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-chiya-ink/10 pb-6">
        <div>
          <h1 className="text-3xl font-display font-black text-chiya-ink flex items-center gap-2">
            ☕ Admin Hub
          </h1>
          <p className="text-sm font-sans font-medium text-chiya-ink/65 mt-1">
            Real-time shop sales performance, active kitchen queues, and user stats.
          </p>
        </div>
        
        <Link 
          to="/admin/orders" 
          className="btn-primary py-2.5 px-5 text-xs flex items-center gap-1.5 shadow-[4px_4px_0px_0px_var(--color-ink)] hover:translate-y-[-2px] hover:shadow-pop"
        >
          Manage Live Orders <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            key={idx} 
            className="bg-white border-2 border-chiya-ink p-6 rounded-[2rem] shadow-[4px_4px_0px_0px_var(--color-ink)] hover:translate-y-[-2px] hover:shadow-pop transition-all flex justify-between items-center"
          >
            <div>
              <p className="text-xs font-display font-extrabold uppercase text-chiya-ink/40 tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-display font-black text-chiya-ink">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-2xl border-2 border-chiya-ink text-white bg-gradient-to-br ${stat.color} ${stat.shadow} shadow-lg`}>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Queue (Left columns) */}
        <div className="lg:col-span-2 bg-white border-2 border-chiya-ink rounded-[2.5rem] p-6 shadow-[8px_8px_0px_0px_var(--color-ink)] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-black text-chiya-ink">Recent Sales Pipeline</h2>
            <span className="text-[10px] font-display font-black bg-chiya-orange/10 text-chiya-orange px-2.5 py-1 rounded-full uppercase tracking-wider">
              Live Feed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-chiya-ink/40 text-[10px] font-display font-black uppercase tracking-wider border-b border-chiya-ink/10 pb-3">
                  <th className="pb-3 font-extrabold">Order</th>
                  <th className="pb-3 font-extrabold">Customer</th>
                  <th className="pb-3 font-extrabold">Total</th>
                  <th className="pb-3 font-extrabold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-chiya-ink/5">
                {orders.slice(0, 6).map((order, idx) => (
                  <tr key={idx} className="hover:bg-chiya-cream/35 transition-colors">
                    <td className="py-4 font-mono font-black text-xs text-chiya-ink">
                      {order.id}
                    </td>
                    <td className="py-4">
                      <p className="font-display font-extrabold text-xs text-chiya-ink">{order.customer}</p>
                      <p className="text-[10px] font-sans font-medium text-chiya-ink/50 max-w-[200px] truncate">{order.items}</p>
                    </td>
                    <td className="py-4 font-display font-black text-xs text-chiya-orange">
                      Rs. {order.total}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-display font-black uppercase tracking-wider ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                        order.status === 'Preparing' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                        'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center font-sans font-semibold text-chiya-ink/50 text-sm">
                      No customer orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights (Right column) */}
        <div className="bg-white border-2 border-chiya-ink rounded-[2.5rem] p-6 shadow-[8px_8px_0px_0px_var(--color-ink)] space-y-6">
          <h2 className="text-xl font-display font-black text-chiya-ink">Top Sellers</h2>
          
          <div className="space-y-4">
            {[
              { name: 'Classic Masala Chiya', sales: '84 cups', share: '32%', color: 'w-[32%] bg-chiya-orange' },
              { name: 'Juicy Chicken Momo', sales: '62 plates', share: '24%', color: 'w-[24%] bg-chiya-pink' },
              { name: 'Dudh Chiya', sales: '45 cups', share: '18%', color: 'w-[18%] bg-chiya-yellow' },
              { name: 'Samosa Veg', sales: '38 pcs', share: '15%', color: 'w-[15%] bg-chiya-teal' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-display font-bold">
                  <span className="text-chiya-ink">{item.name}</span>
                  <span className="text-chiya-ink/50">{item.sales}</span>
                </div>
                <div className="bg-chiya-ink/10 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-chiya-cream p-4 rounded-3xl border border-chiya-ink/10 space-y-2 mt-4">
            <h4 className="text-xs font-display font-black text-chiya-ink">💡 Kitchen Tip</h4>
            <p className="text-[10px] font-sans font-medium text-chiya-ink/75 leading-relaxed">
              Caffeine peaks are highest between 1:00 PM and 3:30 PM. Keep Masala spice mixes crushed and ready!
            </p>
          </div>
        </div>

      </div>
    </AnimatedPage>
  )
}

export default Dashboard
