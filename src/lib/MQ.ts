export const BREAKPOINT_MIN_PC = 800;

export const MEDIA_DESKTOP = `min-width: ${BREAKPOINT_MIN_PC}px`;
export const MEDIA_MOBILE = `max-width: ${BREAKPOINT_MIN_PC - 1}px`;
export const MQ_DESKTOP = `@media(${MEDIA_DESKTOP})`;
export const MQ_MOBILE = `@media(${MEDIA_MOBILE})`;
