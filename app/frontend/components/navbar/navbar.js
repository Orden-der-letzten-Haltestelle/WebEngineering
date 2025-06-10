// Function to load the navbar HTML and attach event listeners
async function loadNavbar() {
    const headerPlaceholder = document.getElementById("header-placeholder")

    if (!headerPlaceholder) {
        console.error("Placeholder div with ID 'header-placeholder' not found.")
        return
    }

    try {
        // Fetch the navbar.html content
        const response = await fetch("/components/navbar/navbar.html")
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const navbarHtml = await response.text()

        // Insert the fetched HTML into the placeholder
        headerPlaceholder.innerHTML = navbarHtml

        // --- Now that the HTML is loaded, attach event listeners ---
        const filterButton = document.getElementById("filterButton")
        const filterOverlay = document.getElementById("filterOverlay")
        const searchInput = document.getElementById("searchValue")
        const minPriceInput = document.getElementById("minPrice")
        const maxPriceInput = document.getElementById("maxPrice")

        if (filterButton && filterOverlay) {
            filterButton.addEventListener("click", () => {
                filterOverlay.classList.toggle("hide")
            })
            console.log("Filter button event listener attached.")
        } else {
            console.error(
                "Filter button or overlay not found after navbar HTML was loaded."
            )
        }

        //pre fill form
        function fillFormInputsFromUrl() {
            const urlParams = new URLSearchParams(window.location.search)

            // Fill 'value' input (search term)
            const searchValue = urlParams.get("value")
            if (searchInput && searchValue) {
                searchInput.value = searchValue
                console.log(`Search input pre-filled with: ${searchValue}`)
            }

            // Fill 'minPrice' input
            const minPrice = urlParams.get("minPrice")
            if (minPriceInput && minPrice) {
                minPriceInput.value = minPrice
                console.log(`Min price input pre-filled with: ${minPrice}`)
            }

            // Fill 'maxPrice' input
            const maxPrice = urlParams.get("maxPrice")
            if (maxPriceInput && maxPrice) {
                maxPriceInput.value = maxPrice
                console.log(`Max price input pre-filled with: ${maxPrice}`)
            }
        }
        fillFormInputsFromUrl()

        // Import css
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "components/navbar/navbar.css"
        document.head.appendChild(link)
    } catch (error) {
        console.error("Error loading or processing navbar:", error)
    }
}

// Ensure the main HTML document is ready before attempting to load the navbar
document.addEventListener("DOMContentLoaded", loadNavbar)
