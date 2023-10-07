(function () {
  const LB_TO_KG = 2.20462;
  const CM_TO_INCH = 2.54;

  function getValue(fieldName) {
    return parseFloat(document.weightcalc[fieldName].value);
  }

  function isValidInput(value) {
    return !isNaN(value) && value !== "" && value >= 0;
  }

  function toggleHeightUnit() {
    const heightUnit = document.getElementById("heightUnit").value;
    if (heightUnit === "feet_inches") {
      document.getElementById("heightFeetInches").style.display = "block";
      document.getElementById("heightCm").style.display = "none";
    } else {
      document.getElementById("heightFeetInches").style.display = "none";
      document.getElementById("heightCm").style.display = "block";
    }
  }

  function toggleWeightUnit() {
    const weightUnit = document.getElementById("weightUnit").value;
    if (weightUnit === "lb") {
      document.getElementById("weightLb").style.display = "block";
      document.getElementById("weightKg").style.display = "none";
    } else {
      document.getElementById("weightLb").style.display = "none";
      document.getElementById("weightKg").style.display = "block";
    }
  }

  function displayErrorMessage(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerText = message;

    if (message) {
      element.style.display = "block"; // or 'inline-block'
    } else {
      element.style.display = "none";
    }
  }

  function getExcessWeight(height, weight) {
    return weight - (25 * height * height) / 703;
  }

  function updateOutputValues(excessWeight, outputUnit) {
    document.querySelectorAll(".result_display").forEach((field) => {
      let percentage = parseFloat(field.getAttribute("data-percentage"));
      let result = excessWeight * percentage;

      if (outputUnit === "kg") {
        result /= LB_TO_KG;
        field.innerText = result.toFixed(2) + " kg";
      } else {
        field.innerText = result.toFixed(2) + " lbs";
      }
    });
  }

  function calc() {
    let hasError = false;

    // Reset previous displays
    document.getElementById("totals").style.display = "none";
    document.getElementById("infoMessage").innerText = "";

    // Reset error messages
    const errorElements = [
      "errorHeightFeet",
      "errorHeightInches",
      "errorHeightCm",
      "errorWeightLb",
      "errorWeightKg",
    ];
    errorElements.forEach((element) => displayErrorMessage(element, ""));

    const heightUnit = document.getElementById("heightUnit").value;
    const weightUnit = document.getElementById("weightUnit").value;

    let height, weight;

    if (heightUnit === "feet_inches") {
      let feet = getValue("height_feet");
      let inches = getValue("height_inches");

      if (!isValidInput(feet)) {
        displayErrorMessage("errorHeightFeet", "Enter a valid height in feet.");
        hasError = true;
      }
      if (!isValidInput(inches) || inches >= 12) {
        displayErrorMessage(
          "errorHeightInches",
          inches >= 12
            ? "Inches should be less than 12."
            : "Enter a valid height in inches."
        );
        hasError = true;
      } else {
        height = 12 * feet + inches;
      }
    } else {
      height = getValue("height_cm") / CM_TO_INCH;
      if (!isValidInput(height)) {
        displayErrorMessage(
          "errorHeightCm",
          "Enter a valid height in centimeters."
        );
        hasError = true;
      }
    }

    if (weightUnit === "lb") {
      weight = getValue("weight_lb");
      if (!isValidInput(weight)) {
        displayErrorMessage("errorWeightLb", "Enter a valid weight in pounds.");
        hasError = true;
      }
    } else {
      weight = getValue("weight_kg") * LB_TO_KG;
      if (!isValidInput(weight)) {
        displayErrorMessage(
          "errorWeightKg",
          "Enter a valid weight in kilograms."
        );
        hasError = true;
      }
    }

    if (hasError) return;

    const excessWeight = getExcessWeight(height, weight);
    if (excessWeight < 0) {
      document.getElementById("infoMessage").innerText =
        "Your weight is below the BMI of 25 for your height";
      return;
    } else {
      document.getElementById("totals").style.display = "block";
      document.getElementById("outputUnit").style.display = "inline-block";
    }
    const outputUnit = document.getElementById("outputUnit").value;
    updateOutputValues(excessWeight, outputUnit);
    document.getElementById("totals").style.display = "block";
  }

  window.addEventListener("load", function () {
    document.getElementById("weightForm").reset();
    document.getElementById("totals").style.display = "none";
    document
      .getElementById("weightForm")
      .addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON") {
          calc();
        }
      });
    document
      .getElementById("heightUnit")
      .addEventListener("change", toggleHeightUnit);
    document
      .getElementById("weightUnit")
      .addEventListener("change", toggleWeightUnit);
    document.getElementById("outputUnit").style.display = "none";
    document.getElementById("outputUnit").addEventListener("change", calc);
  });
})();
