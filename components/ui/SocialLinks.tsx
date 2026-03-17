"use client"

import { SOCIAL_LINKS, type SocialLink } from "@/constants/SITE_CONTENT"
import classNames from "@/utils/classNames"
import Icon, { type IconName } from "./Icon"

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
      {SOCIAL_LINKS.map((link: SocialLink, index: number) => {
        const isEmail = link.id === "email" && link.emailParts

        return (
          <a
            key={link.id}
            href={isEmail ? undefined : link.url}
            onClick={
              isEmail ? (e) => handleEmailClick(e, link.emailParts!) : undefined
            }
            style={isEmail ? { cursor: "pointer" } : {}}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noopener noreferrer"}
            className={classNames(linkClasses)}
          >
            <div
              className={classNames(iconClasses, "animate-float")}
              style={{ animationDelay: `${index * 0.4}s` }}
            >
              <Icon name={link.id as IconName} fill={fill} />
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
