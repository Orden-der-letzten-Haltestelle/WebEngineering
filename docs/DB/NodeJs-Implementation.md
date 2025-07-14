## ⚙️ Configuration

In Docker Compose we use the `postgres:16` image and the following enironment:

```yaml
environment:
  POSTGRES_DB: webshop
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
```

## 💬 Connect via NodeJS

```js
const { Pool } = require('pg');

// Create the Pool which will connect to the DB
const pool = new Pool({host: ,user: ,password: , database: });

// Example Query
const result = await pool.query('SELECT * FROM webshop.products');
const data = JSON.stringify(result.rows);
```

## 📝 Multi Querys

```js
try {
        await pool.query("BEGIN")
        // Do everything needed to be done in correct order
        await pool.query("COMMIT")
} catch (error) {
        await pool.query("ROLLBACK")
        throw error
}
```