import { SOCIAL_LINKS, type SocialLink } from "@/constants/SITE_CONTENT"
import classNames from "@/utils/classNames"
import EmailIcon from "../EmailIcon"
import GithubIcon from "../GithubIcon"
import MediumIcon from "../MediumIcon"
import BookLinkIcon from "../BookLinkIcon"

const ICONS: Record<
  string,
  (props: { fill: "#F38B57" | "white" }) => React.ReactNode
> = {
  email: EmailIcon,
  github: GithubIcon,
  medium: MediumIcon,
  book: BookLinkIcon,
}

export default function SocialLinks({
  fill = "#F38B57",
  containerClasses = "flex",
  linkClasses = "flex items-center",
  iconClasses = "",
  labelClasses = "hidden md:ml-2 md:block",
  showLabels = false,
}: {
  fill?: "#F38B57" | "white"
  containerClasses?: string
  linkClasses?: string
  iconClasses?: string
  labelClasses?: string
  showLabels?: boolean
}) {
  const handleEmailClick = (e: React.MouseEvent, emailParts: string[]) => {
    e.preventDefault()
    const mailto = emailParts.join("")
    const w = window
    w.location.assign(mailto)
  }

  return (
    <div className={classNames(containerClasses)}>
      {SOCIAL_LINKS.map((link: SocialLink) => {
        const IconComponent = ICONS[link.id]
        if (!IconComponent) return null

        const isEmail = link.id === "email" && link.emailParts

        return (
          <a
            key={link.id}
            href={isEmail ? undefined : link.url}
            onClick={isEmail ? (e) => handleEmailClick(e, link.emailParts!) : undefined}
            style={isEmail ? { cursor: "pointer" } : {}}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noopener noreferrer"}
            className={classNames(linkClasses)}
          >
            <div className={classNames(iconClasses)}>
              <IconComponent fill={fill} />
            </div>
            {showLabels && (
              <span className={classNames(labelClasses)}>{link.label}</span>
            )}
          </a>
        )
      })}
    </div>
  )
}
