/** Below-fold Cozy Corner clips — loaded when scrolled near. */
export const cozyLazyMedia = {
  chatDemo: () => import('../images/cozy-corner/chat-demo.webm'),
  profileDemo: () => import('../images/cozy-corner/profile-demo.webm'),
  voiceRoom: () => import('../images/cozy-corner/voice-room.webm'),
} as const
