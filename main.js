"use strict";
const kgInput = document.getElementById("kg-input");
const kgButton = document.getElementById("kg-button");
const kgResult = document.getElementById("kg-result");
const weightSwap = document.getElementById("weight-swap");
const weightDirection = document.getElementById("weight-direction");
const weightInputLabel = document.getElementById("weight-input-label");
const weightResultLabel = document.getElementById("weight-result-label");
const weightUnit = document.getElementById("weight-unit");
let isPoundsToKilograms = false;
function convertWeight() {
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
weightSwap.addEventListener("click", () => {
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
