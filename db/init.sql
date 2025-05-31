-- Erstellen des Schemas
CREATE SCHEMA IF NOT EXISTS webshop;

-- Nutzen des Schemas
SET search_path TO webshop;

-- Tabelle Users
CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45),
  password VARCHAR(45),
  email VARCHAR(45),
  isBanned SMALLINT,
  isVerified SMALLINT
);

-- Tabelle Roles
CREATE TABLE IF NOT EXISTS Roles (
  id SERIAL PRIMARY KEY,
  roleName VARCHAR(45)
);

-- Tabelle Users_has_Roles
CREATE TABLE IF NOT EXISTS Users_has_Roles (
  id SERIAL PRIMARY KEY,
  UsersId INTEGER REFERENCES Users(id),
  RolesId INTEGER REFERENCES Roles(id)
);

-- Tabelle Product
CREATE TABLE IF NOT EXISTS Products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45),
  description VARCHAR(45),
  amount INTEGER,
  price INTEGER
);

-- Tabelle Cart
CREATE TABLE IF NOT EXISTS CartItem (
  id SERIAL PRIMARY KEY,
  UsersId INTEGER REFERENCES Users(id),
  ProducId INTEGER REFERENCES Products(id),
  amount INTEGER
);

-- Tabelle Wishlist
CREATE TABLE IF NOT EXISTS Wishlist (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45),
  description VARCHAR(45)
);

-- Tabelle WishlistRoles
CREATE TABLE IF NOT EXISTS WishlistRoles (
  id SERIAL PRIMARY KEY,
  roleName VARCHAR(45)
);

-- Tabelle User_wishlist_relation
CREATE TABLE IF NOT EXISTS User_wishlist_relation (
  id SERIAL PRIMARY KEY,
  UsersId INTEGER REFERENCES Users(id),
  WishlistId INTEGER REFERENCES Wishlist(id),
  WishlistRolesId INTEGER REFERENCES WishlistRoles(id)
);

-- Tabelle WishlistItem
CREATE TABLE IF NOT EXISTS WishlistItem (
  id SERIAL PRIMARY KEY,
  ProductId INTEGER REFERENCES Products(id),
  WishlistId INTEGER REFERENCES Wishlist(id),
  amount INTEGER
);

