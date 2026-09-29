type ConverterName = "weight" | "distance" | "temperature";

interface ConverterDefinition {
  title: string;
  description: string;
  from: string;
  to: string;
  fromUnit: string;
  toUnit: string;

}

const formulas: Record<string, (value: number) => number> = {
  "kg-lb": (kg: number): number => kg * 2.20462,
  "lb-kg": (lb: number): number => lb / 2.20462,
  "km-mi": (km: number): number => km * 0.621371,
  "mi-km": (mi: number): number => mi / 0.621371,
  "°C-°F": (c: number): number => (c * 9) / 5 + 32,
  "°F-°C": (f: number): number => ((f - 32) * 5) / 9,
};

const createConverter = (from: string, to: string) => {
  const formula = formulas[`${from}-${to}`];

  if (formula === undefined) {
    throw new Error(`No conversion from ${from} to ${to}`);
  }

  return (value: number | number[]): number | number[] =>
    Array.isArray(value) ? value.map(formula) : formula(value);
};

const parseInput = (text: string): number | number[] | null => {
  const parts: string[] = text
    .split(",")
    .map((part: string): string => part.trim())
    .filter((part: string): boolean => part !== "");

  if (parts.length === 0) {
    return null;
  }

  const numbers: number[] = parts.map(Number);

  if (numbers.some((n: number): boolean => Number.isNaN(n))) {
    return null;
  }

  return numbers.length === 1 ? numbers[0] : numbers;
};

const formatResult = (result: number | number[]): string =>
  Array.isArray(result)
    ? result.map((n: number): string => n.toFixed(2)).join(", ")
    : result.toFixed(2);

((): void => {
  const converters: Record<ConverterName, ConverterDefinition> = {
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
    const value = parseInput(conversionInput.value);

    if (value === null) {
      conversionResult.textContent = "Enter a number, or numbers separated by commas";
      return;
    }

    const converter = converters[activeConverter];
    const from = isReversed ? converter.toUnit : converter.fromUnit;
    const to = isReversed ? converter.fromUnit : converter.toUnit;
    const convert = createConverter(from, to);

    conversionResult.textContent = formatResult(convert(value));
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