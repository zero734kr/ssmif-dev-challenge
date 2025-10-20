export function FormError({ message }: { message: string }) {
  return (
    <span className="text-red-400 text-sm mt-1 block">
      {message}
    </span>
  )
}
