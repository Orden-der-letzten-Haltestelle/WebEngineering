-- Rollen
INSERT INTO webshop.Roles (roleName) VALUES
  ('user'),
  ('admin');

-- Benutzer
INSERT INTO webshop.Users (name, password, email, isBanned, isVerified, createdAt) VALUES
  ( 'admin', '$2b$10$aFcNkMCp5MTydjaSRCfQ1O3WjkqPmNozdQMQQGplm7OlwqidbBJkS', 'admin@letzteHaltestelle.de', FALSE, TRUE, NOW()), -- password is admin
  ( 'moritz', '$2b$10$sIdNQt3or1jrca7ZUKVl7OHh3aXrCo3kXdFP3/k9J5ckfFOBKDYt6', 'tg2020.45059@gmail.com', FALSE, TRUE, NOW()), -- password is moritz
  ( 'leon', '$2b$10$FhmNHW7wN4Q2p0FLTPzYQOIxz4QE9EoB0RI82B8bKsXE0M5rKAnm6', 'leon@salenbacher.com', FALSE, TRUE, NOW()), -- password is leon
  ( 'rosalie', '$2b$10$dNkEhSw0iZqujO6rIzvhQ.RpLwwwyNwiWQkyzjDnm8vIoJKVGciTi', 'scaramouche5@web.de', FALSE, TRUE, NOW()), -- password is test
  ( 'sophie', '$2b$10$dNkEhSw0iZqujO6rIzvhQ.RpLwwwyNwiWQkyzjDnm8vIoJKVGciTi', 'inf24170@lehre.dhbw-stuttgart.de', FALSE, TRUE, NOW()), -- password is test
  ( 'oliver', '$2b$10$dNkEhSw0iZqujO6rIzvhQ.RpLwwwyNwiWQkyzjDnm8vIoJKVGciTi', 'inf24229@lehre.dhbw-stuttgart.de', FALSE, TRUE, NOW()), -- password is test
  ( 'niklas', '$2b$10$dNkEhSw0iZqujO6rIzvhQ.RpLwwwyNwiWQkyzjDnm8vIoJKVGciTi', 'nikreu06@gmail.com', FALSE, TRUE, NOW()); -- password is test

-- Rollenvergabe an Benutzer
INSERT INTO webshop.User_has_Role (userId, roleId) VALUES
  (1, 2), -- admin -> admin
  (1, 1), -- admin -> user
  (2, 1), -- moritz -> user
  (3, 1), -- leon -> user
  (3, 2), -- leon -> admin
  (4, 1), -- rosalie -> user
  (4, 2), -- rosalie -> admin
  (5, 1), -- sophie -> user
  (5, 2), -- sophie -> admin
  (6, 1), -- oliver -> user
  (6, 2), -- oliver -> admin
  (7, 1), -- niklas -> user
  (7, 2); -- niklas -> admin

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
  ('write'),
  ('read');

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