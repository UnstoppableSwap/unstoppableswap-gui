export default function DateFormatted({ date }: { date: Date }) {
  return (
    <>
      {date.toDateString()} {date.toTimeString()}
    </>
  );
}
