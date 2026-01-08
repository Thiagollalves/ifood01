'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Product, Category } from '@/lib/types';
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from 'lucide-react';

export default function AdminMenuPage() {
    const { products, addProduct, updateProduct, deleteProduct } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct.name || !editingProduct.price) return;

        const mkProduct: Product = {
            id: editingProduct.id || crypto.randomUUID(),
            name: editingProduct.name!,
            description: editingProduct.description || '',
            price: Number(editingProduct.price),
            category: (editingProduct.category || 'Pizza') as Category,
            image: editingProduct.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60',
            popular: editingProduct.popular || false
        };

        if (editingProduct.id) {
            updateProduct(mkProduct);
        } else {
            addProduct(mkProduct);
        }

        setIsEditing(false);
        setEditingProduct({});
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            deleteProduct(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">Gerenciar Cardápio</h1>
                <button
                    onClick={() => {
                        setEditingProduct({});
                        setIsEditing(true);
                    }}
                    className="btn btn-primary gap-2"
                >
                    <Plus size={20} /> Novo Produto
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-bold">{editingProduct.id ? 'Editar Produto' : 'Novo Produto'}</h2>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                                    value={editingProduct.name || ''}
                                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Descrição</label>
                                <textarea
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 resize-none h-20"
                                    value={editingProduct.description || ''}
                                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                                        value={editingProduct.price || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Categoria</label>
                                    <select
                                        className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                                        value={editingProduct.category || 'Pizza'}
                                        onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as Category })}
                                    >
                                        <option value="Pizza">Pizza</option>
                                        <option value="Drink">Bebida</option>
                                        <option value="Dessert">Sobremesa</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Imagem URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                                        value={editingProduct.image || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                    />
                                    {editingProduct.image && (
                                        <div className="h-10 w-10 relative rounded overflow-hidden border">
                                            <img src={editingProduct.image} alt="Preview" className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map(product => (
                    <div key={product.id} className="bg-card border rounded-lg p-4 flex gap-4">
                        <div className="h-20 w-20 relative bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold truncate">{product.name}</h3>
                            <p className="text-sm text-muted line-clamp-1">{product.description}</p>
                            <p className="font-medium mt-1">
                                {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="text-xs flex items-center gap-1 bg-secondary hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                                >
                                    <Pencil size={12} /> Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="text-xs flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                                >
                                    <Trash2 size={12} /> Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
