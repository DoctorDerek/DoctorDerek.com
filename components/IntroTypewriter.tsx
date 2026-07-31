import TypewriterComponent, {
  type Options,
  type TypewriterClass,
} from "typewriter-effect"

const TYPEWRITER_OPTIONS: Options = {
  delay: 25,
  loop: true,
  deleteSpeed: 10,
}

export default function IntroTypewriter({
  segments,
}: {
  segments: readonly string[]
}) {
  const handleTypewriterInitialization = (typewriter: TypewriterClass) => {
    for (const segment of segments)
      typewriter.typeString(segment).pauseFor(2000).deleteAll()
    typewriter.start()
  }

  return (
    <TypewriterComponent
      onInit={handleTypewriterInitialization}
      options={TYPEWRITER_OPTIONS}
    />
  )
}
