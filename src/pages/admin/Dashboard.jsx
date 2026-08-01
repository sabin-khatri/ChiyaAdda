/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react'
import AnimatedPage from '../../components/layout/AnimatedPage'
import useOrdersStore from '../../store/ordersStore'

const Dashboard = () => {
  const orders = useOrdersStore(state => state.orders)
  const revenue = orders.filter(o => o.status === 'Completed').reduce((acc, o) => acc + o.total, 0)
  const todayOrders = orders.length

  const stats = [
    { label: 'Total Revenue', value: `Rs. ${revenue}`, icon: <DollarSign size={24} />, color: 'bg-green-100 text-green-600' },
    { label: 'Orders Today', value: todayOrders, icon: <ShoppingBag size={24} />, color: 'bg-blue-100 text-blue-600' },
    { label: 'New Customers', value: '12', icon: <Users size={24} />, color: 'bg-purple-100 text-purple-600' },
    { label: 'Growth', value: '+14.5%', icon: <TrendingUp size={24} />, color: 'bg-orange-100 text-orange-600' },
  ]

  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="pb-4 font-medium">Order ID</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Items</th>
                <th className="pb-4 font-medium">Amount</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order, idx) => (
                <tr key={idx} className="border-b border-gray-50 last:border-0">
                  <td className="py-4 font-medium text-gray-900">{order.id}</td>
                  <td className="py-4 text-gray-600">{order.customer}</td>
                  <td className="py-4 text-gray-600 max-w-[200px] truncate">{order.items}</td>
                  <td className="py-4 text-gray-900 font-medium">Rs. {order.total}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedPage>
  )
}

export default Dashboard
