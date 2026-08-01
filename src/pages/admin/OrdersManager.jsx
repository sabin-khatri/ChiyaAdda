/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Check, Clock, X } from 'lucide-react'
import AnimatedPage from '../../components/layout/AnimatedPage'
import useOrdersStore from '../../store/ordersStore'

const OrdersManager = () => {
  const { orders, updateOrderStatus } = useOrdersStore()

  const updateStatus = (id, newStatus) => {
    updateOrderStatus(id, newStatus)
  }

  return (
    <AnimatedPage>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <div className="flex gap-2">
          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold">
            {orders.length} Total
          </span>
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
            {orders.filter(o => o.status !== 'Completed').length} Active
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-500 text-sm">
                <th className="p-4 font-medium">Order Details</th>
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{order.id}</p>
                    <p className="text-sm font-medium text-gray-700">{order.customer}</p>
                    <p className="text-sm text-gray-500 mt-1 max-w-[250px]">{order.items}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {order.date}
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    Rs. {order.total}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status === 'Completed' && <Check size={12} />}
                      {order.status === 'Preparing' && <Clock size={12} />}
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {order.status === 'Pending' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'Preparing')}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm font-medium transition"
                        >
                          Accept
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'Completed')}
                          className="px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 text-sm font-medium transition"
                        >
                          Complete
                        </button>
                      )}
                      {order.status !== 'Completed' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'Cancelled')}
                          className="px-3 py-1 text-red-500 hover:bg-red-50 rounded text-sm font-medium transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
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

export default OrdersManager
