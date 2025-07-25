// tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"), // ✨ Add this line
  ],
} satisfies Config

export default config