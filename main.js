"use strict";
(() => {
    const converters = {
        weight: {
            title: "Weight Converter",
            description: "Quickly convert between kilograms and pounds.",
            from: "Kilograms",
            to: "Pounds",
            fromUnit: "kg",
            toUnit: "lb",
            convert: (value, reversed) => reversed ? value / 2.20462 : value * 2.20462,
        },
        distance: {
            title: "Distance Converter",
            description: "Quickly convert between kilometers and miles.",
            from: "Kilometers",
            to: "Miles",
            fromUnit: "km",
            toUnit: "mi",
            convert: (value, reversed) => reversed ? value / 0.621371 : value * 0.621371,
        },
        temperature: {
            title: "Temperature Converter",
            description: "Quickly convert between Celsius and Fahrenheit.",
            from: "Celsius",
            to: "Fahrenheit",
            fromUnit: "°C",
            toUnit: "°F",
            convert: (value, reversed) => reversed ? ((value - 32) * 5) / 9 : (value * 9) / 5 + 32,
        },
    };
    const converterHeading = document.getElementById("converter-heading");
    const converterDescription = document.getElementById("converter-description");
    const converterCategory = document.getElementById("converter-category");
    const conversionDirection = document.getElementById("conversion-direction");
    const conversionInput = document.getElementById("conversion-input");
    const conversionInputLabel = document.getElementById("conversion-input-label");
    const conversionUnit = document.getElementById("conversion-unit");
    const conversionResultLabel = document.getElementById("conversion-result-label");
    const conversionResult = document.getElementById("conversion-result");
    const convertButton = document.getElementById("convert-button");
    const conversionSwap = document.getElementById("conversion-swap");
    const arrayInput = document.getElementById("array-input");
    const arrayButton = document.getElementById("array-button");
    const arrayResult = document.getElementById("array-result");
    const converterLinks = document.querySelectorAll("[data-converter]");
    let activeConverter = "weight";
    let isReversed = false;
    function isConverterName(value) {
        return value === "weight" || value === "distance" || value === "temperature";
    }
    function updateConverter() {
        const converter = converters[activeConverter];
        const from = isReversed ? converter.to : converter.from;
        const to = isReversed ? converter.from : converter.to;
        document.title = converter.title;
        converterHeading.textContent = converter.title;
        converterDescription.textContent = converter.description;
        converterCategory.textContent =
            activeConverter[0].toUpperCase() + activeConverter.slice(1);
        conversionDirection.textContent = `${from} to ${to}`;
        conversionInputLabel.textContent = from;
        conversionInputLabel.htmlFor = "conversion-input";
        conversionUnit.textContent = isReversed
            ? converter.toUnit
            : converter.fromUnit;
        conversionResultLabel.textContent = to;
        convertButton.textContent = `Convert ${activeConverter}`;
        conversionResult.textContent = "0.00";
        arrayResult.textContent = "Converted values will appear here.";
        converterLinks.forEach((link) => {
            const isActive = link.dataset.converter === activeConverter;
            link.classList.toggle("bg-blue-50", isActive);
            link.classList.toggle("text-blue-700", isActive);
            link.classList.toggle("text-slate-600", !isActive);
            link.setAttribute("aria-current", isActive ? "page" : "false");
        });
    }
    function convertValue() {
        if (conversionInput.value.trim() === "") {
            conversionResult.textContent = "Enter a number";
            return;
        }
        const value = Number(conversionInput.value);
        conversionResult.textContent = converters[activeConverter]
            .convert(value, isReversed)
            .toFixed(2);
    }
    function convertArray() {
        let values;
        try {
            values = JSON.parse(arrayInput.value);
        }
        catch (_a) {
            arrayResult.textContent = "Enter a valid JSON array, such as [1, 2, 3].";
            return;
        }
        if (!Array.isArray(values) ||
            !values.every((value) => typeof value === "number" && Number.isFinite(value))) {
            arrayResult.textContent = "Enter an array containing only numbers.";
            return;
        }
        const converter = converters[activeConverter];
        const convertedValues = values.map((value) => converter.convert(value, isReversed).toFixed(2));
        arrayResult.textContent = `[${convertedValues.join(", ")}]`;
    }
    convertButton.addEventListener("click", convertValue);
    arrayButton.addEventListener("click", convertArray);
    conversionSwap.addEventListener("click", () => {
        isReversed = !isReversed;
        updateConverter();
        convertValue();
    });
    converterLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const selectedConverter = link.dataset.converter;
            if (!isConverterName(selectedConverter)) {
                return;
            }
            activeConverter = selectedConverter;
            isReversed = false;
            conversionInput.value = "0";
            updateConverter();
        });
    });
    updateConverter();
})();
