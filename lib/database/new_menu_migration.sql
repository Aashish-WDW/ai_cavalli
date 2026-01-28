-- ============================================
-- MENU MIGRATION SCRIPT
-- Remove old categories and menu items, insert new structure
-- ============================================

-- Step 1: Delete all foreign key dependencies first
-- Delete daily specials (references menu_items)
DELETE FROM public.daily_specials;

-- Delete order items (references menu_items)
DELETE FROM public.order_items;

-- Step 2: Delete all existing menu items
DELETE FROM public.menu_items;

-- Step 3: Delete all existing categories
DELETE FROM public.categories;

-- Step 4: Insert new categories with proper sort order
INSERT INTO public.categories (name, sort_order) VALUES
('Snacks - Veg', 1),
('Snacks - Non Veg', 2),
('Beverages', 3),
('Breakfast', 4),
('Fresh Drinks', 5),
('Starters', 6),
('Soups', 7),
('Salads', 8),
('Pasta - Veg', 9),
('Pasta - Non Veg', 10),
('Desserts - Ice Cream', 11),
('Desserts - Cakes', 12);

-- Step 5: Insert all menu items
DO $$
DECLARE
  cat_snacks_veg uuid;
  cat_snacks_non_veg uuid;
  cat_beverages uuid;
  cat_breakfast uuid;
  cat_fresh_drinks uuid;
  cat_starters uuid;
  cat_soups uuid;
  cat_salads uuid;
  cat_pasta_veg uuid;
  cat_pasta_non_veg uuid;
  cat_desserts_ice_cream uuid;
  cat_desserts_cakes uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_snacks_veg FROM public.categories WHERE name = 'Snacks - Veg' LIMIT 1;
  SELECT id INTO cat_snacks_non_veg FROM public.categories WHERE name = 'Snacks - Non Veg' LIMIT 1;
  SELECT id INTO cat_beverages FROM public.categories WHERE name = 'Beverages' LIMIT 1;
  SELECT id INTO cat_breakfast FROM public.categories WHERE name = 'Breakfast' LIMIT 1;
  SELECT id INTO cat_fresh_drinks FROM public.categories WHERE name = 'Fresh Drinks' LIMIT 1;
  SELECT id INTO cat_starters FROM public.categories WHERE name = 'Starters' LIMIT 1;
  SELECT id INTO cat_soups FROM public.categories WHERE name = 'Soups' LIMIT 1;
  SELECT id INTO cat_salads FROM public.categories WHERE name = 'Salads' LIMIT 1;
  SELECT id INTO cat_pasta_veg FROM public.categories WHERE name = 'Pasta - Veg' LIMIT 1;
  SELECT id INTO cat_pasta_non_veg FROM public.categories WHERE name = 'Pasta - Non Veg' LIMIT 1;
  SELECT id INTO cat_desserts_ice_cream FROM public.categories WHERE name = 'Desserts - Ice Cream' LIMIT 1;
  SELECT id INTO cat_desserts_cakes FROM public.categories WHERE name = 'Desserts - Cakes' LIMIT 1;

  -- SNACKS - VEG
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_snacks_veg, 'Butter Popcorn', 135, true),
  (cat_snacks_veg, 'Potato Wedges', 150, true),
  (cat_snacks_veg, 'French Fries', 140, true),
  (cat_snacks_veg, 'Potato Smileys', 165, true),
  (cat_snacks_veg, 'Veg Nuggets', 165, true),
  (cat_snacks_veg, 'Vegetable Sandwich', 150, true),
  (cat_snacks_veg, 'Vegetable & Cheese Sandwich (Grilled)', 180, true),
  (cat_snacks_veg, 'Grilled Cheese Sandwich', 170, true),
  (cat_snacks_veg, 'Grilled Chilli Cheese Sandwich', 175, true),
  (cat_snacks_veg, 'Mushroom Cheese Sandwich', 180, true),
  (cat_snacks_veg, 'Grilled Tomato Basil Cheese Sandwich', 190, true),
  (cat_snacks_veg, 'Nutella Sandwich', 160, true),
  (cat_snacks_veg, 'Peanut Butter Sandwich', 160, true),
  (cat_snacks_veg, 'Cheese Chapati', 150, true),
  (cat_snacks_veg, 'Pancake with Maple Syrup / Honey', 190, true),
  (cat_snacks_veg, 'Veg Spring Roll / Samosa (4 pcs)', 190, true);

  -- SNACKS - NON VEG
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_snacks_non_veg, 'Chicken & Cheese Sandwich', 260, true),
  (cat_snacks_non_veg, 'Chicken Mayonnaise Sandwich', 250, true),
  (cat_snacks_non_veg, 'Tuna Mayonnaise Sweetcorn Sandwich', 280, true),
  (cat_snacks_non_veg, 'Club Sandwich', 295, true),
  (cat_snacks_non_veg, 'Bacon Lettuce Tomato Sandwich', 260, true),
  (cat_snacks_non_veg, 'Egg & Cheese Sandwich', 220, true),
  (cat_snacks_non_veg, 'Egg Mayonnaise Sandwich', 240, true),
  (cat_snacks_non_veg, 'Masala Egg Sandwich', 160, true),
  (cat_snacks_non_veg, 'Egg Sandwich', 140, true),
  (cat_snacks_non_veg, 'Mutton Samosa (4 pcs)', 290, true),
  (cat_snacks_non_veg, 'Chicken Spring Roll / Samosa (4 pcs)', 240, true),
  (cat_snacks_non_veg, 'Omelet Roll', 160, true),
  (cat_snacks_non_veg, 'Chicken Nuggets', 250, true),
  (cat_snacks_non_veg, 'Grilled Cheese & Bacon Sandwich', 290, true);

  -- BEVERAGES
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_beverages, 'Tea / Filter Coffee', 45, true),
  (cat_beverages, 'Black Tea / Coffee / Earl Grey / Green Tea', 40, true),
  (cat_beverages, 'Tulsi Green Tea / Darjeeling Tea / Typhoo Tea / Black Lemon Tea / English Breakfast Tea', 40, true),
  (cat_beverages, 'Ginger Tea', 50, true),
  (cat_beverages, 'Masala Tea', 55, true),
  (cat_beverages, 'Espresso', 65, true),
  (cat_beverages, 'Tang Juice', 60, true),
  (cat_beverages, 'Tropicana Juice', 38, true),
  (cat_beverages, 'Cold Coffee Can', 45, true),
  (cat_beverages, 'Diet Coke', 50, true),
  (cat_beverages, 'Cold Drinks 300ml', 25, true),
  (cat_beverages, 'Mineral Water 500ml', 10, true);

  -- BREAKFAST
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_breakfast, 'Chocos / Oats / Cornflakes', 95, true),
  (cat_breakfast, 'Toast with Butter & Jam', 80, true),
  (cat_breakfast, 'Masala Omelette / Egg Bhurji', 160, true),
  (cat_breakfast, 'Masala Cheese Omelette', 180, true),
  (cat_breakfast, 'Plain Omelette / Sunny Side Up / Fried Eggs', 140, true),
  (cat_breakfast, 'Mushroom Omelette', 150, true),
  (cat_breakfast, 'Mushroom Cheese Omelette', 190, true),
  (cat_breakfast, 'Boiled Egg with Toast & Butter', 90, true),
  (cat_breakfast, 'Scramble Egg', 140, true),
  (cat_breakfast, 'Cheese Omelette', 170, true),
  (cat_breakfast, 'Bacon Omelette', 240, true),
  (cat_breakfast, 'Bacon Cheese Omelette', 290, true),
  (cat_breakfast, 'Fried Bacon', 370, true),
  (cat_breakfast, 'French Toast (2 pcs)', 220, true);

  -- FRESH DRINKS
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_fresh_drinks, 'Cold Coffee', 95, true),
  (cat_fresh_drinks, 'Watermelon Juice', 85, true),
  (cat_fresh_drinks, 'Watermelon Mojito', 170, true),
  (cat_fresh_drinks, 'Virgin Mojito', 150, true),
  (cat_fresh_drinks, 'Lemonade', 65, true),
  (cat_fresh_drinks, 'Lime Soda', 95, true),
  (cat_fresh_drinks, 'Milkshake (Chocolate / Vanilla / Strawberry)', 150, true),
  (cat_fresh_drinks, 'Buttermilk', 135, true);

  -- STARTERS
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_starters, 'Bruschetta Tomato Basil (8 pcs)', 240, true),
  (cat_starters, 'Bruschetta Tomato & Mozzarella (8 pcs)', 290, true),
  (cat_starters, 'Bruschetta Tuna & Mayonnaise (8 pcs)', 320, true),
  (cat_starters, 'Bruschetta Chicken Mayonnaise (8 pcs)', 295, true),
  (cat_starters, 'Chicken Finger with Tartar Sauce (6 pcs)', 390, true),
  (cat_starters, 'Fish Finger with Tartar Sauce (6 pcs)', 450, true),
  (cat_starters, 'Bacon Wrapped Smokies (6 pcs)', 490, true),
  (cat_starters, 'Crispy Fried Shrimps with Tartar Sauce', 495, true);

  -- SOUPS
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_soups, 'Mushroom Soup', 160, true),
  (cat_soups, 'Tomato Soup', 150, true),
  (cat_soups, 'Sweet Corn Soup', 160, true),
  (cat_soups, 'Mixed Vegetable Soup', 180, true),
  (cat_soups, 'Chicken Soup', 200, true);

  -- SALADS
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_salads, 'Fruit Salad', 380, true),
  (cat_salads, 'Mixed Green Salad', 290, true),
  (cat_salads, 'Tomato Mozzarella Basil Skewers', 295, true),
  (cat_salads, 'Caprese Salad', 350, true),
  (cat_salads, 'Fusilli & Mozzarella Cheese Salad', 380, true),
  (cat_salads, 'Penne & Tuna Salad', 420, true),
  (cat_salads, 'Apple & Walnut Salad', 330, true),
  (cat_salads, 'Greek Salad', 350, true),
  (cat_salads, 'Coleslaw Salad', 250, true),
  (cat_salads, 'Watermelon Walnut Feta Salad', 360, true),
  (cat_salads, 'Waldorf Salad', 420, true),
  (cat_salads, 'Couscous Salad', 380, true);

  -- PASTA - VEG
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_pasta_veg, 'Aglio Olio', 485, true),
  (cat_pasta_veg, 'Al Pomodoro', 465, true),
  (cat_pasta_veg, 'Green Olive & Basil Tomato Sauce', 475, true),
  (cat_pasta_veg, 'Alfredo (Mushroom Cream Sauce)', 495, true),
  (cat_pasta_veg, 'Primavera', 510, true),
  (cat_pasta_veg, 'Pesto Sauce Pasta', 515, true),
  (cat_pasta_veg, 'Ravioli Spinach Tomato Sauce', 520, true);

  -- PASTA - NON VEG
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_pasta_non_veg, 'Pesto & Chicken Pasta', 580, true),
  (cat_pasta_non_veg, 'Chicken Cream Pasta', 565, true),
  (cat_pasta_non_veg, 'Bolognese (Minced Mutton)', 595, true),
  (cat_pasta_non_veg, 'Carbonara (Bacon Cream Sauce)', 615, true),
  (cat_pasta_non_veg, 'Tomato Sauce & Prawns Pasta', 615, true);

  -- DESSERTS - ICE CREAM
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_desserts_ice_cream, 'Vanilla', 80, true),
  (cat_desserts_ice_cream, 'Strawberry', 90, true),
  (cat_desserts_ice_cream, 'Chocolate', 90, true);

  -- DESSERTS - CAKES
  INSERT INTO public.menu_items (category_id, name, price, available) VALUES
  (cat_desserts_cakes, 'Almond Chocolate Cake', 130, true),
  (cat_desserts_cakes, 'Lemon Curd Cake', 95, true),
  (cat_desserts_cakes, 'Chocolate Ganache Cake', 110, true),
  (cat_desserts_cakes, 'Apple Crumble Cake', 120, true),
  (cat_desserts_cakes, 'Strawberry Cream Cake', 125, true);

END $$;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Categories created:', COUNT(*) FROM public.categories;
SELECT 'Menu items created:', COUNT(*) FROM public.menu_items;

-- Show categories
SELECT * FROM public.categories ORDER BY sort_order;

-- Show count per category
SELECT 
  c.name as category_name,
  COUNT(m.id) as item_count
FROM public.categories c
LEFT JOIN public.menu_items m ON c.id = m.category_id
GROUP BY c.name, c.sort_order
ORDER BY c.sort_order;
