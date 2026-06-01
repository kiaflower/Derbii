export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          email: string
          nom: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          nom: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          nom?: string
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          nom: string
          telephone: string
          adresse: string | null
          total_commandes: number
          total_depense: number
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          telephone: string
          adresse?: string | null
          total_commandes?: number
          total_depense?: number
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          telephone?: string
          adresse?: string | null
          total_commandes?: number
          total_depense?: number
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          nom: string
          slug: string
          description: string | null
          image_url: string | null
          ordre: number
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          slug: string
          description?: string | null
          image_url?: string | null
          ordre?: number
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          ordre?: number
          created_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          nom: string
          slug: string
          description: string | null
          banniere_url: string | null
          active: boolean
          ordre: number
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          slug: string
          description?: string | null
          banniere_url?: string | null
          active?: boolean
          ordre?: number
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          slug?: string
          description?: string | null
          banniere_url?: string | null
          active?: boolean
          ordre?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          nom: string
          slug: string
          description: string | null
          description_courte: string | null
          prix: number
          prix_promo: number | null
          stock: number
          categorie_id: string | null
          collection_id: string | null
          image_principale: string | null
          featured: boolean
          actif: boolean
          archive: boolean
          matiere: string | null
          dimensions: string | null
          couleurs_disponibles: string[] | null
          nombre_ventes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          slug: string
          description?: string | null
          description_courte?: string | null
          prix: number
          prix_promo?: number | null
          stock?: number
          categorie_id?: string | null
          collection_id?: string | null
          image_principale?: string | null
          featured?: boolean
          actif?: boolean
          archive?: boolean
          matiere?: string | null
          dimensions?: string | null
          couleurs_disponibles?: string[] | null
          nombre_ventes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          slug?: string
          description?: string | null
          description_courte?: string | null
          prix?: number
          prix_promo?: number | null
          stock?: number
          categorie_id?: string | null
          collection_id?: string | null
          image_principale?: string | null
          featured?: boolean
          actif?: boolean
          archive?: boolean
          matiere?: string | null
          dimensions?: string | null
          couleurs_disponibles?: string[] | null
          nombre_ventes?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string | null
          ordre: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt?: string | null
          ordre?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt?: string | null
          ordre?: number
          created_at?: string
        }
      }
      variants: {
        Row: {
          id: string
          product_id: string
          nom: string
          valeur: string
          stock: number
          prix_supplement: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          nom: string
          valeur: string
          stock?: number
          prix_supplement?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          nom?: string
          valeur?: string
          stock?: number
          prix_supplement?: number
          created_at?: string
        }
      }
      collection_products: {
        Row: {
          id: string
          collection_id: string
          product_id: string
          ordre: number
        }
        Insert: {
          id?: string
          collection_id: string
          product_id: string
          ordre?: number
        }
        Update: {
          id?: string
          collection_id?: string
          product_id?: string
          ordre?: number
        }
      }
      orders: {
        Row: {
          id: string
          numero_commande: string
          customer_id: string | null
          nom_client: string
          telephone_client: string
          adresse_client: string | null
          total: number
          statut: 'Nouvelle commande' | 'Acceptée' | 'Livrée' | 'Annulée'
          message_whatsapp: string | null
          date_livraison: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_commande?: string
          customer_id?: string | null
          nom_client: string
          telephone_client: string
          adresse_client?: string | null
          total: number
          statut?: 'Nouvelle commande' | 'Acceptée' | 'Livrée' | 'Annulée'
          message_whatsapp?: string | null
          date_livraison?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_commande?: string
          customer_id?: string | null
          nom_client?: string
          telephone_client?: string
          adresse_client?: string | null
          total?: number
          statut?: 'Nouvelle commande' | 'Acceptée' | 'Livrée' | 'Annulée'
          message_whatsapp?: string | null
          date_livraison?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          nom_produit: string
          quantite: number
          prix_unitaire: number
          variante: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          nom_produit: string
          quantite: number
          prix_unitaire: number
          variante?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          nom_produit?: string
          quantite?: number
          prix_unitaire?: number
          variante?: string | null
          created_at?: string
        }
      }
      whatsapp_messages: {
        Row: {
          id: string
          order_id: string
          type: 'commande' | 'confirmation' | 'livraison'
          message: string
          envoye: boolean
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          type: 'commande' | 'confirmation' | 'livraison'
          message: string
          envoye?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          type?: 'commande' | 'confirmation' | 'livraison'
          message?: string
          envoye?: boolean
          created_at?: string
        }
      }
      homepage_sections: {
        Row: {
          id: string
          cle: string
          titre: string | null
          sous_titre: string | null
          contenu: string | null
          image_url: string | null
          lien: string | null
          actif: boolean
          ordre: number
          updated_at: string
        }
        Insert: {
          id?: string
          cle: string
          titre?: string | null
          sous_titre?: string | null
          contenu?: string | null
          image_url?: string | null
          lien?: string | null
          actif?: boolean
          ordre?: number
          updated_at?: string
        }
        Update: {
          id?: string
          cle?: string
          titre?: string | null
          sous_titre?: string | null
          contenu?: string | null
          image_url?: string | null
          lien?: string | null
          actif?: boolean
          ordre?: number
          updated_at?: string
        }
      }
      media_library: {
        Row: {
          id: string
          nom: string
          url: string
          type: string
          taille: number | null
          dossier: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          url: string
          type: string
          taille?: number | null
          dossier?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          url?: string
          type?: string
          taille?: number | null
          dossier?: string | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          cle: string
          valeur: string
          updated_at: string
        }
        Insert: {
          id?: string
          cle: string
          valeur: string
          updated_at?: string
        }
        Update: {
          id?: string
          cle?: string
          valeur?: string
          updated_at?: string
        }
      }
      pages_cms: {
        Row: {
          id: string
          slug: string
          titre: string
          contenu: string | null
          meta_description: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          titre: string
          contenu?: string | null
          meta_description?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          titre?: string
          contenu?: string | null
          meta_description?: string | null
          updated_at?: string
        }
      }
    }
  }
}

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Customer = Database['public']['Tables']['customers']['Row']
export type Collection = Database['public']['Tables']['collections']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type HomepageSection = Database['public']['Tables']['homepage_sections']['Row']
export type Setting = Database['public']['Tables']['settings']['Row']
export type MediaItem = Database['public']['Tables']['media_library']['Row']

export type OrderStatut = 'Nouvelle commande' | 'Acceptée' | 'Livrée' | 'Annulée'

export type ProductWithImages = Product & {
  product_images: { id: string; url: string; alt: string | null; ordre: number }[]
  categories: Category | null
  collections: Collection | null
  variants: { id: string; nom: string; valeur: string; stock: number; prix_supplement: number }[]
}

export type OrderWithItems = Order & {
  order_items: (OrderItem & { products: Product | null })[]
  customers: Customer | null
}

export interface CartItem {
  id: string
  product_id: string
  nom: string
  prix: number
  quantite: number
  image: string | null
  variante?: string
  stock: number
}
