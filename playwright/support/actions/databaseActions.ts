import { db } from '../database'
import { OrderDetails } from './orderLookupActions'
import crypto from 'crypto'

export const databaseActions = {
  async seedOrder(order: OrderDetails) {
    // Apaga um possível pedido com mesmo número para não haver conflito
    await db.deleteFrom('orders').where('order_number', '=', order.number).execute()

    let dbColor = ''
    switch(order.color) {
        case 'Midnight Black': dbColor = 'midnight-black'; break;
        case 'Lunar White': dbColor = 'lunar-white'; break;
        case 'Glacier Blue': dbColor = 'glacier-blue'; break;
        default: dbColor = order.color;
    }

    let dbWheels = ''
    switch(order.wheels) {
        case 'aero Wheels': dbWheels = 'aero'; break;
        case 'performance Wheels': dbWheels = 'performance'; break;
        default: dbWheels = order.wheels;
    }

    let dbPayment = ''
    switch(order.payment) {
        case 'À Vista': dbPayment = 'avista'; break;
        case 'Cartão de Crédito': dbPayment = 'credito'; break;
        case 'Financiamento': dbPayment = 'financiamento'; break;
        default: dbPayment = order.payment;
    }

    await db.insertInto('orders').values({
      id: crypto.randomUUID(),
      order_number: order.number,
      color: dbColor,
      wheel_type: dbWheels,
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: '(11) 99999-9999',
      customer_cpf: '000.000.000-00',
      payment_method: dbPayment,
      total_price: '40000',
      status: order.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      optionals: []
    }).execute()
  },
  
  async cleanupOrder(orderNumber: string) {
    await db.deleteFrom('orders').where('order_number', '=', orderNumber).execute()
  }
}
