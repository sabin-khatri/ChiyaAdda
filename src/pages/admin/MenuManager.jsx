/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import AnimatedPage from '../../components/layout/AnimatedPage'
import { menuItems } from '../../data/mockData'

const MenuManager = () => {
  const [items, setItems] = useState(menuItems)

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  return (
    <AnimatedPage>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-500 text-sm">
                <th className="p-4 font-medium w-16">Image</th>
                <th className="p-4 font-medium">Name & Description</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{item.name}</p>
                      {item.popular && (
                        <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Popular</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600 capitalize">
                    {item.categoryId}
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    Rs. {item.price}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
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

export default MenuManager
