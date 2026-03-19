"use client"

import { SOCIAL_LINKS, type SocialLink } from "@/constants/SITE_CONTENT"
import classNames from "@/utils/classNames"
import Icon, { type IconName } from "./Icon"
import GlobalEmailCTA from "./GlobalEmailCTA"

export default function SocialLinks({
  fill = "#F38B57",
  containerClasses = "flex",
  linkClasses = "flex items-center whitespace-nowrap",
  iconClasses = "",
  labelClasses = "ml-2 block whitespace-nowrap",
  showLabels = false,
}: {
  fill?: "#F38B57" | "white"
  containerClasses?: string
  linkClasses?: string
  iconClasses?: string
  labelClasses?: string
  showLabels?: boolean
}) {
  return (
    <div className={classNames(containerClasses)}>
      {SOCIAL_LINKS.map((link: SocialLink, index: number) => {
        const isEmail = link.id === "email"

        const content = (
          <>
            <div
              className={classNames(iconClasses, "animate-float")}
              style={{ animationDelay: `${index * 0.4}s` }}
            >
              <Icon name={link.id as IconName} fill={fill} />
            </div>
            {showLabels && (
              <span className={classNames(labelClasses)}>{link.label}</span>
            )}
          </>
        )

        if (isEmail) {
          return (
            <GlobalEmailCTA 
              key={link.id} 
              className={classNames(linkClasses, "[&_a]:flex [&_a]:items-center")}
            >
              {content}
            </GlobalEmailCTA>
          )
        }

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={classNames(linkClasses)}
          >
            {content}
          </a>
        )
      })}
    </div>
  )
}
