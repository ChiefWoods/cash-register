function checkCashRegister(price, cash, cid) {
  const unit = [0.01, 0.05, 0.1, 0.25, 1, 5, 10, 20, 100];
  let change = cash - price;
  let cidSum = 0;

  for (let i in cid) {
    cidSum += cid[i][1];
  }

  if (cidSum === change) {
    return { status: "CLOSED", change: cid };
  } else if (cidSum < change) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  } else {
    let arr = [];

    for (let i = unit.length - 1; i >= 0; i--) {
      if (change >= unit[i]) {
        let sum = 0;

        while (change >= unit[i] && sum < cid[i][1]) {
          sum += unit[i];
          change -= unit[i];
          change = Math.round(change * 100) / 100;
        }

        if (sum > 0) {
          arr.push([cid[i][0], sum]);
        }
      }
    }

    return change > 0
      ? { status: "INSUFFICIENT_FUNDS", change: [] }
      : { status: "OPEN", change: arr };
  }
}
