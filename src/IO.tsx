export function IO({ array }: { array: number[] }) {
  return (
    <div className="io-item">
      [
      {array.map((val, i) => (
        <div key={i}>{val}</div>
      ))}
      ]
    </div>
  );
}
