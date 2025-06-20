// Function to load the footer HTML and attach event listener for possible about page
async function loadFooter() {
    const footerPlaceholder = document.getElementById("footer-placeholder")

    if (!footerPlaceholder) {
        console.error("Placeholder div with ID 'footer-placeholder' not found.")
        return
    }

    try {
        // Fetch the footer.html content
        const response = await fetch("/components/footer/footer.html")
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const footerHtml = await response.text()

        // Insert the fetched HTML into the placeholder
        footerPlaceholder.innerHTML = footerHtml

        
        // Import css
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "components/footer/footer.css"
        document.head.appendChild(link)
    } catch (error) {
        console.error("Error loading or processing footer:", error)
    }
}


// Ensure the main HTML document is ready before attempting to load the footer
document.addEventListener("DOMContentLoaded", loadFooter)
