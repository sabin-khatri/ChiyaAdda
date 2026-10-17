import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Clock3, Coffee, PackageCheck, Store, Truck, XCircle } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useOrdersStore from '../store/ordersStore'

const stages = [
  { status: 'Pending', title: 'Order received', detail: 'The kitchen has received your order.', icon: Check },
  { status: 'Preparing', title: 'Being prepared', detail: 'Your chiya and snacks are being prepared.', icon: Coffee },
  { status: 'Completed', title: 'Ready', detail: 'Your order is complete.', icon: PackageCheck },
]

const OrderTracking = () => {
  const { orderId = '' } = useParams()
  const decodedOrderId = decodeURIComponent(orderId)
  const order = useOrdersStore(state => state.orders.find(item => item.id === decodedOrderId))
  useDocumentTitle('Track Order')

  if (!order) {
    return (
      <AnimatedPage className="min-h-[65vh] bg-chiya-cream py-16">
        <div className="max-w-xl mx-auto px-4 text-center bg-white border-2 border-chiya-ink rounded-3xl p-8 shadow-pop">
          <h1 className="text-2xl font-display font-black text-chiya-ink">Order not found</h1>
          <p className="text-chiya-ink/70 mt-3">This order reference isn’t available in this browser.</p>
          <Link to="/menu" className="btn-primary inline-flex mt-6">Browse Menu</Link>
        </div>
      </AnimatedPage>
    )
  }

  const cancelled = order.status === 'Cancelled'
  const currentStage = stages.findIndex(stage => stage.status === order.status)
  const statusCopy = cancelled
    ? { title: 'Order cancelled', detail: 'Please contact Chiya Ghar if you need help with this order.', icon: XCircle }
    : stages[Math.max(currentStage, 0)]
  const StatusIcon = statusCopy.icon

  return (
    <AnimatedPage className="min-h-[65vh] bg-chiya-cream py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-display font-black uppercase tracking-widest text-chiya-orange">Order tracking</span>
          <h1 className="text-3xl md:text-4xl font-display font-black text-chiya-ink mt-2">Your chiya is on its way</h1>
        </div>

        <section className="bg-white border-2 border-chiya-ink rounded-3xl p-6 sm:p-8 shadow-pop">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-chiya-ink/10 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-chiya-ink/50">Order reference</p>
              <p className="text-xl font-display font-black text-chiya-orange mt-1">{order.id}</p>
              <p className="text-sm text-chiya-ink/65 mt-1">{order.customer}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-display font-black uppercase border-2 border-chiya-ink ${cancelled ? 'bg-red-100 text-red-700' : 'bg-chiya-yellow/40 text-chiya-ink'}`}>
              {order.status}
            </span>
          </div>

          {cancelled ? (
            <div className="flex gap-4 items-start py-7">
              <XCircle className="text-red-500 shrink-0" size={28} />
              <div><h2 className="font-display font-black text-lg">{statusCopy.title}</h2><p className="text-sm text-chiya-ink/65 mt-1">{statusCopy.detail}</p></div>
            </div>
          ) : (
            <ol className="py-6 space-y-5">
              {stages.map((stage, index) => {
                const StageIcon = stage.icon
                const complete = index <= currentStage
                const active = index === currentStage
                return (
                  <li key={stage.status} className="flex gap-4 items-start">
                    <span className={`w-10 h-10 rounded-full border-2 border-chiya-ink flex items-center justify-center shrink-0 ${complete ? 'bg-chiya-orange text-white' : 'bg-chiya-cream text-chiya-ink/40'}`}>
                      <StageIcon size={18} />
                    </span>
                    <div className="pt-1">
                      <h2 className={`font-display font-black ${active ? 'text-chiya-orange' : 'text-chiya-ink'}`}>{stage.title}</h2>
                      <p className="text-sm text-chiya-ink/60 mt-0.5">{stage.detail}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}

          <div className="bg-chiya-cream/70 rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-chiya-ink/75"><Clock3 size={16} /><span>Placed {order.date}</span></div>
            <div className="flex items-center gap-2 text-chiya-ink/75">
              {order.mode === 'delivery' ? <Truck size={16} /> : <Store size={16} />}
              <span>{order.mode === 'delivery' ? 'Delivery' : 'Pickup'}</span>
            </div>
            <p className="pt-2 border-t border-chiya-ink/10 font-semibold text-chiya-ink">{order.items}</p>
            <p className="font-display font-black text-chiya-orange">Total: Rs. {order.total}</p>
          </div>
        </section>
        <p className="text-xs text-center text-chiya-ink/55 mt-4">Status updates appear here when the kitchen updates your order.</p>
      </div>
    </AnimatedPage>
  )
}

export default OrderTracking
