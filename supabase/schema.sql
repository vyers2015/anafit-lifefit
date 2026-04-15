-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_promotion BOOLEAN DEFAULT false,
  discount_percent INTEGER,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de slides do carrossel
CREATE TABLE IF NOT EXISTS carousel_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT DEFAULT 'Ver mais',
  cta_link TEXT DEFAULT '/produtos',
  image_url TEXT NOT NULL,
  badge TEXT,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
CREATE POLICY "carousel_public_read" ON carousel_slides FOR SELECT USING (true);

-- Somente admins autenticados podem escrever
CREATE POLICY "products_admin_insert" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "products_admin_update" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "products_admin_delete" ON products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "carousel_admin_insert" ON carousel_slides FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "carousel_admin_update" ON carousel_slides FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "carousel_admin_delete" ON carousel_slides FOR DELETE USING (auth.role() = 'authenticated');

-- Tabela de configurações do site
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_write" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Configurações padrão
INSERT INTO site_settings (key, value) VALUES
  ('theme', 'coral'),
  ('site_name', 'Anafit & LipeFit'),
  ('tagline', 'Moda Fitness Feminina'),
  ('whatsapp', '5521970281523'),
  ('email', 'contato@anafit.com.br'),
  ('instagram', 'https://instagram.com'),
  ('hero_title', 'Vista sua melhor versão'),
  ('hero_subtitle', 'Roupas de academia que combinam conforto, performance e estilo'),
  ('about_title', 'Nascemos da paixão pelo movimento'),
  ('about_text', 'A Anafit & LipeFit surgiu do desejo de criar roupas que acompanhem cada agachamento, cada corrida, cada superação.')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- STORAGE: buckets de imagens
-- =============================================
-- Execute estes comandos no Supabase Dashboard → Storage
-- OU rode o SQL abaixo no SQL Editor

-- Criar buckets públicos
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT DO NOTHING;

-- Política: leitura pública
CREATE POLICY "public_read_products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "public_read_banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "public_read_images" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Política: upload apenas para usuários autenticados
CREATE POLICY "auth_upload_products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "auth_upload_banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');
CREATE POLICY "auth_upload_images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Política: delete apenas para usuários autenticados
CREATE POLICY "auth_delete_products" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "auth_delete_banners" ON storage.objects FOR DELETE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- Dados iniciais - Slides do carrossel
INSERT INTO carousel_slides (title, subtitle, cta_text, cta_link, image_url, badge, order_index) VALUES
  ('Nova Coleção Verão', 'Looks poderosos para treinos ainda mais incríveis', 'Ver Lançamentos', '/produtos?filter=new', 'https://picsum.photos/seed/gym1/1400/600', 'Novo', 1),
  ('Até 40% OFF', 'Promoção especial em conjuntos selecionados', 'Aproveitar Oferta', '/produtos?filter=promo', 'https://picsum.photos/seed/gym2/1400/600', 'Promoção', 2),
  ('Leggings Premium', 'Conforto e estilo do aquecimento ao cooldown', 'Explorar', '/produtos?category=legging', 'https://picsum.photos/seed/gym3/1400/600', 'Destaque', 3);

-- Dados iniciais - Produtos
INSERT INTO products (name, description, price, original_price, category, sizes, colors, image_url, is_featured, is_new, is_promotion, discount_percent, stock) VALUES
  ('Legging Sculpt Coral', 'Legging de alta compressão com tecido respirável.', 149.90, 199.90, 'legging', ARRAY['P','M','G','GG'], ARRAY['Coral','Preto','Nude'], 'https://picsum.photos/seed/prod1/400/500', true, false, true, 25, 15),
  ('Top Fit Terracota', 'Top esportivo com bojo removível.', 89.90, NULL, 'top', ARRAY['P','M','G'], ARRAY['Terracota','Rosa','Branco'], 'https://picsum.photos/seed/prod2/400/500', true, true, false, NULL, 20),
  ('Conjunto Fire', 'Conjunto top + legging em tecido premium.', 219.90, 279.90, 'conjunto', ARRAY['P','M','G','GG'], ARRAY['Coral','Vinho'], 'https://picsum.photos/seed/prod3/400/500', true, true, true, 21, 8),
  ('Shorts Energy', 'Shorts de treino com bolso lateral.', 79.90, NULL, 'shorts', ARRAY['P','M','G'], ARRAY['Preto','Coral','Nude'], 'https://picsum.photos/seed/prod4/400/500', false, true, false, NULL, 25);
