let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

// Event listener pentru butonul de achiziție
document
  .getElementById("purchase-btn")
  .addEventListener("click", calculateChange);

function calculateChange() {
  // Obține numerarul introdus din câmpul de input
  let cash = parseFloat(document.getElementById("cash").value);
  if (isNaN(cash)) {
    alert("Vă rugăm să introduceți o sumă validă.");
    return;
  }

  // Valorile pentru unitățile monetare
  const currencyUnits = [
    ["PENNY", 0.01],
    ["NICKEL", 0.05],
    ["DIME", 0.1],
    ["QUARTER", 0.25],
    ["ONE", 1],
    ["FIVE", 5],
    ["TEN", 10],
    ["TWENTY", 20],
    ["ONE HUNDRED", 100],
  ];

  let changeDue = Math.round((cash - price) * 100) / 100;
  let totalCID =
    Math.round(cid.reduce((total, curr) => total + curr[1], 0) * 100) / 100;

  // Funcția pentru a calcula restul din sertar
  function calculateChangeFromDrawer(changeDue, cidCopy) {
    let changeArray = [];
    for (let i = currencyUnits.length - 1; i >= 0; i--) {
      let currencyName = currencyUnits[i][0];
      let currencyValue = currencyUnits[i][1];
      let currencyAmount = 0;

      while (changeDue >= currencyValue && cidCopy[i][1] > 0) {
        changeDue = Math.round((changeDue - currencyValue) * 100) / 100;
        cidCopy[i][1] -= currencyValue;
        currencyAmount += currencyValue;
      }
      if (currencyAmount > 0) {
        changeArray.push([
          currencyName,
          Math.round(currencyAmount * 100) / 100,
        ]);
      }
    }

    // Verifică dacă putem oferi restul exact
    if (changeDue > 0) {
      return "INSUFFICIENT_FUNDS";
    }

    return changeArray;
  }

  // Logica principală pentru determinarea statusului
  if (cash < price) {
    alert("Clientul nu are suficienți bani pentru a achiziționa produsul.");
  } else if (cash === price) {
    document.getElementById("change-due").innerText =
      "Niciun rest datorat - clientul a plătit suma exactă.";
  } else if (totalCID < changeDue) {
    document.getElementById("change-due").innerText =
      "Status: INSUFFICIENT_FUNDS";
  } else {
    let change = calculateChangeFromDrawer(
      changeDue,
      JSON.parse(JSON.stringify(cid)) // copie profundă pentru a evita mutarea
    );
    if (change === "INSUFFICIENT_FUNDS") {
      document.getElementById("change-due").innerText =
        "Status: INSUFFICIENT_FUNDS";
    } else if (totalCID === cash - price) {
      // Când întregul numerar din sertar este egal cu restul datorat
      document.getElementById("change-due").innerText =
        `Status: CLOSED\n` +
        change.map((c) => `${c[0]}: $${c[1].toFixed(2)}`).join("\n");
    } else {
      document.getElementById("change-due").innerText =
        `Status: OPEN\n` +
        change.map((c) => `${c[0]}: $${c[1].toFixed(2)}`).join("\n");
    }
  }
}
