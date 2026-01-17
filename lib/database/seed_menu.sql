-- SEED DATA FOR AI CAVALLI MENU & ANNOUNCEMENTS
-- Run this in Supabase SQL Editor after creating the schema

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO public.categories (name, sort_order) VALUES
('Today''s Specials', 0),
('Antipasti (Starters)', 1),
('Primi Piatti (First Course)', 2),
('Secondi Piatti (Main Course)', 3),
('Contorni (Sides)', 4),
('Dolci (Desserts)', 5),
('Bevande (Drinks)', 6)
ON CONFLICT DO NOTHING;

-- ============================================
-- MENU ITEMS
-- ============================================
DO $$
DECLARE
  cat_antipasti uuid;
  cat_primi uuid;
  cat_secondi uuid;
  cat_contorni uuid;
  cat_dolci uuid;
  cat_bevande uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_antipasti FROM public.categories WHERE name = 'Antipasti (Starters)' LIMIT 1;
  SELECT id INTO cat_primi FROM public.categories WHERE name = 'Primi Piatti (First Course)' LIMIT 1;
  SELECT id INTO cat_secondi FROM public.categories WHERE name = 'Secondi Piatti (Main Course)' LIMIT 1;
  SELECT id INTO cat_contorni FROM public.categories WHERE name = 'Contorni (Sides)' LIMIT 1;
  SELECT id INTO cat_dolci FROM public.categories WHERE name = 'Dolci (Desserts)' LIMIT 1;
  SELECT id INTO cat_bevande FROM public.categories WHERE name = 'Bevande (Drinks)' LIMIT 1;

  -- ANTIPASTI (Starters)
  INSERT INTO public.menu_items (category_id, name, description, price, available) VALUES
  (cat_antipasti, 'Bruschetta al Pomodoro', 'Toasted bread with fresh tomatoes, basil, and olive oil', 6.50, true),
  (cat_antipasti, 'Caprese Salad', 'Fresh mozzarella, tomatoes, and basil with balsamic glaze', 8.00, true),
  (cat_antipasti, 'Prosciutto e Melone', 'Italian cured ham with fresh cantaloupe', 9.50, true),
  (cat_antipasti, 'Arancini', 'Sicilian rice balls with mozzarella and meat sauce', 7.00, true);

  -- PRIMI PIATTI (First Course)
  INSERT INTO public.menu_items (category_id, name, description, price, available) VALUES
  (cat_primi, 'Spaghetti Carbonara', 'Classic Roman pasta with eggs, pecorino, and guanciale', 14.00, true),
  (cat_primi, 'Penne all''Arrabbiata', 'Spicy tomato sauce with garlic and chili', 12.00, true),
  (cat_primi, 'Fettuccine Alfredo', 'Creamy parmesan sauce with butter', 13.50, true),
  (cat_primi, 'Lasagna Bolognese', 'Layered pasta with meat sauce and béchamel', 15.00, true),
  (cat_primi, 'Risotto ai Funghi', 'Creamy mushroom risotto with parmesan', 14.50, true);

  -- SECONDI PIATTI (Main Course)
  INSERT INTO public.menu_items (category_id, name, description, price, available) VALUES
  (cat_secondi, 'Margherita Pizza', 'Tomato sauce, mozzarella, and fresh basil', 11.00, true),
  (cat_secondi, 'Pizza Quattro Formaggi', 'Four cheese pizza with mozzarella, gorgonzola, parmesan, fontina', 13.50, true),
  (cat_secondi, 'Pollo alla Parmigiana', 'Breaded chicken with tomato sauce and mozzarella', 16.00, true),
  (cat_secondi, 'Saltimbocca alla Romana', 'Veal with prosciutto and sage in white wine sauce', 18.00, true),
  (cat_secondi, 'Osso Buco', 'Braised veal shanks with vegetables and white wine', 22.00, true);

  -- CONTORNI (Sides)
  INSERT INTO public.menu_items (category_id, name, description, price, available) VALUES
  (cat_contorni, 'Insalata Mista', 'Mixed green salad with Italian dressing', 5.00, true),
  (cat_contorni, 'Patate Arrosto', 'Roasted potatoes with rosemary', 4.50, true),
  (cat_contorni, 'Verdure Grigliate', 'Grilled seasonal vegetables', 6.00, true);

  -- DOLCI (Desserts)
  INSERT INTO public.menu_items (category_id, name, description, price, available) VALUES
  (cat_dolci, 'Tiramisu', 'Classic Italian coffee-flavored dessert', 7.50, true),
  (cat_dolci, 'Panna Cotta', 'Vanilla cream custard with berry sauce', 6.50, true),
  (cat_dolci, 'Cannoli Siciliani', 'Crispy pastry shells filled with sweet ricotta', 7.00, true),
  (cat_dolci, 'Gelato', 'Italian ice cream - ask for flavors', 5.00, true);

  -- BEVANDE (Drinks)
  INSERT INTO public.menu_items (category_id, name, description, price, available) VALUES
  (cat_bevande, 'Espresso', 'Strong Italian coffee', 2.50, true),
  (cat_bevande, 'Cappuccino', 'Espresso with steamed milk and foam', 3.50, true),
  (cat_bevande, 'Acqua Minerale', 'Sparkling or still mineral water', 2.00, true),
  (cat_bevande, 'Limonata', 'Fresh homemade lemonade', 3.00, true),
  (cat_bevande, 'Vino Rosso (Glass)', 'House red wine', 6.00, true),
  (cat_bevande, 'Vino Bianco (Glass)', 'House white wine', 6.00, true);

END $$;

-- ============================================
-- ANNOUNCEMENTS
-- ============================================
INSERT INTO public.announcements (title, description, active) VALUES
('Welcome to Ai Cavalli!', 'Order delicious Italian cuisine directly from your phone. Browse our menu and place orders for pickup.', true),
('Weekend Special', 'This Saturday and Sunday: All pasta dishes 20% off! Don''t miss our authentic Italian flavors.', true),
('New Menu Items', 'We''ve added fresh seasonal dishes to our menu. Try our new Risotto ai Funghi and Osso Buco!', true),
('Riding Lessons Update', 'Horse riding lessons now available every Tuesday and Thursday. Sign up at the front desk.', true),
('Holiday Hours', 'We will be closed on December 25th and January 1st. Happy Holidays from the Ai Cavalli family!', false);

-- ============================================
-- DAILY SPECIALS (Optional - for today)
-- ============================================
DO $$
DECLARE
  carbonara_id uuid;
  tiramisu_id uuid;
BEGIN
  SELECT id INTO carbonara_id FROM public.menu_items WHERE name = 'Spaghetti Carbonara' LIMIT 1;
  SELECT id INTO tiramisu_id FROM public.menu_items WHERE name = 'Tiramisu' LIMIT 1;
  
  IF carbonara_id IS NOT NULL THEN
    INSERT INTO public.daily_specials (date, period, menu_item_id)
    VALUES (CURRENT_DATE, 'lunch', carbonara_id)
    ON CONFLICT DO NOTHING;
  END IF;

  IF tiramisu_id IS NOT NULL THEN
    INSERT INTO public.daily_specials (date, period, menu_item_id)
    VALUES (CURRENT_DATE, 'lunch', tiramisu_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Categories created:', COUNT(*) FROM public.categories;
SELECT 'Menu items created:', COUNT(*) FROM public.menu_items;
SELECT 'Announcements created:', COUNT(*) FROM public.announcements;
SELECT 'Daily specials created:', COUNT(*) FROM public.daily_specials;
