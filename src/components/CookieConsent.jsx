import { useState } from 'react'

const CONSENT_COOKIE = 'kitabilkom_cookie_consent'

export default function CookieConsent() {
  const [accepted, setAccepted] = useState(() =>
    document.cookie.split(';').some((cookie) => cookie.trim() === `${CONSENT_COOKIE}=accepted`),
  )

  const acceptCookies = () => {
    const secureFlag = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${CONSENT_COOKIE}=accepted; Max-Age=31536000; Path=/; SameSite=Lax${secureFlag}`
    setAccepted(true)
  }

  if (accepted) return null

  return (
    <aside className="cookie-consent" role="dialog" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description">
      <div>
        <h2 id="cookie-consent-title">Cookie &amp; privasi</h2>
        <p id="cookie-consent-description">
          Cookie ini menyimpan pilihan Anda agar pemberitahuan ini tidak muncul lagi selama satu tahun. Penyimpanan browser juga digunakan untuk menjaga sesi login dan mengingat preferensi tampilan. Saat ini, situs tidak menggunakan cookie untuk iklan atau pelacakan lintas situs.
        </p>
      </div>
      <button type="button" onClick={acceptCookies}>Mengerti</button>
    </aside>
  )
}