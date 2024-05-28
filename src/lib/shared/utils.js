import  { CurrencyUnit } from "$lib/pkg";

export async function refreshBalance(wallet) {
  if (wallet != undefined) {
      let  balance = (await wallet.unitBalance(CurrencyUnit.Sat)).value;
      return balance;
  }
}


