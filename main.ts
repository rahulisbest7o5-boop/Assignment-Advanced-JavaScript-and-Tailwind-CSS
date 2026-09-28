const kgInput = document.getElementById("kg-input") as HTMLInputElement;
const kgButton = document.getElementById("kg-button") as HTMLButtonElement;
const kgResult = document.getElementById("kg-result") as HTMLParagraphElement;
const weightSwap = document.getElementById("weight-swap") as HTMLButtonElement;
const weightDirection = document.getElementById("weight-direction") as HTMLParagraphElement;
const weightInputLabel = document.getElementById("weight-input-label") as HTMLLabelElement;
const weightResultLabel = document.getElementById("weight-result-label") as HTMLParagraphElement;
const weightUnit = document.getElementById("weight-unit") as HTMLSpanElement;

let isPoundsToKilograms = false;

function convertWeight(): void {
  if (kgInput.value.trim() === "") {
    kgResult.textContent = "Enter a number";
    return;
  }

  const inputValue = Number(kgInput.value);
  const convertedValue = isPoundsToKilograms
    ? inputValue / 2.20462
    : inputValue * 2.20462;

  kgResult.textContent = convertedValue.toFixed(2);
}

kgButton.addEventListener("click", convertWeight);

weightSwap.addEventListener("click", (): void => {
  isPoundsToKilograms = !isPoundsToKilograms;

  weightDirection.textContent = isPoundsToKilograms
    ? "Pounds to kilograms"
    : "Kilograms to pounds";

  weightInputLabel.textContent = isPoundsToKilograms
    ? "Pounds"
    : "Kilograms";

  weightResultLabel.textContent = isPoundsToKilograms
    ? "Kilograms"
    : "Pounds";

  weightUnit.textContent = isPoundsToKilograms ? "lb" : "kg";

  convertWeight();
});