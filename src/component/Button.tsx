export function Button(props: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      className="after: rounded bg-blue-400 px-4 py-2 hover:bg-blue-500"
    >
      {props.children}
    </button>
  );
}
