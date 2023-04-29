const calculator = document.querySelector(".calculator");
const keys = document.querySelector(".calculator-keys");
const display = document.querySelector(".calculator-display");

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);

  if (operator === "add") return firstNum + secondNum;
  if (operator === "subtract") return firstNum - secondNum;
  if (operator === "multiply") return firstNum * secondNum;
  if (operator === "divide") return firstNum / secondNum;
  if (operator === "porcentaje") return (firstNum * secondNum) / 100;
};

const getKeyType = (key) => {
  const { action } = key.dataset;
  if (!action) return "number";
  if (
    action === "add" ||
    action === "subtract" ||
    action === "multiply" ||
    action === "divide" ||
    action === "porcentaje"
  )
    return "operator";
  return action;
};

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent;
  const keyType = getKeyType(key);
  const { firstValue, operator, modValue, prevousKeyType } = state;

  if (keyType == "number") {
    return displayedNum === "0" ||
      prevousKeyType === "operator" ||
      prevousKeyType === "calculate"
      ? keyContent
      : displayedNum + keyContent;
  }

  if (keyType === "dcecimal") {
    if (!displayedNum.includes(".")) return displayedNum + ".";
    if (prevousKeyType === "operator" || prevousKeyType === "calculate")
      return "0.";
    return displayedNum;
  }

  if (keyType === "operator") {
    return firstValue &&
      operator &&
      prevousKeyType !== "operator" &&
      prevousKeyType !== "calculate"
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }

  if (keyType === "clear") return 0;

  if (keyType === "calculate") {
    return firstValue
      ? prevousKeyType === "calculate"
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }
};

const updateCalculatorState = (
  key,
  calculator,
  calculateValue,
  displayedNum
) => {
  const keyType = getKeyType(key);
  const { firstValue, operator, modValue, prevousKeyType } = calculator.dataset;

  calculator.dataset.prevousKeyType = keyType;

  if (keyType === "operator") {
    calculator.dataset.operator = key.dataset.action;
    calculator.dataset.firstValue =
      firstValue &&
      operator &&
      prevousKeyType !== "operator " &&
      prevousKeyType !== "calculate"
        ? calculateValue
        : displayedNum;
  }

  if (keyType === "calculate") {
    calculator.dataset.modValue =
      firstValue && prevousKeyType === "calculate" ? modValue : displayedNum;
  }

  if (keyType === "clear" && key.textContent === "AC") {
    calculator.dataset.firstValue = "";
    calculator.dataset.modValue = "";
    calculator.dataset.operator = "";
    calculator.dataset.prevousKeyType = "";
  }
};

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key);
  Array.from(key.parentNode.children).forEach(k =>
    k.classList.remove("is-depressed")
  );
  if (keyType === "operator") key.classList.add("is-depressed");
  if (keyType === "clear" && key.textContent !== "AC") key.textContent = "AC";
  if (keyType !== "clear") {
    const clearButton = calculator.querySelector("[data-action=clear]");
    clearButton.textContent = "CE";
  }
};

keys.addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;
  const key = e.target;
  const displayedNum = display.textContent;
  const resultString = createResultString(
    key,
    displayedNum,
    calculator.dataset
  );

  display.textContent = resultString;
  updateCalculatorState(key, calculator, resultString, displayedNum);
  updateVisualState(key, calculator);
});
