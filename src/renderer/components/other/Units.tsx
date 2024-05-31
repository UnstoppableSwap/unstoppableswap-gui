import { piconerosToXmr, satsToBtc } from '../../../utils/conversionUtils';

type Amount = number | null | undefined;

export function AmountWithUnit({
  amount,
  unit,
  fixedPrecision,
}: {
  amount: Amount;
  unit: string;
  fixedPrecision: number;
}) {
  return (
    <span>
      {amount ? Number.parseFloat(amount.toFixed(fixedPrecision)) : '?'}{' '}
      {unit}
    </span>
  );
}

export function BitcoinAmount({ amount }: { amount: Amount }) {
  return <AmountWithUnit amount={amount} unit="BTC" fixedPrecision={6} />;
}

export function MoneroAmount({ amount }: { amount: Amount }) {
  return <AmountWithUnit amount={amount} unit="XMR" fixedPrecision={4} />;
}

export function MoneroBitcoinExchangeRate({ rate }: { rate: Amount }) {
  return <AmountWithUnit amount={rate} unit="BTC/XMR" fixedPrecision={8} />;
}

export function SatsAmount({ amount }: { amount: Amount }) {
  return <BitcoinAmount amount={amount == null ? null : satsToBtc(amount)} />;
}

export function PiconeroAmount({ amount }: { amount: Amount }) {
  return (
    <MoneroAmount amount={amount == null ? null : piconerosToXmr(amount)} />
  );
}
