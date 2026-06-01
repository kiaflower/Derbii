'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { creerProduit, modifierProduit, supprimerProduit } from '@/lib/actions/products'
import { toast } from 'sonner'
import { Trash2, Plus, X } from 'lucide-react'
import { Product, Category, Collection } from '@/types/database'

interface ProductFormProps {
  product?: Product
  categories: Category[]
  collections: Collection[]
  mode: 'create' | 'edit'
}

export default function ProductForm({ product, categories, collections, mode }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [couleurs, setCouleurs] = useState<string[]>(product?.couleurs_disponibles || [])
  const [newCouleur, setNewCouleur] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)

    const data = {
      nom: fd.get('nom') as string,
      description: fd.get('description') as string || null,
      description_courte: fd.get('description_courte') as string || null,
      prix: parseInt(fd.get('prix') as string),
      prix_promo: fd.get('prix_promo') ? parseInt(fd.get('prix_promo') as string) : null,
      stock: parseInt(fd.get('stock') as string),
      image_principale: fd.get('image_principale') as string || null,
      matiere: fd.get('matiere') as string || null,
      dimensions: fd.get('dimensions') as string || null,
      categorie_id: fd.get('categorie_id') as string || null,
      collection_id: fd.get('collection_id') as string || null,
      featured: fd.get('featured') === 'on',
      actif: fd.get('actif') === 'on',
      couleurs_disponibles: couleurs.length > 0 ? couleurs : null,
    }

    try {
      if (mode === 'create') {
        await creerProduit(data as any)
        toast.success('Produit créé avec succès')
        router.push('/super-admin/produits')
      } else if (product) {
        await modifierProduit(product.id, data)
        toast.success('Produit modifié avec succès')
        router.refresh()
      }
    } catch (err) {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product) return
    if (!confirm('Supprimer ce produit ? Cette action est irréversible.')) return
    setLoading(true)
    try {
      await supprimerProduit(product.id)
      toast.success('Produit archivé')
      router.push('/super-admin/produits')
    } catch {
      toast.error('Erreur lors de la suppression')
      setLoading(false)
    }
  }

  const addCouleur = () => {
    if (newCouleur.trim() && !couleurs.includes(newCouleur.trim())) {
      setCouleurs([...couleurs, newCouleur.trim()])
      setNewCouleur('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic info */}
      <div className="bg-white border border-stone-100 rounded-lg p-6 space-y-5">
        <h2 className="font-medium text-stone-900">Informations générales</h2>

        <div>
          <label className="text-xs text-stone-500 block mb-1.5">Nom du produit *</label>
          <input
            name="nom"
            defaultValue={product?.nom || ''}
            required
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 transition-colors"
            placeholder="Ex: Sac Signature DERBII"
          />
        </div>

        <div>
          <label className="text-xs text-stone-500 block mb-1.5">Description courte</label>
          <input
            name="description_courte"
            defaultValue={product?.description_courte || ''}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 transition-colors"
            placeholder="Résumé en une ligne"
          />
        </div>

        <div>
          <label className="text-xs text-stone-500 block mb-1.5">Description complète</label>
          <textarea
            name="description"
            defaultValue={product?.description || ''}
            rows={5}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 transition-colors resize-none"
            placeholder="Description détaillée du produit..."
          />
        </div>

        <div>
          <label className="text-xs text-stone-500 block mb-1.5">URL image principale</label>
          <input
            name="image_principale"
            defaultValue={product?.image_principale || ''}
            className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 transition-colors"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Pricing & stock */}
      <div className="bg-white border border-stone-100 rounded-lg p-6 space-y-5">
        <h2 className="font-medium text-stone-900">Prix & Stock</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-stone-500 block mb-1.5">Prix (FCFA) *</label>
            <input
              name="prix"
              type="number"
              defaultValue={product?.prix || ''}
              required
              min="0"
              className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
              placeholder="25000"
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1.5">Prix promo (FCFA)</label>
            <input
              name="prix_promo"
              type="number"
              defaultValue={product?.prix_promo || ''}
              min="0"
              className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
              placeholder="20000"
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1.5">Stock *</label>
            <input
              name="stock"
              type="number"
              defaultValue={product?.stock ?? 0}
              required
              min="0"
              className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
            />
          </div>
        </div>
      </div>

      {/* Classification */}
      <div className="bg-white border border-stone-100 rounded-lg p-6 space-y-5">
        <h2 className="font-medium text-stone-900">Classification</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-stone-500 block mb-1.5">Catégorie</label>
            <select
              name="categorie_id"
              defaultValue={product?.categorie_id || ''}
              className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 bg-white"
            >
              <option value="">— Choisir —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1.5">Collection</label>
            <select
              name="collection_id"
              defaultValue={product?.collection_id || ''}
              className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 bg-white"
            >
              <option value="">— Choisir —</option>
              {collections.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white border border-stone-100 rounded-lg p-6 space-y-5">
        <h2 className="font-medium text-stone-900">Détails du produit</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-stone-500 block mb-1.5">Matière</label>
            <input
              name="matiere"
              defaultValue={product?.matiere || ''}
              className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
              placeholder="Cuir pleine fleur"
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1.5">Dimensions</label>
            <input
              name="dimensions"
              defaultValue={product?.dimensions || ''}
              className="w-full border border-stone-200 rounded px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
              placeholder="30 × 20 × 10 cm"
            />
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="text-xs text-stone-500 block mb-2">Couleurs disponibles</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {couleurs.map(c => (
              <span key={c} className="flex items-center gap-1 bg-stone-100 text-stone-700 text-xs px-2 py-1 rounded-full">
                {c}
                <button type="button" onClick={() => setCouleurs(couleurs.filter(x => x !== c))}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCouleur}
              onChange={e => setNewCouleur(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCouleur())}
              className="border border-stone-200 rounded px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
              placeholder="Marron cognac"
            />
            <button type="button" onClick={addCouleur} className="flex items-center gap-1 text-xs border border-stone-200 px-3 py-2 rounded hover:bg-stone-50">
              <Plus size={13} />
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-white border border-stone-100 rounded-lg p-6">
        <h2 className="font-medium text-stone-900 mb-4">Visibilité</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="actif"
              defaultChecked={product?.actif ?? true}
              className="w-4 h-4 accent-stone-900"
            />
            <span className="text-sm text-stone-700">Produit actif</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="w-4 h-4 accent-stone-900"
            />
            <span className="text-sm text-stone-700">Mis en avant (homepage)</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2.5 text-sm rounded transition-colors disabled:opacity-60"
          >
            <Trash2 size={14} strokeWidth={1.5} />
            Archiver
          </button>
        )}
        <div className="flex gap-3 ml-auto">
          <button
            type="button"
            onClick={() => router.push('/super-admin/produits')}
            className="text-sm text-stone-600 border border-stone-200 hover:border-stone-400 px-4 py-2.5 rounded transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="text-sm bg-stone-900 text-white px-6 py-2.5 rounded hover:bg-stone-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Enregistrement...' : mode === 'create' ? 'Créer le produit' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  )
}
