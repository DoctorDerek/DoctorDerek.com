export const FLIP_ACTIVATION_ROTATION_DEGREES = 180
export const CODE_MARKER_ACTIVATION_ROTATION_DEGREES = 360
export const SPRING_ROTATION_PRELOAD_DEGREES = -28

export const getCareerCodeMarkerAccessibleName = (duration: string) =>
  `Spin the ${duration} code marker`

export const LOGO_CONTROL_ACCESSIBLE_NAMES = {
  showAlternative: "Show alternate DoctorDerek.com logo",
  showPrimary: "Show primary DoctorDerek.com logo",
} as const

export const PORTRAIT_CONTROL_ACCESSIBLE_NAMES = {
  about: "Show next portrait of Dr. Derek Austin",
  contact: "Flip portrait of Dr. Derek Austin",
} as const
