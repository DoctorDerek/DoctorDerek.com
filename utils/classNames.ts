export default function classNames(
  ...args: (string | boolean | undefined | null)[]
) {
  return args.filter(Boolean).join(" ")
}
