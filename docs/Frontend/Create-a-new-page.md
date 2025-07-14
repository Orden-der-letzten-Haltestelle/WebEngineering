
# 📄 Neue Seite erstellen – Frontendstruktur

Dieses Projekt verwendet Express mit EJS als Template-Engine. Seiten bestehen aus modularen Templates, einem zugehörigen PageLoader und optionalem CSS.

---

## 🛠️ Grundstruktur einer Seite

Jede Seite besteht aus:

- `PageName.ejs` – Das Template der Seite
- `PageName.js` – Lädt Daten, die an das Template übergeben werden
- `PageName.css` – (Optional) CSS-Datei für diese Seite

Optional können Komponenten aus dem `components/`-Verzeichnis eingebunden werden (z. Bsp. Buttons, Cards etc.).

---

## ➕ Neue Seite anlegen

### 1. `PageName.ejs` erstellen

Speichere das Template unter:

```
frontend/pages/PageName/PageName.ejs
```

Beispiel (`ContactPage.ejs`):

```ejs
<div id="contactPage-content">
    <h1><%= title %></h1>
    <p><%= message %></p>
</div>
```

---

### 2. `PageName.js` erstellen (PageLoader)

Erstelle die zugehörige Datenladefunktion:

```
frontend/pages/PageName/PageName.js
```

Beispiel (`ContactPage.js`):

```js
export default async function ContactPageLoader(req, res) {
    return {
        title: "Kontakt",
        message: "Nimm gerne Kontakt mit uns auf!",
    }
}
```

---

### 3. `PageName.css` (optional)

Speichere optionales Seiten-CSS im selben Verzeichnis:

```
frontend/pages/PageName/PageName.css
```

Beispiel:

```css
#contactPage-content {
    padding: 2rem;
    color: #333;
}
```

Diese Datei wird automatisch per `<link>`-Tag in das Layout eingebunden.

---

## 🔁 Route eintragen

In `frontend/index.js` fügst du die Route so ein:

```js
import ContactPageLoader from "./pages/contact/ContactPage.js"

router.get("/contact", async (req, res) => {
    const pageData = await ContactPageLoader(req, res)
    const pagePath = "pages/contact/ContactPage"

    renderPage(res, pagePath, pageData, {
        excludeNavbar: false,
        excludeFooter: false,
    })
})
```

---

## 🧠 Wiederverwendbare Komponenten

Im Verzeichnis `frontend/components/` können kleinere UI-Komponenten erstellt werden:

```
frontend/components/Button.ejs
frontend/components/ProductCard.ejs
```

Verwendung in Templates:

```ejs
<%- include("../../components/Button", { label: "Jetzt kaufen" }) %>
```

---


### WICHTIG: CSS automatisch laden über den PageLoader
Damit die CSS-Datei der verwendeten Komponente automatisch in die Seite eingebunden wird, musst du im jeweiligen PageLoader-Modul die Komponente(n) im components-Array angeben.

```javascript
export default async function WishlistPageLoader(req, res) {
    return {
        title: "WishlistPage",
        beispielComponents: [
            { title: "1. Element", text: "Das ist der Text des ersten Elements" },
            { title: "2. Element", text: "Das ist der Text des zweiten Elements" },
            { title: "3. Element", text: "Das ist der Text des dritten Elements" },
            { title: "4. Element", text: "Das ist der Text des vierten Elements" },
        ],
        components: ["BeispielComponent"], // Wichtig: CSS wird so automatisch eingebunden
    }
}
```
Das System bindet dann automatisch für jede Komponente die CSS-Datei /components/<ComponentName>/<ComponentName>.css ein.



Beispiel (WishlistPageLoader):
## 🔧 renderPage() – Seiten-Renderer

Die Funktion `renderPage()` übernimmt:

- Übergabe der Page-Daten an das Layout `index.ejs`
- Dynamisches Einbinden des Seitentemplates via `<%- include(...) %>`
- Automatisches Setzen des korrekten CSS-Links

Beispielhafte Implementierung:

```js
function renderPage(res, pagePath, pageData = {}, layoutOptions = {}) {
    const cssFile = path.basename(pagePath) + ".css"

    res.render("index", {
        ...layoutOptions,
        title: pageData.title || "Webshop",
        cssFile,
        pageTemplate: pagePath,
        pageData
    })
}
```

---

## 📄 `index.ejs` Layout-Template

In der Datei `frontend/index.ejs`:

```ejs
<main>
    <%- include(pageTemplate, pageData) %>
</main>
```

---

## ✅ Zusammenfassung

| Datei           | Zweck                                                  |
|-----------------|--------------------------------------------------------|
| `PageName.ejs`  | HTML-Template der Seite                                |
| `PageName.js`   | Lädt und übergibt Seitendaten                          |
| `PageName.css`  | (Optional) CSS nur für diese Seite                     |
| `components/`   | Wiederverwendbare UI-Elemente                          |
| `renderPage()`  | Rendert Layout + Seite + bindet Daten & CSS ein        |

---

## 📌 Hinweise

- Nutze `excludeNavbar` / `excludeFooter` bei Login/Register etc.
- Layout-Datei ist `frontend/index.ejs`
- Seiten befinden sich in `frontend/pages/`
- Es wird keine `ejs`-Bibliothek direkt verwendet – nur Express’ `res.render()`
