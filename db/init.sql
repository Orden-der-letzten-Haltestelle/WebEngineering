-- Erstellen des Schemas
CREATE SCHEMA IF NOT EXISTS webshop;

-- Nutzen des Schemas
SET search_path TO webshop;

-- Tabelle Users
CREATE TABLE IF NOT EXISTS Users (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  isBanned BOOLEAN DEFAULT FALSE,
  isVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelle Roles
CREATE TABLE IF NOT EXISTS Roles (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  roleName VARCHAR(100)
);

-- Tabelle Users_has_Roles
CREATE TABLE IF NOT EXISTS User_has_Role (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  userId INTEGER REFERENCES Users(id),
  roleId INTEGER REFERENCES Roles(id)
);

-- Tabelle Product
CREATE TABLE IF NOT EXISTS Products (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  amount INTEGER,
  price INTEGER
);

-- Tabelle Cart
CREATE TABLE IF NOT EXISTS CartItems (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  userId INTEGER REFERENCES Users(id),
  productId INTEGER REFERENCES Products(id),
  amount INTEGER,
  bought BOOLEAN,
  boughtAt TIMESTAMP,
  addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelle Wishlist
CREATE TABLE IF NOT EXISTS Wishlists (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR(100),
  description TEXT
);

-- Tabelle WishlistRoles
CREATE TABLE IF NOT EXISTS WishlistRoles (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  roleName VARCHAR(100)
);

-- Tabelle User_wishlist_relation
CREATE TABLE IF NOT EXISTS User_wishlist_relation (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  userId INTEGER REFERENCES Users(id),
  wishlistId INTEGER REFERENCES Wishlists(id),
  wishlistRoleId INTEGER REFERENCES WishlistRoles(id)
);

-- Tabelle WishlistItem
CREATE TABLE IF NOT EXISTS WishlistItems (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  productId INTEGER REFERENCES Products(id),
  wishlistId INTEGER REFERENCES Wishlists(id),
  amount INTEGER,
  addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: webshop.verificationtokens
CREATE TABLE IF NOT EXISTS webshop.verificationtokens(
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  email VARCHAR(100),
  usecase VARCHAR(100) DEFAULT 'verify',
  token VARCHAR(100)
);