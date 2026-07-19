// Ong mật Bee - linh vật của app. Có thể kèm bong bóng lời thoại.
export function BeeSvg({ size = 96, mood = 'happy' }: { size?: number; mood?: 'happy' | 'cheer' | 'think' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={mood === 'cheer' ? 'anim-wiggle' : 'anim-bounce'}>
      {/* cánh */}
      <ellipse cx="34" cy="34" rx="16" ry="20" fill="#ffffff" opacity="0.9" />
      <ellipse cx="66" cy="34" rx="16" ry="20" fill="#ffffff" opacity="0.9" />
      {/* thân */}
      <ellipse cx="50" cy="58" rx="24" ry="28" fill="#ffd54f" />
      <clipPath id="beebody">
        <ellipse cx="50" cy="58" rx="24" ry="28" />
      </clipPath>
      <g clipPath="url(#beebody)" fill="#3a2a1a">
        <rect x="26" y="42" width="48" height="9" />
        <rect x="26" y="58" width="48" height="9" />
        <rect x="26" y="74" width="48" height="9" />
      </g>
      {/* râu */}
      <g stroke="#3a2a1a" strokeWidth="2.5" fill="none">
        <path d="M42 34 Q38 24 33 22" />
        <path d="M58 34 Q62 24 67 22" />
      </g>
      <circle cx="33" cy="21" r="3" fill="#3a2a1a" />
      <circle cx="67" cy="21" r="3" fill="#3a2a1a" />
      {/* mắt */}
      <circle cx="42" cy="50" r="5.5" fill="#fff" />
      <circle cx="58" cy="50" r="5.5" fill="#fff" />
      <circle cx="43" cy="51" r="2.6" fill="#2a1e14" />
      <circle cx="59" cy="51" r="2.6" fill="#2a1e14" />
      {/* miệng cười */}
      {mood === 'think' ? (
        <circle cx="50" cy="62" r="3" fill="none" stroke="#2a1e14" strokeWidth="2.5" />
      ) : (
        <path d="M43 60 Q50 68 57 60" stroke="#2a1e14" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {/* má hồng */}
      <circle cx="36" cy="58" r="3.5" fill="#ff8a80" opacity="0.6" />
      <circle cx="64" cy="58" r="3.5" fill="#ff8a80" opacity="0.6" />
    </svg>
  )
}

export function Mascot({
  message,
  mood = 'happy',
  size = 92,
}: {
  message?: string
  mood?: 'happy' | 'cheer' | 'think'
  size?: number
}) {
  return (
    <div className="flex items-end gap-2">
      <BeeSvg size={size} mood={mood} />
      {message && (
        <div className="anim-pop relative mb-4 max-w-[220px] rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-lg">
          <span className="absolute -left-2 bottom-3 h-4 w-4 rotate-45 bg-white" />
          {message}
        </div>
      )}
    </div>
  )
}
