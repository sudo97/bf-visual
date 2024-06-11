export function IO({ array, label }: { array: number[]; label: string }) {
  return (
    <div className="io-item">
      {label}[
      {array.map((val, i) => (
        <div key={i}>{val}</div>
      ))}
      ]
    </div>
  );
}
