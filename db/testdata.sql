-- Rollen
INSERT INTO webshop.Roles (roleName) VALUES
  ('user'),
  ('admin');

-- Benutzer
INSERT INTO webshop.Users (name, password, email, isBanned, isVerified, createdAt) VALUES
  ( 'admin2', '$2b$10$aFcNkMCp5MTydjaSRCfQ1O3WjkqPmNozdQMQQGplm7OlwqidbBJkS', 'admin@letzteHaltestelle.de', FALSE, TRUE, NOW()), -- password is admin
  ( 'User', '$2b$10$dNkEhSw0iZqujO6rIzvhQ.RpLwwwyNwiWQkyzjDnm8vIoJKVGciTi', 'user@mail.de', FALSE, TRUE, NOW()), -- password is test
  ( 'Unverified', '$2b$10$dNkEhSw0iZqujO6rIzvhQ.RpLwwwyNwiWQkyzjDnm8vIoJKVGciTi', 'unverified@mail.de', FALSE, FALSE, NOW()), -- password is test
  ( 'Banned', '$2b$10$dNkEhSw0iZqujO6rIzvhQ.RpLwwwyNwiWQkyzjDnm8vIoJKVGciTi', 'banned@mail.de', TRUE, TRUE, NOW()); -- password is test

-- Rollenvergabe an Benutzer
INSERT INTO webshop.User_has_Role (userId, roleId) VALUES
  (1, 2), -- admin2 -> admin
  (1, 1), -- admin2 -> user
  (2, 1), -- Unverified -> user
  (3, 1); -- Banned -> user

-- Produkte
INSERT INTO webshop.Products (name, description, amount, price) VALUES
  ('T-Shirt', 'T-Shirt Größe M, zeigt eine Abstraktion unseres Heiligen Sankt Negroberts mit Initialen', 100, 1999),
  ('Hoodie', 'Grauer Hoodie Größe L, zeigt die Initialen unseren Heiligen Sankt Negroberts', 50, 3999),
  ('Cap', 'Baseball Cap, schwarz', 200, 1499),
  ('Sneaker', 'Weiße Sneaker, Größe 42', 30, 6999),
  ('Tasse', 'Tasse für den besonderen Genuß von Heißgetränken und Erinnerungsstück an den Heiligen', 150, 1099),
  ('Schlüsselanhänger', 'Für den stetigen Begleiter im Alltag', 150, 599),
  ('Aufkleber', 'Zur Verbreitung der frohen Kunde', 250, 299),
  ('Handyhülle', 'Für den stetigen Begleiter im Alltag und als Schutz vor schädlicher Strahlung des Mobilgeräts für ein iPhone 15 ', 80, 1999),
  ('Kissen', 'Als Verschönerung des Wohnraums und Bequemlichkeit', 50, 2599);

-- Warenkorb-Einträge
INSERT INTO webshop.CartItems (userId, productId, amount, bought, boughtAt, addedAt) VALUES
  (2, 1, 2, FALSE, NULL, NOW()), -- User hat 2 T-Shirts im Warenkorb
  (2, 3, 1, FALSE, NULL, NOW()), -- User hat 1 Cap im Warenkorb
  (3, 4, 1, FALSE, NULL, NOW()), -- Unverified hat 1 Paar Sneaker im Warenkorb
  (3, 1, 1, TRUE, NOW(), NOW()); -- Unverified hat 1 T-Shirt gekauft

-- Wunschlisten
INSERT INTO webshop.Wishlists (name, description) VALUES
  ('Wunschliste von User', 'Alles was ich mir wünsche'),
  ('Unverified wünscht sich', 'Lieblingsprodukte von Unverified');

-- Wishlist-Rollen
INSERT INTO webshop.WishlistRoles (roleName) VALUES
  ('owner'),
  ('write'),
  ('read');

-- Verknüpfung User <-> Wishlist <-> Rolle
INSERT INTO webshop.User_wishlist_relation (userId, wishlistId, wishlistRoleId) VALUES
  (2, 1, 1), -- User ist owner seiner Liste
  (3, 1, 3), -- Unverified sieht User seine Liste
  (3, 2, 1), -- Unverified ist owner seiner Liste
  (2, 2, 2); -- User darf Unverified liste bearbeiten

-- Wunschlisten-Einträge
INSERT INTO webshop.WishlistItems (productId, wishlistId, amount, addedAt) VALUES
  (2, 1, 1, NOW()), -- Hoodie in User Liste
  (3, 1, 2, NOW()), -- 2x Cap in User Liste
  (1, 2, 1, NOW()); -- T-Shirt in Unverified Liste