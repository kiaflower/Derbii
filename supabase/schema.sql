-- DERBII - Schema Supabase complet
-- Executer dans l'editeur SQL de Supabase

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLE: admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom TEXT NOT NULL,
  telephone TEXT UNIQUE NOT NULL,
  adresse TEXT,
  total_commandes INTEGER DEFAULT 0,
  total_depense NUMERIC(12,0) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: collections
CREATE TABLE IF NOT EXISTS collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  banniere_url TEXT,
  active BOOLEAN DEFAULT true,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_courte TEXT,
  prix NUMERIC(12,0) NOT NULL,
  prix_promo NUMERIC(12,0),
  stock INTEGER DEFAULT 0,
  categorie_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  image_principale TEXT,
  featured BOOLEAN DEFAULT false,
  actif BOOLEAN DEFAULT true,
  archive BOOLEAN DEFAULT false,
  matiere TEXT,
  dimensions TEXT,
  couleurs_disponibles TEXT[],
  nombre_ventes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: product_images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: variants
CREATE TABLE IF NOT EXISTS variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  nom TEXT NOT NULL,
  valeur TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  prix_supplement NUMERIC(10,0) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: collection_products
CREATE TABLE IF NOT EXISTS collection_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  ordre INTEGER DEFAULT 0,
  UNIQUE(collection_id, product_id)
);

-- SEQUENCE pour les numeros de commande
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- FUNCTION: generer numero de commande
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  seq_num TEXT;
BEGIN
  year := EXTRACT(YEAR FROM NOW())::TEXT;
  seq_num := LPAD(nextval('order_number_seq')::TEXT, 6, '0');
  RETURN 'DER-' || year || '-' || seq_num;
END;
$$ LANGUAGE plpgsql;

-- TABLE: orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  numero_commande TEXT UNIQUE NOT NULL DEFAULT generate_order_number(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  nom_client TEXT NOT NULL,
  telephone_client TEXT NOT NULL,
  adresse_client TEXT,
  total NUMERIC(12,0) NOT NULL,
  statut TEXT NOT NULL DEFAULT 'Nouvelle commande' 
    CHECK (statut IN ('Nouvelle commande', 'Acceptée', 'Livrée', 'Annulée')),
  message_whatsapp TEXT,
  date_livraison TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: order_items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  nom_produit TEXT NOT NULL,
  quantite INTEGER NOT NULL DEFAULT 1,
  prix_unitaire NUMERIC(12,0) NOT NULL,
  variante TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: whatsapp_messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('commande', 'confirmation', 'livraison')),
  message TEXT NOT NULL,
  envoye BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: homepage_sections
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cle TEXT UNIQUE NOT NULL,
  titre TEXT,
  sous_titre TEXT,
  contenu TEXT,
  image_url TEXT,
  lien TEXT,
  actif BOOLEAN DEFAULT true,
  ordre INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: media_library
CREATE TABLE IF NOT EXISTS media_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  taille INTEGER,
  dossier TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cle TEXT UNIQUE NOT NULL,
  valeur TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: pages_cms
CREATE TABLE IF NOT EXISTS pages_cms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titre TEXT NOT NULL,
  contenu TEXT,
  meta_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIGGER: update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- TRIGGER: comptabiliser revenus uniquement lors du statut Livree
CREATE OR REPLACE FUNCTION update_customer_on_livraison()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.statut = 'Livrée' AND OLD.statut != 'Livrée' THEN
    UPDATE products p
    SET nombre_ventes = nombre_ventes + oi.quantite
    FROM order_items oi
    WHERE oi.order_id = NEW.id AND oi.product_id = p.id;
    
    IF NEW.customer_id IS NOT NULL THEN
      UPDATE customers
      SET total_depense = total_depense + NEW.total,
          total_commandes = total_commandes + 1
      WHERE id = NEW.customer_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_livraison_trigger AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_customer_on_livraison();

-- DONNEES INITIALES

-- Parametres par defaut
INSERT INTO settings (cle, valeur) VALUES
  ('whatsapp_numero', '221700000000'),
  ('instagram', '@derbii'),
    ('tiktok', '@derbii'),
  ('email_contact', 'contact@derbii.sn'),
  ('adresse', 'Dakar, Sénégal'),
  ('nom_marque', 'DERBII'),
  ('slogan', 'L''art du cuir sénégalais'),
  ('alerte_stock_min', '5')
