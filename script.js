// ======================================
// RZXXY IP TRACKER
// Cybersecurity Learning Project
// ======================================

const form = document.getElementById("lookup-form");
const input = document.getElementById("ip-input");
const message = document.getElementById("message");
const button = form.querySelector("button");

function showMessage(text) {
    message.textContent = text;
}

function showValue(id, value) {
    document.getElementById(id).textContent =
        value || "Not available";
}

function resetResults() {
    const fields = [
        "ip",
        "country",
        "city",
        "isp",
        "region",
        "timezone"
    ];

    fields.forEach(id => showValue(id, "---"));
}

async function lookupIP(ip = "") {
    const endpoint = ip
        ? `https://ipwho.is/${encodeURIComponent(ip)}`
        : "https://ipwho.is/";

    showMessage("Scanning network information...");
    button.disabled = true;
    button.textContent = "SCANNING...";

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error("Network request failed.");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(
                data.message || "IP lookup failed."
            );
        }

        showValue("ip", data.ip);
        showValue("country", data.country);
        showValue("city", data.city);
        showValue(
            "isp",
            data.connection?.isp
        );
        showValue("region", data.region);
        showValue(
            "timezone",
            data.timezone?.id
        );

        showMessage(
            "✓ Lookup completed successfully."
        );

    } catch (error) {
        resetResults();

        showMessage(
            "Lookup failed. Check the IP address " +
            "and your internet connection, then try again."
        );

        console.error("IP lookup error:", error);

    } finally {
        button.disabled = false;
        button.textContent = "SCAN IP ↗";
    }
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const ip = input.value.trim();

    if (ip.length > 45) {
        showMessage("Please enter a valid IP address.");
        return;
    }

    lookupIP(ip);
});

showMessage("Ready to start a lookup.");
