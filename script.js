const cashInput = document.querySelector('#cash');
const purchaseBtn = document.querySelector('#purchase-btn');
const changeDiv = document.querySelector('#change');
const changeDueDiv = document.querySelector('#change-due');

let price = 3.26;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
]

function checkCashRegister(price, cash, cashInDrawer) {
  const unit = [0.01, 0.05, 0.1, 0.25, 1, 5, 10, 20, 100];
  let change = cash - price;
  let cidSum = 0;

  for (let i in cashInDrawer) {
    cidSum += cashInDrawer[i][1];
  }

  if (cidSum === change) {
    let arr = [];

    for (let i = unit.length - 1; i >= 0; i--) {
      if (unit[i] <= change) {
        arr.push([cashInDrawer[i][0], cashInDrawer[i][1]]);
        change = Math.round((change - cashInDrawer[i][1]) * 100) / 100;
        cid[i][1] = 0;
      }
    }

    updateDrawer();
    return { status: 'CLOSED', change: arr };
  } else if (cidSum < change) {
    return { status: 'INSUFFICIENT_FUNDS', change: [] };
  } else {
    let arr = [];
    let cidCopy = structuredClone(cashInDrawer);

    for (let i = unit.length - 1; i >= 0; i--) {
      if (change >= unit[i]) {
        let sum = 0;

        while (change >= unit[i] && sum < cashInDrawer[i][1]) {
          sum = Math.round((sum + unit[i]) * 100) / 100;
          change = Math.round((change - unit[i]) * 100) / 100;
          cidCopy[i][1] = Math.round((cidCopy[i][1] - unit[i]) * 100) / 100;
        }

        if (sum > 0) {
          arr.push([cashInDrawer[i][0], sum]);
        }
      }
    }

    if (change > 0) {
      cid = structuredClone(cidCopy);
      return { status: 'INSUFFICIENT_FUNDS', change: [] };
    } else {
      cid = structuredClone(cidCopy);
      updateDrawer();
      return { status: 'OPEN', change: arr };
    }
  }
}

function updateDrawer() {
  while (changeDiv.childElementCount > 1) {
    changeDiv.removeChild(changeDiv.lastChild);
  }

  changeDiv.innerHTML += `<span>Pennies: $${cid[0][1]}</span>`;
  changeDiv.innerHTML += `<span>Nickels: $${cid[1][1]}</span>`;
  changeDiv.innerHTML += `<span>Dimes: $${cid[2][1]}</span>`;
  changeDiv.innerHTML += `<span>Quarters: $${cid[3][1]}</span>`;
  changeDiv.innerHTML += `<span>Ones: $${cid[4][1]}</span>`;
  changeDiv.innerHTML += `<span>Fives: $${cid[5][1]}</span>`;
  changeDiv.innerHTML += `<span>Tens: $${cid[6][1]}</span>`;
  changeDiv.innerHTML += `<span>Twenties: $${cid[7][1]}</span>`;
  changeDiv.innerHTML += `<span>Hundreds: $${cid[8][1]}</span>`;
  changeDiv.innerHTML += `<span id="total">Total: $${price}</span>`;
}

updateDrawer();

purchaseBtn.addEventListener('click', () => {
  const cash = Number(cashInput.value);

  if (isNaN(cash) || cash < price) {
    alert('Customer does not have enough money to purchase the item')
    changeDueDiv.innerHTML = '';
  } else {
    const change = checkCashRegister(price, cash, cid);

    if (cash === price) {
      changeDueDiv.innerHTML = `<span>No change due - customer paid with exact cash</span>`;
    } else if (change.status === 'INSUFFICIENT_FUNDS') {
      changeDueDiv.innerHTML = `<span>Status: INSUFFICIENT_FUNDS</span>`;
    } else {
      changeDueDiv.innerHTML = `<span>Status: ${change.status}</span>`;

      for (let item of change.change) {
        changeDueDiv.innerHTML += `<span>${item[0]}: $${item[1]}</span>`;
      }
    }
  }
})
