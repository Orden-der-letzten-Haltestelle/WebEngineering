-- Rollen
INSERT INTO webshop.Roles (id, roleName) VALUES
  (1, 'user'),
  (2, 'admin');

-- Benutzer
INSERT INTO webshop.Users (id, name, password, email, isBanned, isVerified, createdAt) VALUES
  (1, 'admin', 'admin', 'admin@letzteHaltestelle.de', FALSE, TRUE, NOW()),
  (2, 'moritz', 'moritz', 'moritz@letzteHaltestelle.de', FALSE, TRUE, NOW()),
  (3, 'leon', 'leon', 'leon@salenbacher.com', FALSE, TRUE, NOW());

-- Rollenvergabe an Benutzer
INSERT INTO webshop.User_has_Role (id, userId, roleId) VALUES
  (1, 1, 2), -- admin -> admin
  (2, 1, 1), -- admin -> user
  (3, 2, 1), -- moritz -> user
  (4, 3, 1); -- leon -> user

-- Produkte
INSERT INTO webshop.Products (id, name, description, amount, price) VALUES
  (1, 'T-Shirt', 'Schwarzes T-Shirt, Größe M', 100, 1999),
  (2, 'Hoodie', 'Grauer Hoodie, Größe L', 50, 3999),
  (3, 'Cap', 'Baseball Cap, schwarz', 200, 1499),
  (4, 'Sneaker', 'Weiße Sneaker, Größe 42', 30, 6999);

-- Warenkorb-Einträge
INSERT INTO webshop.CartItems (id, userId, productId, amount, bought, boughtAt, addedAt) VALUES
  (1, 2, 1, 2, FALSE, NULL, NOW()), -- moritz hat 2 T-Shirts im Warenkorb
  (2, 2, 3, 1, FALSE, NULL, NOW()), -- moritz hat 1 Cap im Warenkorb
  (3, 3, 4, 1, FALSE, NULL, NOW()), -- leon hat 1 Paar Sneaker im Warenkorb
  (4, 3, 1, 1, TRUE, NOW(), NOW()); -- leon hat 1 T-Shirt gekauft

-- Wunschlisten
INSERT INTO webshop.Wishlists (id, name, description) VALUES
  (1, 'Moritz Wunschliste', 'Alles was Moritz sich wünscht'),
  (2, 'Leons Liste', 'Lieblingsprodukte von Leon');

-- Wishlist-Rollen
INSERT INTO webshop.WishlistRoles (id, roleName) VALUES
  (1, 'owner'),
  (2, 'writer'),
  (3, 'viewer');

-- Verknüpfung User <-> Wishlist <-> Rolle
INSERT INTO webshop.User_wishlist_relation (id, userId, wishlistId, wishlistRoleId) VALUES
  (1, 2, 1, 1), -- moritz ist owner seiner Liste
  (2, 3, 1, 3), -- leon sieht moritz seine Liste
  (3, 3, 2, 1), -- leon ist owner seiner Liste
  (4, 2, 2, 3), -- moritz darf leons liste ansehen
  (5, 2, 2, 2); -- moritz darf leons liste bearbeiten

-- Wunschlisten-Einträge
INSERT INTO webshop.WishlistItems (id, productId, wishlistId, amount, addedAt) VALUES
  (1, 2, 1, 1, NOW()), -- Hoodie in Moritz Liste
  (2, 3, 1, 2, NOW()), -- 2x Cap in Moritz Liste
  (3, 1, 2, 1, NOW()); -- T-Shirt in Leons Liste