import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateEmailHTML = (otp: number): string => `
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Tasdiqlash kodi — Book Lovers</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: #1a1208;
      font-family: 'Lato', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      max-width: 620px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    /* ── Header ── */
    .header {
      text-align: center;
      padding-bottom: 32px;
    }

    .logo-ring {
      display: inline-block;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c8a96e 0%, #f0d9a0 50%, #a07840 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 32px;
      box-shadow: 0 0 0 4px #2e1f0a, 0 0 0 8px #c8a96e55;
    }

    .brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 700;
      color: #f0d9a0;
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    .brand-tagline {
      font-size: 11px;
      color: #8c7252;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-top: 4px;
    }

    /* ── Main Card ── */
    .card {
      background: linear-gradient(160deg, #2a1c0d 0%, #1e1509 60%, #231a0b 100%);
      border-radius: 20px;
      border: 1px solid #3d2b14;
      overflow: hidden;
      position: relative;
    }

    /* decorative corner ornaments */
    .card::before,
    .card::after {
      content: '';
      position: absolute;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, #c8a96e18 0%, transparent 70%);
      pointer-events: none;
    }
    .card::before { top: -30px; left: -30px; }
    .card::after  { bottom: -30px; right: -30px; }

    /* ── Top banner ── */
    .banner {
      background: linear-gradient(135deg, #3d2506 0%, #6b3d10 50%, #3d2506 100%);
      padding: 36px 40px 28px;
      text-align: center;
      border-bottom: 1px solid #5a3515;
      position: relative;
      overflow: hidden;
    }

    .banner-lines {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image:
        repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 18px,
          #c8a96e08 18px,
          #c8a96e08 19px
        );
    }

    .banner h1 {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: #f5e6c0;
      line-height: 1.3;
      position: relative;
      z-index: 1;
    }

    .banner h1 em {
      font-style: italic;
      color: #f0d9a0;
    }

    .divider-ornament {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 20px auto 0;
      max-width: 260px;
      position: relative;
      z-index: 1;
    }

    .divider-ornament .line {
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, #c8a96e88, transparent);
    }

    .divider-ornament .diamond {
      width: 8px;
      height: 8px;
      background: #c8a96e;
      transform: rotate(45deg);
      flex-shrink: 0;
    }

    /* ── Body ── */
    .body {
      padding: 40px 44px;
      text-align: center;
    }

    .greeting {
      font-size: 15px;
      color: #a08858;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .message {
      font-size: 16px;
      color: #c9ae80;
      line-height: 1.7;
      margin-bottom: 36px;
      font-weight: 300;
    }

    /* ── OTP Block ── */
    .otp-label {
      font-size: 11px;
      color: #7a6040;
      letter-spacing: 5px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .otp-frame {
      display: inline-block;
      background: linear-gradient(135deg, #0e0a04, #1c1308);
      border: 1px solid #5a3d18;
      border-radius: 16px;
      padding: 6px;
      margin-bottom: 12px;
      box-shadow:
        0 0 0 1px #0a0702,
        inset 0 1px 0 #3d2a10,
        0 20px 60px #00000080;
    }

    .otp-inner {
      background: linear-gradient(135deg, #2e1e08, #1a1005);
      border-radius: 12px;
      border: 1px solid #3a2610;
      padding: 20px 48px;
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: center;
    }

    .otp-digit {
      display: inline-block;
      width: 48px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background: linear-gradient(180deg, #3d2810 0%, #261808 100%);
      border: 1px solid #5a3c18;
      border-radius: 10px;
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      color: #f5e0a0;
      box-shadow:
        inset 0 1px 0 #7a5528,
        0 4px 12px #0008;
    }

    .otp-sep {
      color: #5a3c18;
      font-size: 24px;
      line-height: 60px;
      font-weight: 300;
    }

    .otp-timer {
      font-size: 13px;
      color: #7a6040;
      letter-spacing: 1px;
      margin-top: 4px;
      margin-bottom: 36px;
    }

    .otp-timer strong {
      color: #c8a96e;
    }

    /* ── Info box ── */
    .info-box {
      background: #1a1006;
      border: 1px solid #2e200a;
      border-left: 3px solid #c8a96e;
      border-radius: 10px;
      padding: 16px 20px;
      text-align: left;
      margin-bottom: 36px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }

    .info-box .icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }

    .info-box p {
      font-size: 13px;
      color: #8c7252;
      line-height: 1.6;
    }

    .info-box p strong { color: #c8a96e; font-weight: 700; }

    /* ── Quote ── */
    .quote-block {
      border-top: 1px solid #2e200a;
      padding-top: 28px;
      margin-top: 4px;
    }

    .quote-mark {
      font-family: 'Playfair Display', serif;
      font-size: 64px;
      line-height: 0.6;
      color: #3d2a10;
      display: block;
      margin-bottom: 12px;
    }

    .quote-text {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 15px;
      color: #7a6040;
      line-height: 1.7;
      max-width: 360px;
      margin: 0 auto;
    }

    .quote-author {
      font-size: 11px;
      color: #5a4020;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 10px;
    }

    /* ── Footer ── */
    .footer {
      background: #120d05;
      border-top: 1px solid #2a1c08;
      padding: 28px 40px;
      text-align: center;
    }

    .footer p {
      font-size: 12px;
      color: #4a3618;
      line-height: 1.8;
    }

    .footer a {
      color: #7a5c30;
      text-decoration: none;
    }

    .footer .footer-brand {
      font-family: 'Playfair Display', serif;
      font-size: 13px;
      color: #5a4020;
      letter-spacing: 2px;
      margin-bottom: 6px;
    }

  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Header -->
    <div class="header">
      <div class="logo-ring">📚</div>
      <div class="brand-name">Book Lovers</div>
      <div class="brand-tagline">Kitob — ruhning oynasi</div>
    </div>

    <!-- Card -->
    <div class="card">

      <!-- Banner -->
      <div class="banner">
        <div class="banner-lines"></div>
        <h1>Hisobingizni <em>tasdiqlang</em></h1>
        <div class="divider-ornament">
          <div class="line"></div>
          <div class="diamond"></div>
          <div class="line"></div>
        </div>
      </div>

      <!-- Body -->
      <div class="body">

        <p class="greeting">Assalomu alaykum, o'quvchi!</p>
        <p class="message">
          Quyidagi bir martalik tasdiqlash kodini kiriting.<br/>
          Siz faqat bir qadam uzoqdasiz.
        </p>

        <!-- OTP -->
        <p class="otp-label">Tasdiqlash kodi</p>
        <div class="otp-frame">
          <div class="otp-inner">
            ${String(otp).split("").map((d, i, arr) => {
              const mid = Math.floor(arr.length / 2);
              return (i === mid && arr.length % 2 === 0)
                ? `<span class="otp-sep">·</span><span class="otp-digit">${d}</span>`
                : `<span class="otp-digit">${d}</span>`;
            }).join("")}
          </div>
        </div>
        <p class="otp-timer">Kod <strong>10 daqiqa</strong> davomida amal qiladi</p>

        <!-- Info -->
        <div class="info-box">
          <div class="icon">🔒</div>
          <p>
            Agar siz bu so'rovni <strong>yuborgan bo'lmasangiz</strong>,
            ushbu xabarni e'tiborsiz qoldiring.
            Hisob ma'lumotlaringizni hech kim bilan baham ko'rmang.
          </p>
        </div>

        <!-- Quote -->
        <div class="quote-block">
          <span class="quote-mark">"</span>
          <p class="quote-text">
            Kitob o'qish — yuzlab hayotni bir umr ichida yashashdir.
          </p>
          <p class="quote-author">— George R.R. Martin</p>
        </div>

      </div><!-- /body -->

      <!-- Footer -->
      <div class="footer">
        <p class="footer-brand">Book Lovers</p>
        <p>
          Bu xabar avtomatik yuborilgan.<br/>
          Savollaringiz bo'lsa: <a href="mailto:${process.env.SMTP_USER}">${process.env.SMTP_USER}</a>
        </p>
      </div>

    </div><!-- /card -->

  </div>
</body>
</html>
`;

const emailService = async (email: string, otp: number) => {
  try {
    const info = await transport.sendMail({
      from: `Book Lovers 📚 <${process.env.SMTP_USER}>`,
      to: email,
      subject: "📖 Tasdiqlash kodingiz — Book Lovers",
      text: `Sizning tasdiqlash kodingiz: ${otp}\n\nKod 10 daqiqa davomida amal qiladi.\n\n— Book Lovers jamoasi`,
      html: generateEmailHTML(otp),
    });
    return info;
  } catch (err: any) {
    throw new Error("Email sending failed");
  }
};

export { emailService };