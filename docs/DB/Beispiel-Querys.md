## Data querys

### Alle Nutzer und ihre Rollen
```sql
SELECT 
        u.id, 
        u.name, 
        u.email, 
        r.rolename 
FROM webshop.users as u 
        JOIN webshop.user_has_role as ur ON u.id = ur.userId 
        JOIN webshop.roles as r ON ur.roleid = r.id;
```

### Alle Wunschlisten eines Nutzers und seine jeweiligen rollen
```sql
SELECT 
	u.id as userId, 
	u.name as username, 
	w.id as wishlistId, 
	w.name as wishlistname, 
	w.description, r.rolename as role 
FROM webshop.user_wishlist_relation as wr 
	JOIN webshop.users as u ON u.id = wr.userId
	JOIN webshop.wishlists as w ON w.id = wr.wishlistId
	JOIN webshop.wishlistroles as r ON r.id = wr.wishlistroleid 
WHERE userId = {userId};
```
### Alle Produkte innerhalb einer Wunschliste
```sql
SELECT 
	p.id as productID,
	p.name,
	p.description,
	p.price,
	p.amount as "available Amount",
	wr.amount as "added Amount",
	wr.addedat
FROM webshop.wishlistitems as wr 
	JOIN webshop.products as p ON p.id = wr.productId
WHERE wr.wishlistId = {wishlistId};
```
### Alle Items im Einkaufswagen eines Nutzers
```sql
SELECT 
	p.id as productId,
	p.name,
	p.description,
	p.price,
	c.amount as "Added amount",
	c.addedat	
FROM webshop.cartitems as c
	JOIN webshop.products as p ON p.id = c.productId
WHERE c.userId = {userId} AND c.bought = false;
```

### Alle Items, die ein Nutzer erworben hat **(Order History)**.
```sql
SELECT 
	p.id as productId,
	p.name,
	p.description,
	p.price,
	c.amount as "Added amount",
	c.addedat,
	c.boughtat
FROM webshop.cartitems as c
	JOIN webshop.products as p ON p.id = c.productId
WHERE c.userId = {userId} AND c.bought = true;
```

### Erstelle einen Nutzer
```sql
INSERT INTO 
	webshop.users 
	(name, password, email) 
VALUES 
	('moritz', '1345abcd', 'moritz@ordenletztehaltestelle.de') 
RETURNING id
```

Zuweisung der Rolle eines Nutzers

```sql
INSERT INTO 
	webshop.user_has_role 
	(userid, roleid) 
VALUES 
	(1, 2)
```

### Löschen eines Items im Einkaufswagen

```sql
DELETE FROM 
	webshop.cartitems as c
WHERE
	c.id = $1
RETURNING *
```