ON CONFLICT (cle) DO NOTHING;

-- Sections homepage par defaut
INSERT INTO homepage_sections (cle, titre, sous_titre, contenu, ordre) VALUES
  ('hero', 'L''Élégance du Cuir', 'Accessoires artisanaux de luxe', 'Découvrez notre collection exclusive', 1),
  ('featured_title', 'Pièces à la Une', NULL, NULL, 2),
  ('brand_story', 'Notre Histoire', 'DERBII, né à Dakar', 'Depuis notre création, nous célébrons le savoir-faire sénégalais à travers des pièces en cuir d''exception.', 3),
  ('collections_title', 'Nos Collections', NULL, NULL, 4),
  ('newsletter_title', 'Rejoignez la Famille DERBII', 'Recevez nos nouvelles collections en avant-première', NULL, 5)
ON CONFLICT (cle) DO NOTHING;

-- Pages CMS
INSERT INTO pages_cms (slug, titre, contenu) VALUES
  ('a-propos', 'À Propos de DERBII', '<h2>Notre Histoire</h2><p>DERBII est une maison de cuir sénégalaise fondée avec la passion de valoriser l''artisanat local. Chaque pièce est conçue avec soin, alliant tradition et modernité.</p><h2>Notre Vision</h2><p>Créer des accessoires en cuir de qualité premium qui célèbrent l''identité africaine tout en s''inscrivant dans les codes du luxe contemporain.</p>'),
  ('contact', 'Nous Contacter', NULL),
  ('faq', 'Questions Fréquentes', '<h2>Livraison</h2><p>Nous livrons dans tout le Sénégal sous 24-48h à Dakar et 3-5 jours pour les autres régions.</p><h2>Paiement</h2><p>Nous acceptons le paiement à la livraison, Orange Money, Wave et les virements bancaires.</p><h2>Retours</h2><p>Les retours sont acceptés dans les 7 jours suivant la réception de votre commande.</p>'),
  ('conditions', 'Conditions Générales', '<p>En effectuant un achat sur la boutique DERBII, vous acceptez nos conditions générales de vente.</p>')
ON CONFLICT (slug) DO NOTHING;

-- Categories
INSERT INTO categories (nom, slug, description, ordre) VALUES
  ('Sacs', 'sacs', 'Sacs et pochettes en cuir premium', 1),
  ('Ceintures', 'ceintures', 'Ceintures artisanales en cuir', 2),
  ('Portefeuilles', 'portefeuilles', 'Portefeuilles et porte-monnaie', 3),
  ('Accessoires', 'accessoires', 'Autres accessoires en cuir', 4)
ON CONFLICT (slug) DO NOTHING;

-- Collections
INSERT INTO collections (nom, slug, description, active, ordre) VALUES
  ('Collection Signature', 'signature', 'Notre collection phare, pièces intemporelles', true, 1),
  ('Nouvelle Saison', 'nouvelle-saison', 'Les dernières créations DERBII', true, 2),
  ('Édition Limitée', 'edition-limitee', 'Pièces exclusives en quantité limitée', true, 3)
ON CONFLICT (slug) DO NOTHING;

-- RLS Policies (Row Level Security)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages_cms ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour le site
CREATE POLICY "Lecture publique produits" ON products FOR SELECT USING (actif = true AND archive = false);
CREATE POLICY "Lecture publique images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Lecture publique variants" ON variants FOR SELECT USING (true);
CREATE POLICY "Lecture publique categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Lecture publique collections" ON collections FOR SELECT USING (active = true);
CREATE POLICY "Lecture publique collection_products" ON collection_products FOR SELECT USING (true);
CREATE POLICY "Lecture publique homepage" ON homepage_sections FOR SELECT USING (actif = true);
CREATE POLICY "Lecture publique settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Lecture publique pages" ON pages_cms FOR SELECT USING (true);

-- Insertion commandes par tous (visiteurs)
CREATE POLICY "Insertion commandes" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertion order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertion customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertion whatsapp" ON whatsapp_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Lecture commande par numero" ON orders FOR SELECT USING (true);
CREATE POLICY "Lecture items commande" ON order_items FOR SELECT USING (true);

-- Admin: acces complet via service_role (bypass RLS)
