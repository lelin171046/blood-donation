'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Printer, Plus, Trash2 } from 'lucide-react'

function InvoicePage() {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: 'B-1966471',
    date: '11-11-2022',
    customer: {
      name: 'Uamong Marma',
      id: '129680',
      phone: '01764509336',
      email: 'customer@ryansplus.com',
      address: 'Chattogram'
    }
  })

  const [items, setItems] = useState([
    {
      id: 1,
      type: 'Processor / Desktop',
      item: '(Bundle with PC) AMD Ryzen 5 5500G 3.5GHz-4.4GHz 6 Core 12 Thread AM4 Socket Processor',
      serialNo: '9K36073Q20205',
      qty: 1,
      price: 16500.00
    },
    {
      id: 2,
      type: 'Motherboard / AMD Based',
      item: 'Gigabyte A520M AORUS ELITE DDR4 AM4 Socket AMD Motherboard',
      serialNo: 'SN20350001111',
      qty: 1,
      price: 10600.00
    },
    {
      id: 3,
      type: 'Ram / Desktop RAM',
      item: 'Corsair Vengeance LPX 8GB DDR4 3200MHz Black Heatsink Desktop RAM',
      serialNo: '2Z09061136718840',
      qty: 2,
      price: 3400.00
    }
  ])

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      type: '',
      item: '',
      serialNo: '',
      qty: 1,
      price: 0
    }
    setItems([...items, newItem])
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const updateInvoiceData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setInvoiceData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setInvoiceData(prev => ({ ...prev, [field]: value }))
    }
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.price), 0)
  }

  const handlePrint = () => {
    window.print()
  }

  const total = calculateTotal()
  const lessAdd = 1550.00
  const grandTotal = total - lessAdd

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Print Button */}
        <div className="mb-4 print:hidden">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print Invoice
          </Button>
        </div>

        {/* Invoice Container */}
        <Card className="bg-white print:shadow-none">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">RYANS</h1>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold">Ryans Computers Limited</p>
                  <p>Level 4, House 24/C, CDA Avenue, GEC Circle, Chattogram 4000</p>
                  <p>Tel: +8801313467650 (Sales), +8801313467551 (Service)</p>
                </div>
              </div>
              <div className="border border-gray-400 p-2">
                <div className="text-center font-semibold mb-2">Invoice/Bill</div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-xs">NO</Label>
                    <Input 
                      value={invoiceData.invoiceNo}
                      onChange={(e) => updateInvoiceData('invoiceNo', e.target.value)}
                      className="w-24 h-6 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Date</Label>
                    <Input 
                      value={invoiceData.date}
                      onChange={(e) => updateInvoiceData('date', e.target.value)}
                      className="w-24 h-6 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-6 text-sm">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="flex gap-2">
                  <span className="font-semibold">Customer:</span>
                  <Input 
                    value={invoiceData.customer.name}
                    onChange={(e) => updateInvoiceData('customer.name', e.target.value)}
                    className="flex-1 h-6 text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">ID:</span>
                  <Input 
                    value={invoiceData.customer.id}
                    onChange={(e) => updateInvoiceData('customer.id', e.target.value)}
                    className="w-20 h-6 text-xs"
                  />
                  <span className="font-semibold ml-4">Phone:</span>
                  <Input 
                    value={invoiceData.customer.phone}
                    onChange={(e) => updateInvoiceData('customer.phone', e.target.value)}
                    className="flex-1 h-6 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <span className="font-semibold">Address:</span>
                  <Input 
                    value={invoiceData.customer.address}
                    onChange={(e) => updateInvoiceData('customer.address', e.target.value)}
                    className="flex-1 h-6 text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Email:</span>
                  <Input 
                    value={invoiceData.customer.email}
                    onChange={(e) => updateInvoiceData('customer.email', e.target.value)}
                    className="flex-1 h-6 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-gray-400 mb-6">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-400">
                    <th className="border-r border-gray-400 p-2 text-left w-8">SL</th>
                    <th className="border-r border-gray-400 p-2 text-left w-24">TYPE</th>
                    <th className="border-r border-gray-400 p-2 text-left">ITEM</th>
                    <th className="border-r border-gray-400 p-2 text-left w-24">SERIAL NO.</th>
                    <th className="border-r border-gray-400 p-2 text-left w-12">QTY</th>
                    <th className="border-r border-gray-400 p-2 text-left w-20">PRICE</th>
                    <th className="border-r border-gray-400 p-2 text-left w-20">TOTAL</th>
                    <th className="p-2 w-8 print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-400">
                      <td className="border-r border-gray-400 p-2 text-center">{index + 1}</td>
                      <td className="border-r border-gray-400 p-2">
                        <Input 
                          value={item.type}
                          onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                          className="w-full h-6 text-xs border-none p-1"
                        />
                      </td>
                      <td className="border-r border-gray-400 p-2">
                        <Textarea 
                          value={item.item}
                          onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                          className="w-full min-h-12 text-xs border-none p-1 resize-none"
                        />
                      </td>
                      <td className="border-r border-gray-400 p-2">
                        <Input 
                          value={item.serialNo}
                          onChange={(e) => updateItem(item.id, 'serialNo', e.target.value)}
                          className="w-full h-6 text-xs border-none p-1"
                        />
                      </td>
                      <td className="border-r border-gray-400 p-2">
                        <Input 
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                          className="w-full h-6 text-xs border-none p-1 text-center"
                        />
                      </td>
                      <td className="border-r border-gray-400 p-2">
                        <Input 
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full h-6 text-xs border-none p-1 text-right"
                        />
                      </td>
                      <td className="border-r border-gray-400 p-2 text-right">
                        {(item.qty * item.price).toFixed(2)}
                      </td>
                      <td className="p-2 print:hidden">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Item Button */}
            <div className="mb-6 print:hidden">
              <Button onClick={addItem} variant="outline" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="border border-gray-400 w-48">
                <div className="flex justify-between p-2 border-b border-gray-400 text-sm">
                  <span>Total</span>
                  <span>{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 border-b border-gray-400 text-sm">
                  <span>Less/Add.</span>
                  <span>{lessAdd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 text-sm font-semibold">
                  <span>Grand Total</span>
                  <span>{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="text-right mb-8 text-sm">
              <span className="font-semibold">Paid:</span> {grandTotal.toFixed(2)} Tk{' '}
              <span className="font-semibold ml-4">Due:</span> 0.00 Tk
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm mb-8">Goods received in good condition</p>
                <div className="border-b border-gray-400 w-48 mb-2"></div>
                <p className="text-xs">Received by ________________</p>
                <p className="text-xs">Customer's signature</p>
              </div>
              <div className="text-right">
                <div className="border-b border-gray-400 w-48 mb-2"></div>
                <p className="text-xs">Issued by ________________</p>
                <p className="text-xs">for Ryans Computers Limited</p>
              </div>
            </div>

            {/* Company Footer */}
            <div className="mt-8 text-xs text-gray-500">
              <p>about:blank</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { margin: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  )
}

export default InvoicePage
