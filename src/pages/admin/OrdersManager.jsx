import React, { useState } from 'react'
import { Check, Clock, X, Trash2, ShieldAlert } from 'lucide-react'
import AnimatedPage from '../../components/layout/AnimatedPage'
import useOrdersStore from '../../store/ordersStore'
import toast from 'react-hot-toast'

const OrdersManager = () => {
  const { orders, updateOrderStatus } = useOrdersStore()
  const [filter, setFilter] = useState('All')

  const updateStatus = (id, newStatus) => {
    updateOrderStatus(id, newStatus)
    toast.success(`Order ${id} marked as ${newStatus}!`, { icon: '⚡' })
  }

  const filteredOrders = orders.filter((o) => {
    if (filter === 'All') return true
    if (filter === 'Active') return o.status === 'Pending' || o.status === 'Preparing'
    return o.status === filter
  })

  return (
    <AnimatedPage className="space-y-8 p-1">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-chiya-ink/10 pb-6">
        <div>
          <h1 className="text-3xl font-display font-black text-chiya-ink flex items-center gap-2">
            📋 Order Pipeline
          </h1>
          <p className="text-sm font-sans font-medium text-chiya-ink/65 mt-1">
            Accept, prepare, and complete customer orders inside the Thamel kitchen queue.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Active', 'Pending', 'Preparing', 'Completed', 'Cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-display font-black uppercase tracking-wider border-2 border-chiya-ink cursor-pointer transition-all ${
                filter === f
                  ? 'bg-chiya-orange text-white shadow-pop translate-y-[-2px]'
                  : 'bg-white text-chiya-ink hover:bg-chiya-cream'
              }`}
            >
              {f} ({
                f === 'All' ? orders.length :
                f === 'Active' ? orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length :
                orders.filter(o => o.status === f).length
              })
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredOrders.map((order) => {
          const isPending = order.status === 'Pending'
          const isPreparing = order.status === 'Preparing'
          const isCompleted = order.status === 'Completed'
          const isCancelled = order.status === 'Cancelled'

          return (
            <div
              key={order.id}
              className={`bg-white border-2 border-chiya-ink rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_var(--color-ink)] hover:translate-y-[-2px] transition-all flex flex-col justify-between space-y-6 ${
                isCompleted ? 'bg-green-50/10' : isCancelled ? 'bg-red-50/10' : ''
              }`}
            >
              <div>
                {/* Card Header info */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-black text-chiya-orange uppercase tracking-wider">
                      {order.date}
                    </span>
                    <h3 className="text-xl font-display font-black text-chiya-ink mt-0.5">{order.id}</h3>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-[10px] font-display font-black uppercase tracking-wider inline-flex items-center gap-1 border-2 border-chiya-ink ${
                    isCompleted ? 'bg-green-100 text-green-700' :
                    isPreparing ? 'bg-blue-100 text-blue-700' :
                    isCancelled ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {isCompleted && <Check size={12} />}
                    {isPreparing && <Clock size={12} />}
                    {isCancelled && <ShieldAlert size={12} />}
                    {order.status}
                  </span>
                </div>

                {/* Customer Details */}
                <div className="mt-4 space-y-1 text-xs">
                  <p className="font-display font-bold text-chiya-ink/50 uppercase tracking-wide">Customer</p>
                  <p className="font-display font-extrabold text-sm text-chiya-ink">{order.customer}</p>
                </div>

                {/* Items string lists */}
                <div className="mt-4 bg-chiya-cream/40 border border-chiya-ink/10 rounded-2xl p-4">
                  <p className="text-[10px] font-display font-bold text-chiya-ink/40 uppercase tracking-wide mb-1.5">Items list</p>
                  <ul className="space-y-1.5">
                    {order.items.split('; ').map((item, idx) => (
                      <li key={idx} className="text-xs font-sans font-bold text-chiya-ink/80 flex justify-between">
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Total Amount & Actions */}
              <div className="border-t border-chiya-ink/10 pt-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-display font-bold text-chiya-ink/40 uppercase tracking-wide">Amount Paid</span>
                  <p className="text-lg font-display font-black text-chiya-orange">Rs. {order.total}</p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  {isPending && (
                    <button
                      onClick={() => updateStatus(order.id, 'Preparing')}
                      className="px-4 py-2 border-2 border-chiya-ink bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl text-xs font-display font-black uppercase transition-all shadow-[2px_2px_0px_0px_var(--color-ink)] hover:translate-y-[-1px] cursor-pointer"
                    >
                      Accept
                    </button>
                  )}
                  
                  {isPreparing && (
                    <button
                      onClick={() => updateStatus(order.id, 'Completed')}
                      className="px-4 py-2 border-2 border-chiya-ink bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-xl text-xs font-display font-black uppercase transition-all shadow-[2px_2px_0px_0px_var(--color-ink)] hover:translate-y-[-1px] cursor-pointer"
                    >
                      Complete
                    </button>
                  )}

                  {!isCompleted && !isCancelled && (
                    <button
                      onClick={() => updateStatus(order.id, 'Cancelled')}
                      className="px-3 py-2 border-2 border-chiya-ink bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-display font-black uppercase transition-all shadow-[2px_2px_0px_0px_var(--color-ink)] hover:translate-y-[-1px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {filteredOrders.length === 0 && (
          <div className="col-span-full bg-white border-2 border-chiya-ink border-dashed rounded-[2.5rem] p-12 text-center text-chiya-ink/50">
            <ShieldAlert className="mx-auto mb-4 text-chiya-ink/30 animate-pulse" size={48} />
            <h3 className="text-lg font-display font-black">No Pipeline Orders found</h3>
            <p className="text-xs font-sans font-medium mt-1">There are no orders that match the selected filter category.</p>
          </div>
        )}
      </div>
    </AnimatedPage>
  )
}

export default OrdersManager
