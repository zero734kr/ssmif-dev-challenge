// utility to remove falsy values from an object
export function removeFalsyValues(value?: Record<string, any>) {
  if (!value) return {}

  return Object.fromEntries(
    Object.entries(value).filter(([_, v]) => Boolean(v))
  )
}

// utility to conditionally join class names
export function clsx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

// utility to sleep for given milliseconds
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
