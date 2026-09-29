type ConverterName = "weight" | "distance" | "temperature";

interface ConverterDefinition {
  title: string;
  description: string;
  from: string;
  to: string;
  fromUnit: string;
  toUnit: string;
  convert: (value: number, reversed: boolean) => number;
}

((): void => {
  const converters: Record<ConverterName, ConverterDefinition> = {
    weight: {
      title: "Weight Converter",
      description: "Quickly convert between kilograms and pounds.",
      from: "Kilograms",
      to: "Pounds",
      fromUnit: "kg",
      toUnit: "lb",
      convert: (value, reversed) =>
        reversed ? value / 2.20462 : value * 2.20462,
    },
    distance: {
      title: "Distance Converter",
      description: "Quickly convert between kilometers and miles.",
      from: "Kilometers",
      to: "Miles",
      fromUnit: "km",
      toUnit: "mi",
      convert: (value, reversed) =>
        reversed ? value / 0.621371 : value * 0.621371,
    },
    temperature: {
      title: "Temperature Converter",
      description: "Quickly convert between Celsius and Fahrenheit.",
      from: "Celsius",
      to: "Fahrenheit",
      fromUnit: "°C",
      toUnit: "°F",
      convert: (value, reversed) =>
        reversed ? ((value - 32) * 5) / 9 : (value * 9) / 5 + 32,
    },
  };

  const converterHeading = document.getElementById(
    "converter-heading",
  ) as HTMLHeadingElement;
  const converterDescription = document.getElementById(
    "converter-description",
  ) as HTMLParagraphElement;
  const converterCategory = document.getElementById(
    "converter-category",
  ) as HTMLHeadingElement;
  const conversionDirection = document.getElementById(
    "conversion-direction",
  ) as HTMLParagraphElement;
  const conversionInput = document.getElementById(
    "conversion-input",
  ) as HTMLInputElement;
  const conversionInputLabel = document.getElementById(
    "conversion-input-label",
  ) as HTMLLabelElement;
  const conversionUnit = document.getElementById(
    "conversion-unit",
  ) as HTMLSpanElement;
  const conversionResultLabel = document.getElementById(
    "conversion-result-label",
  ) as HTMLParagraphElement;
  const conversionResult = document.getElementById(
    "conversion-result",
  ) as HTMLParagraphElement;
  const convertButton = document.getElementById(
    "convert-button",
  ) as HTMLButtonElement;
  const conversionSwap = document.getElementById(
    "conversion-swap",
  ) as HTMLButtonElement;
  const converterLinks = document.querySelectorAll<HTMLAnchorElement>(
    "[data-converter]",
  );

  let activeConverter: ConverterName = "weight";
  let isReversed = false;

  function isConverterName(value: string | undefined): value is ConverterName {
    return value === "weight" || value === "distance" || value === "temperature";
  }

  function updateConverter(): void {
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

  function convertValue(): void {
    if (conversionInput.value.trim() === "") {
      conversionResult.textContent = "Enter a number";
      return;
    }

    const value = Number(conversionInput.value);
    conversionResult.textContent = converters[activeConverter]
      .convert(value, isReversed)
      .toFixed(2);
  }

  convertButton.addEventListener("click", convertValue);
  conversionSwap.addEventListener("click", (): void => {
    isReversed = !isReversed;
    updateConverter();
    convertValue();
  });

  converterLinks.forEach((link) => {
    link.addEventListener("click", (event: MouseEvent): void => {
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