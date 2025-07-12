import { isTokenGiven,
    isUserAdmin,
 } from "../../helper.js"

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

        //when token given hide signUp Button and show icon buttons
        const iconButtonsContainer = document.getElementById(
            "navbar-icon-container"
        )
        const signupButtonContainer = document.getElementById(
            "signup-button-container"
        )

        //when no token, show signUp button | when token given, show icons
        const tokenGiven = isTokenGiven()
        if (tokenGiven) {
            signupButtonContainer.classList.add("hide")
        } else {
            iconButtonsContainer.classList.add("hide")
        }

        //handle hamburger navigation
        function handleHamburgerNavigation() {
            const hamburgerButton = document.getElementById(
                "navbar-hamburger-button"
            )
            const navbarOverlay = document.querySelector(
                ".navbar-overlay-container"
            )
            const closeButton = document.getElementById(
                "navbar-overlay-close-button"
            )

            if (hamburgerButton && navbarOverlay && closeButton) {
                hamburgerButton.addEventListener("click", () => {
                    navbarOverlay.classList.remove("hide")
                })

                closeButton.addEventListener("click", () => {
                    navbarOverlay.classList.add("hide")
                })
            } else {
                console.error(
                    "Hamburger button or overlay not found after navbar HTML was loaded."
                )
            }
        }
        handleHamburgerNavigation()

            
        const adminLink = document.getElementById(
            "adminLink"
        )
        const adminLinkHamburger = document.getElementById(
            "AdminHamburger"
        )
        const userAdmin= isUserAdmin()
        if (userAdmin) {
            adminLink.classList.add("display")
            adminLinkHamburger.classList.add("display")
        } else {
            adminLink.classList.add("hide")
            adminLinkHamburger.classList.add("hide")
        }

        // Import css
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "http://localhost:3000/components/navbar/navbar.css"
        document.head.appendChild(link)
    } catch (error) {
        console.error("Error loading or processing navbar:", error)
    }

    // Show or not show the admin Link
    // const adminLink = document.getElementById("adminLink");
    // if (adminLink) {
    //     adminLink.style.display = "flex"
    // }
}

// Ensure the main HTML document is ready before attempting to load the navbar
document.addEventListener("DOMContentLoaded", loadNavbar)
