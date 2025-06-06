-- Rollen
INSERT INTO webshop.Roles (roleName) VALUES
  ('user'),
  ('admin');

-- Benutzer
INSERT INTO webshop.Users (name, password, email, isBanned, isVerified, createdAt) VALUES
  ('admin', 'admin', 'admin@letzteHaltestelle.de', FALSE, TRUE, NOW()),
  ('moritz', 'moritz', 'moritz@letzteHaltestelle.de', FALSE, TRUE, NOW()),
  ('leon', 'leon', 'leon@salenbacher.com', FALSE, TRUE, NOW());

-- Rollenvergabe an Benutzer
INSERT INTO webshop.User_has_Role (userId, roleId) VALUES
  (1, 2), -- admin -> admin
  (1, 1), -- admin -> user
  (2, 1), -- moritz -> user
  (3, 1); -- leon -> user

-- Produkte
INSERT INTO webshop.Products (name, description, amount, price) VALUES
  ('T-Shirt', 'Schwarzes T-Shirt, Größe M', 100, 1999),
  ('Hoodie', 'Grauer Hoodie, Größe L', 50, 3999),
  ('Cap', 'Baseball Cap, schwarz', 200, 1499),
  ('Sneaker', 'Weiße Sneaker, Größe 42', 30, 6999);

-- Warenkorb-Einträge
INSERT INTO webshop.CartItems (userId, productId, amount, bought, boughtAt, addedAt) VALUES
  (2, 1, 2, FALSE, NULL, NOW()), -- moritz hat 2 T-Shirts im Warenkorb
  (2, 3, 1, FALSE, NULL, NOW()), -- moritz hat 1 Cap im Warenkorb
  (3, 4, 1, FALSE, NULL, NOW()), -- leon hat 1 Paar Sneaker im Warenkorb
  (3, 1, 1, TRUE, NOW(), NOW()); -- leon hat 1 T-Shirt gekauft

-- Wunschlisten
INSERT INTO webshop.Wishlists (name, description) VALUES
  ('Moritz Wunschliste', 'Alles was Moritz sich wünscht'),
  ('Leons Liste', 'Lieblingsprodukte von Leon');

-- Wishlist-Rollen
INSERT INTO webshop.WishlistRoles (roleName) VALUES
  ('owner'),
  ('writer'),
  ('viewer');

-- Verknüpfung User <-> Wishlist <-> Rolle
INSERT INTO webshop.User_wishlist_relation (userId, wishlistId, wishlistRoleId) VALUES
  (2, 1, 1), -- moritz ist owner seiner Liste
  (3, 1, 3), -- leon sieht moritz seine Liste
  (3, 2, 1), -- leon ist owner seiner Liste
  (2, 2, 3), -- moritz darf leons liste ansehen
  (2, 2, 2); -- moritz darf leons liste bearbeiten

-- Wunschlisten-Einträge
INSERT INTO webshop.WishlistItems (productId, wishlistId, amount, addedAt) VALUES
  (2, 1, 1, NOW()), -- Hoodie in Moritz Liste
  (3, 1, 2, NOW()), -- 2x Cap in Moritz Liste
  (1, 2, 1, NOW()); -- T-Shirt in Leons Liste