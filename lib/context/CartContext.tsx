'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

export interface CartItem {
    itemId: string
    name: string
    price: number
    quantity: number
    notes?: string
}

interface CartContextType {
    items: CartItem[]
    addToCart: (item: any) => void
    removeFromCart: (itemId: string) => void
    updateQuantity: (itemId: string, delta: number) => void
    clearCart: () => void
    total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cart')
        if (saved) setItems(JSON.parse(saved))
    }, [])

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    const addToCart = useCallback((newItem: any) => {
        setItems(prev => {
            const existing = prev.find(i => i.itemId === newItem.id)
            if (existing) {
                return prev.map(i => i.itemId === newItem.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                )
            }
            return [...prev, { itemId: newItem.id, name: newItem.name, price: newItem.price, quantity: 1 }]
        })
    }, [])

    const removeFromCart = useCallback((itemId: string) => {
        setItems(prev => prev.filter(i => i.itemId !== itemId))
    }, [])

    const updateQuantity = useCallback((itemId: string, delta: number) => {
        setItems(prev => prev.map(i => {
            if (i.itemId === itemId) {
                const newQty = Math.max(0, i.quantity + delta)
                return { ...i, quantity: newQty }
            }
            return i
        }).filter(i => i.quantity > 0))
    }, [])

    const clearCart = useCallback(() => setItems([]), [])

    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }, [items])

    const value = useMemo(() => ({
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total
    }), [items, addToCart, removeFromCart, updateQuantity, clearCart, total])

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within CartProvider')
    return context
}
