document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("calculator-overlay");
    const websiteCalc = document.getElementById("website-calculator");
    const videoCalc = document.getElementById("video-calculator");
    const openWebsiteBtn = document.getElementById("open-calculator");
    const openVideoBtn = document.getElementById("open-video-calculator");
    const closeBtns = overlay.querySelectorAll(".close-btn");

    // ---------------------------
    // Overlay open/close handling
    // ---------------------------

    openWebsiteBtn.addEventListener("click", () => {
        overlay.style.display = "flex";
        websiteCalc.style.display = "block";
        videoCalc.style.display = "none";
        requestAnimationFrame(() => overlay.classList.add("show"));
    });

    openVideoBtn.addEventListener("click", () => {
        overlay.style.display = "flex";
        videoCalc.style.display = "block";
        websiteCalc.style.display = "none";
        requestAnimationFrame(() => overlay.classList.add("show"));
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
        overlay.classList.remove("show");
        setTimeout(() => {
            overlay.style.display = "none";
            websiteCalc.style.display = "none";
            videoCalc.style.display = "none";
        }, 300);
        });
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
        overlay.classList.remove("show");
        setTimeout(() => {
            overlay.style.display = "none";
            websiteCalc.style.display = "none";
            videoCalc.style.display = "none";
        }, 300);
        }
    });

    // ---------------------------
    // Website Calculator Logic
    // ---------------------------
    const buttons = document.querySelectorAll(".service-btn");
    const totalElement = document.getElementById("total");
    const selectedServicesElement = document.getElementById("selected-services");
    const toggleSelectBtn = document.getElementById("toggle-select");
    const packageButtons = document.querySelectorAll(".package-btn");

    let total = 0;
    let allSelected = false;
    let selectedServices = [];

    const packages = {
        bronze: [1, 2, 3, 7, 8, 14],
        silver: [1, 2, 3, 4, 6, 7, 8, 11, 14],
        gold: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13, 14],
        platinum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    };

    const updateTotal = () => {
        totalElement.textContent = total.toFixed(2);
    };

    const updateSelectedServices = () => {
        selectedServicesElement.innerHTML = "";

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.margin = "0 auto";
        table.style.fontSize = ".8rem";
        table.style.tableLayout = "auto";

        selectedServices.forEach(service => {
        const row = document.createElement("tr");
        row.style.opacity = 0;
        row.style.transition = "opacity 0.5s ease-in-out";

        const nameCell = document.createElement("td");
        nameCell.textContent = service.name;
        nameCell.style.borderRight = "1px solid white";
        nameCell.style.padding = "12px";

        const priceCell = document.createElement("td");
        priceCell.textContent = `£${service.price.toFixed(2)}`;
        priceCell.style.borderLeft = "1px solid white";
        priceCell.style.padding = "12px";

        row.appendChild(nameCell);
        row.appendChild(priceCell);
        table.appendChild(row);

        requestAnimationFrame(() => row.style.opacity = 1);
        });

        selectedServicesElement.appendChild(table);
    };

    const clearSelection = () => {
        buttons.forEach(button => {
        if (button.classList.contains("selected")) {
            const price = parseFloat(button.getAttribute("data-price"));
            const name = button.textContent;
            button.classList.remove("selected");
            total -= price;
            selectedServices = selectedServices.filter(service => service.name !== name);
        }
        });
        packageButtons.forEach(btn => btn.classList.remove("selected"));
        updateSelectedServices();
    };

    buttons.forEach(button => {
        button.addEventListener("click", () => {
        const price = parseFloat(button.getAttribute("data-price"));
        const name = button.textContent;

        if (button.classList.contains("selected")) {
            button.classList.remove("selected");
            total -= price;
            selectedServices = selectedServices.filter(service => service.name !== name);
        } else {
            button.classList.add("selected");
            total += price;
            selectedServices.push({ name, price });
        }

        updateTotal();
        updateSelectedServices();
        });
    });

    packageButtons.forEach(packageBtn => {
        packageBtn.addEventListener("click", () => {
        const packageName = packageBtn.getAttribute("data-package");
        const serviceIds = packages[packageName];

        clearSelection();

        serviceIds.forEach(id => {
            const button = document.querySelector(`.service-btn[data-id="${id}"]`);
            if (button && !button.classList.contains("selected")) {
            const price = parseFloat(button.getAttribute("data-price"));
            const name = button.textContent;
            button.classList.add("selected");
            total += price;
            selectedServices.push({ name, price });
            }
        });

        packageBtn.classList.add("selected");
        updateTotal();
        updateSelectedServices();
        });
    });

    toggleSelectBtn.addEventListener("click", () => {
        if (allSelected) {
        clearSelection();
        toggleSelectBtn.textContent = "Select All";
        } else {
        buttons.forEach(button => {
            if (!button.classList.contains("selected")) {
            const price = parseFloat(button.getAttribute("data-price"));
            const name = button.textContent;
            button.classList.add("selected");
            total += price;
            selectedServices.push({ name, price });
            }
        });
        toggleSelectBtn.textContent = "Unselect All";
        }
        allSelected = !allSelected;
        updateTotal();
        updateSelectedServices();
    });

    // ---------------------------
    // Video Calculator Logic
    // ---------------------------
    let videoType = "2d"; 
    let mode = "custom"; 
    let currentPackage = null;

    const videoPackages = {
        bronze: { characters: 1, vans: 0, voiceovers: 1, seconds: 30 },
        silver: { characters: 2, vans: 1, voiceovers: 2, seconds: 60 },
        gold: { characters: 3, vans: 2, voiceovers: 3, seconds: 90 },
    };

    function calculatePrice() {
        let characters, vans, voiceovers, seconds;

        if (mode === "package" && currentPackage) {
        ({ characters, vans, voiceovers, seconds } = videoPackages[currentPackage]);
        document.getElementById("characters").value = characters;
        document.getElementById("vans").value = vans;
        document.getElementById("voiceovers").value = voiceovers;
        document.getElementById("seconds").value = seconds;
        updateSliderFill();
        } else {
        characters = parseInt(document.getElementById("characters").value) || 0;
        vans = parseInt(document.getElementById("vans").value) || 0;
        voiceovers = parseInt(document.getElementById("voiceovers").value) || 0;
        seconds = parseInt(document.getElementById("seconds").value) || 30;
        }

        document.querySelector(".seconds-display").innerText = seconds + " seconds";

        let cost = 0;
        if (videoType === "2d") {
            cost += characters * 130;
            cost += vans * 70;
            cost += voiceovers * 100;
            cost += seconds * 10;
        } else if (videoType === "3d") {
            cost += characters * 250;
            cost += vans * 150;
            cost += voiceovers * 100;
            cost += seconds * 30;
        }

        document.getElementById("video-total").innerText =
    (currentPackage
        ? currentPackage.charAt(0).toUpperCase() + currentPackage.slice(1).toLowerCase() + " Package → "
        : "") +
    "Total: £" + cost;

    }

    function enableInputs(enable = true) {
        document.querySelectorAll("#video-calculator input").forEach(el => {
        el.disabled = !enable;
        });
    }

    // Mode buttons
    document.getElementById("btnCustom").addEventListener("click", function () {
        mode = "custom";
        currentPackage = null;
        this.classList.add("active");
        document.getElementById("btnPackage").classList.remove("active");
        document.querySelector(".package-buttons").style.display = "none";
        document.querySelectorAll(".package-buttons button").forEach(btn => btn.classList.remove("active"));

        document.getElementById("characters").value = 0;
        document.getElementById("vans").value = 0;
        document.getElementById("voiceovers").value = 0;
        document.getElementById("seconds").value = 30;

        enableInputs(true);
        calculatePrice();
    });

    document.getElementById("btnPackage").addEventListener("click", function () {
        mode = "package";
        currentPackage = "bronze";
        this.classList.add("active");
        document.getElementById("btnCustom").classList.remove("active");
        document.querySelector(".package-buttons").style.display = "flex";
        document.querySelectorAll(".package-buttons button").forEach(btn => btn.classList.remove("active"));
        document.getElementById("bronze").classList.add("active");

        enableInputs(false);
        calculatePrice();
    });

    ["bronze", "silver", "gold"].forEach(pkg => {
        document.getElementById(pkg).addEventListener("click", function () {
        currentPackage = pkg;
        document.querySelectorAll(".package-buttons button").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        calculatePrice();
        });
    });

    // Video type buttons
    document.getElementById("btn2d").addEventListener("click", function () {
        videoType = "2d";
        this.classList.add("active");
        document.getElementById("btn3d").classList.remove("active");
        calculatePrice();
        updateSliderFill();
    });

    document.getElementById("btn3d").addEventListener("click", function () {
        videoType = "3d";
        this.classList.add("active");
        document.getElementById("btn2d").classList.remove("active");
        calculatePrice();
        updateSliderFill();
    });

    // Slider
    const slider = document.getElementById("seconds");
    function updateSliderFill() {
        const min = slider.min, max = slider.max, val = slider.value;
        const percent = ((val - min) * 100) / (max - min);
        slider.style.setProperty("--value", percent + "%");
    }
    slider.addEventListener("input", () => {
        updateSliderFill();
        calculatePrice();
    });

    document.querySelectorAll("#video-calculator input").forEach(el => {
        el.addEventListener("input", calculatePrice);
    });

    // Defaults
    document.getElementById("btn2d").classList.add("active");
    document.getElementById("btnCustom").classList.add("active");
    document.querySelector(".package-buttons").style.display = "none";
    enableInputs(true);
    calculatePrice();
    updateSliderFill();
});
			