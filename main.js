"use strict";
// Conversion formulas for each supported direction.
const formulas = {
  "kg-lb": (kg) => kg * 2.20462,
  "lb-kg": (lb) => lb / 2.20462,
  "km-mi": (km) => km * 0.621371,
  "mi-km": (mi) => mi / 0.621371,
  "°C-°F": (c) => (c * 9) / 5 + 32,
  "°F-°C": (f) => ((f - 32) * 5) / 9,
};
const createConverter = (from, to) => {
  const formula = formulas[`${from}-${to}`];
  if (formula === undefined) {
    throw new Error(`No conversion from ${from} to ${to}`);
  }
  return (value) =>
    Array.isArray(value) ? value.map(formula) : formula(value);
};
// Accept either a single number or several numbers separated by commas.
const parseInput = (text) => {
  const parts = text
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "");
  if (parts.length === 0) {
    return null;
  }
  const numbers = parts.map(Number);
  if (numbers.some((n) => Number.isNaN(n))) {
    return null;
  }
  return numbers.length === 1 ? numbers[0] : numbers;
};
const formatResult = (result) =>
  Array.isArray(result)
    ? result.map((n) => n.toFixed(2)).join(", ")
    : result.toFixed(2);
(() => {
  // Each converter type stores its labels and the units used for conversion.
  const converters = {
    weight: {
      title: "Weight Converter",
      description: "Quickly convert between kilograms and pounds.",
      from: "Kilograms",
      to: "Pounds",
      fromUnit: "kg",
      toUnit: "lb",
    },
    distance: {
      title: "Distance Converter",
      description: "Quickly convert between kilometers and miles.",
      from: "Kilometers",
      to: "Miles",
      fromUnit: "km",
      toUnit: "mi",
    },
    temperature: {
      title: "Temperature Converter",
      description: "Quickly convert between Celsius and Fahrenheit.",
      from: "Celsius",
      to: "Fahrenheit",
      fromUnit: "°C",
      toUnit: "°F",
    },
  };
  const converterHeading = document.getElementById("converter-heading");
  const converterDescription = document.getElementById("converter-description");
  const converterCategory = document.getElementById("converter-category");
  const conversionDirection = document.getElementById("conversion-direction");
  const conversionInput = document.getElementById("conversion-input");
  const conversionInputLabel = document.getElementById(
    "conversion-input-label",
  );
  const conversionUnit = document.getElementById("conversion-unit");
  const conversionResultLabel = document.getElementById(
    "conversion-result-label",
  );
  const conversionResult = document.getElementById("conversion-result");
  const convertButton = document.getElementById("convert-button");
  const conversionSwap = document.getElementById("conversion-swap");
  const converterLinks = document.querySelectorAll("[data-converter]");
  let activeConverter = "weight";
  let isReversed = false;
  // Guard against invalid converter names coming from the UI.
  function isConverterName(value) {
    return (
      value === "weight" || value === "distance" || value === "temperature"
    );
  }
  // Refresh the visible labels and values whenever the selected converter changes.
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
    converterLinks.forEach((link) => {
      const isActive = link.dataset.converter === activeConverter;
      link.classList.toggle("bg-blue-50", isActive);
      link.classList.toggle("text-blue-700", isActive);
      link.classList.toggle("text-slate-600", !isActive);
      link.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }
  // Convert the entered value using the active unit pair and show the formatted result.
  function convertValue() {
    const value = parseInput(conversionInput.value);
    if (value === null) {
      conversionResult.textContent =
        "Enter a number, or numbers separated by commas";
      return;
    }
    const converter = converters[activeConverter];
    const from = isReversed ? converter.toUnit : converter.fromUnit;
    const to = isReversed ? converter.fromUnit : converter.toUnit;
    const convert = createConverter(from, to);
    conversionResult.textContent = formatResult(convert(value));
  }
  convertButton.addEventListener("click", convertValue);
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
