import { useState, type FormEvent, type ReactNode } from "react";
import { APP_TITLE } from "@/lib/app-config";
import { supabase } from "@/lib/supabase";

export function meta() {
  return [
    { title: `Join ${APP_TITLE}` },
    {
      name: "description",
      content: "Fill the form below to join the Numidians Empire.",
    },
  ];
}

const asset = (id: string, w: number) =>
  `https://api.builder.io/api/v1/image/assets/TEMP/${id}?width=${w}`;

const IMG = {
  logo: asset("085f5c62899e32e853f75df59131cc4852ed7d7e", 116),
  logoMobile: asset("0cde4ef3fe5ef37199e1d0ccf769040f2a7fcd2b", 116),
  statue: asset("d796a9b03e6131b75605e09e216deeaac59e3bc1", 1753),
  statueMobile: asset("f70eb5dc3ee9e04e3ea472803db1c36a8052af6f", 606),
  smallSwirl: asset("3d568a2a8ee61a017638684ddaee5a513449a554", 436),
  mobileSmallSwirl: asset("b2f5c0c3f9d939fd14c78d7605437077446a1b76", 436),
  heroSwirlLeft: asset("7d9c4be015fa8f0926d0fdae178f0b16de895bf9", 485),
  heroSwirlRight: asset("343640344d13a722340bac298473376b17af8511", 430),
};

const DESKTOP_SWIRLS = [
  // Right column - aligned with matching x: 740 and continuous vertical progression
  { id: "a3e547019f83b00109989fa4cd0649aff6ba09af", x: 740, y: -150 },
  { id: "797c4c0223baf05021ed6509055951cb2b258742", x: 740, y: 930 },
  { id: "797c4c0223baf05021ed6509055951cb2b258742", x: 740, y: 2010 },
  { id: "565a1b0f7afa953618c34f7b45990091a5a7c80f", x: 740, y: 3090 },

  // Left column - aligned with matching x: -40 and continuous vertical progression
  { id: "44b5271100fe06229743d2906f035061a8f65fff", x: -40, y: -150 },
  { id: "0c344281fb20811c264146c318e2ea82df9ba60d", x: -40, y: 930 },
  { id: "0c344281fb20811c264146c318e2ea82df9ba60d", x: -40, y: 2010 },
  { id: "ed2d5eb3b6bf3465ca7e22d39ce4db259681f55d", x: -40, y: 3090 },
];

const MOBILE_SWIRLS = [
  { id: "d83c5a4b0405a120eec6e2510adaf0d735945b7b", y: -20 },
  { id: "813e284ab1ff99b936a6667912a30c0e0abc8578", y: 1000 },
  { id: "72e9f259337a1f2ec32b95e02e78848800d1bfbb", y: 2020 },
  { id: "3b5501d8f09a161a2e85b42e53ee2309c262d4da", y: 3040 },
  { id: "bb3623396871f97377166d8b55e9dfcc7bfc91d3", y: 4060 },
  { id: "3a071ef2f138b4c4d0466b4da1c4ea35468ab62b", y: 5080 },
];

const glassField =
  "w-full rounded-[18px] sm:rounded-[22px] border border-white/15 bg-white/[0.07] px-4.5 sm:px-6 text-base md:text-sm font-medium text-white outline-none transition-all duration-200 placeholder:text-white/40 hover:border-white/25 hover:bg-white/[0.1] focus:border-blue-400 focus:bg-white/[0.12] focus:ring-4 focus:ring-blue-500/20 focus:shadow-[0_0_24px_rgba(59,130,246,0.25)] md:bg-[#1e2570]/30 md:hover:bg-[#1e2570]/45 md:focus:bg-[#1e2570]/60";
const inputCls = `${glassField} h-[54px] sm:h-[62px]`;
const textareaCls = `${glassField} min-h-[120px] sm:h-32 resize-none py-3.5 sm:py-4 leading-relaxed`;
const hintCls = "text-[13px] font-medium text-[#DCE6FF] md:text-white/60";
const subCls = "text-sm font-medium text-[#DCE6FF] md:text-white/80";

function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-semibold tracking-wide text-white">{label}</span>
      {hint && <span className={hintCls}>{hint}</span>}
      {children}
    </label>
  );
}

function TextInput({
  label,
  name,
  placeholder,
  type = "text",
  hint,
  required = false,
  min,
  max,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  hint?: ReactNode;
  required?: boolean;
  min?: string;
  max?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className={`${inputCls} ${type === "date" ? "[color-scheme:dark] cursor-pointer" : ""}`}
      />
    </Field>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        className={textareaCls}
      />
    </Field>
  );
}

function Select({
  label,
  name,
  placeholder,
  options,
  hint,
}: {
  label: string;
  name: string;
  placeholder: string;
  options: string[];
  hint?: ReactNode;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="group relative">
        <select
          name={name}
          defaultValue=""
          className={`${inputCls} cursor-pointer appearance-none pr-12 has-[option[value='']:checked]:text-white/50`}
        >
          <option value="" className="bg-[#000A33] text-white/50">
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-[#000A33] text-white">
              {o}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-white/60 transition-transform duration-200 group-hover:translate-y-[-40%]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </Field>
  );
}

function Choice({
  label,
  name,
  options = ["Yes", "No"],
  hint,
}: {
  label: string;
  name: string;
  options?: string[];
  hint?: ReactNode;
}) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold tracking-wide text-white">{label}</legend>
      {hint && <p className={`${hintCls} -mt-1`}>{hint}</p>}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {options.map((o) => (
          <label key={o} className="group relative block cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o}
              className="peer sr-only"
            />
            <span className="flex h-[50px] sm:h-[54px] cursor-pointer items-center justify-center rounded-[18px] border border-white/15 bg-white/[0.07] px-3 text-center text-sm sm:text-base md:text-sm font-semibold text-white transition-all duration-200 hover:border-white/25 hover:bg-white/[0.12] active:scale-[0.98] peer-checked:border-blue-400 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600 peer-checked:shadow-[0_0_20px_rgba(37,99,235,0.35)] peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 md:bg-[#1a206b]/30 md:hover:bg-[#1a206b]/45">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Section({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-t border-white/10 pt-8 transition-all duration-300">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {badge && (
            <span className="inline-flex items-center rounded-full border border-indigo-400/40 bg-indigo-500/15 px-3 py-0.5 text-xs font-bold text-indigo-300">
              {badge}
            </span>
          )}
          <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
        </div>
        <p className={subCls}>{description}</p>
      </header>
      {children}
    </section>
  );
}

const Brand = () => <b className="font-bold">NUMIDIANS club</b>;

const DEPARTMENTS: { name: string; desc: ReactNode }[] = [
  {
    name: "Design",
    desc: (
      <>
        Create visual assets and help shape <Brand /> visual identity.
      </>
    ),
  },
  {
    name: "Development",
    desc: "Build and maintain the digital products and tools used by the community.",
  },
  {
    name: "Logistics",
    desc: "Plan the practical details that help events run smoothly.",
  },
  {
    name: "Communication",
    desc: "Share updates, stories, and opportunities with the community.",
  },
  {
    name: "Photography",
    desc: "Capture event moments and document the community in photos.",
  },
  {
    name: "Video production",
    desc: "Film and edit video content for events and social channels.",
  },
  {
    name: "External Relations",
    desc: "Build relationships with partners, speakers, and other communities.",
  },
  {
    name: "UI/UX",
    desc: "Research and design clear, accessible experiences for digital products.",
  },
];

const RANKS = Array.from({ length: 8 }, (_, i) => String(i + 1));

function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -left-[120px] -top-[180px] size-[680px] bg-[#4F46E5] opacity-[0.22] blur-[90px] animate-pulse-glow" />
      <div
        className="absolute -left-[120px] bottom-[120px] size-[680px] bg-[#2563EB] opacity-[0.18] blur-[90px] animate-pulse-glow"
        style={{ animationDelay: "3.5s" }}
      />
      <div className="md:hidden">
        {MOBILE_SWIRLS.map((s) => (
          <img
            key={s.y}
            src={asset(s.id, 1612)}
            alt=""
            className="pointer-events-none absolute left-1/2 h-[1024px] w-[806px] max-w-none -translate-x-1/2 mix-blend-screen opacity-25"
            style={{ top: s.y }}
          />
        ))}
      </div>
      <div className="pointer-events-none relative mx-auto hidden h-full w-[1440px] md:block">
        {DESKTOP_SWIRLS.map((s) => (
          <img
            key={`${s.x}-${s.y}`}
            src={asset(s.id, 1720)}
            alt=""
            className="pointer-events-none absolute h-[1093px] w-[860px] max-w-none mix-blend-screen opacity-35"
            style={{ left: s.x, top: s.y }}
          />
        ))}
        <img
          src={IMG.smallSwirl}
          alt=""
          className="pointer-events-none absolute left-[1120px] top-[797px] h-[212px] w-[218px] max-w-none -rotate-[149.88deg] -scale-x-100 mix-blend-screen opacity-30"
        />
      </div>
    </div>
  );
}

function MobileIntro() {
  return (
    <div className="relative z-10 md:hidden overflow-hidden">
      <img
        src={IMG.heroSwirlLeft}
        alt=""
        className="pointer-events-none absolute -left-[100px] top-[400px] h-[220px] w-[220px] max-w-none rotate-[145.7deg] mix-blend-screen opacity-15"
      />
      <img
        src={IMG.heroSwirlRight}
        alt=""
        className="pointer-events-none absolute -right-[80px] top-[180px] h-[200px] w-[200px] max-w-none -rotate-[44.8deg] mix-blend-screen opacity-15"
      />
      <div className="relative flex flex-col items-center px-4 pt-10 text-center text-white">
        <img
          src={IMG.logoMobile}
          alt="Numidians logo"
          className="h-[120px] w-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-105"
        />
        <p
          className="mt-5 text-sm font-bold tracking-[0.25em] text-[#DCE6FF] uppercase"
          style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
        >
          NUMIDIANS CLUB
        </p>
        <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
          Welcome to the New Empire!
        </h1>
        <div className="mt-6 flex w-full max-w-md items-center rounded-[22px] border border-white/12 bg-white/[0.07] p-5 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <p className="text-base sm:text-lg font-bold leading-snug text-white">
            We are the Numidians <br />
            <span className="mt-1.5 block text-xs sm:text-sm font-normal text-white/80 leading-relaxed">
              A digital realm where the fierce legacy of the ancient North African empire fuels the innovations of tomorrow.
            </span>
          </p>
        </div>
        <div className="mt-6 grid w-full grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col rounded-[20px] border border-white/10 bg-white/[0.06] p-4.5 text-left backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <svg width="20" height="20" viewBox="0 0 43 43" fill="none" className="shrink-0" aria-hidden>
                  <path d="M20.1562 0C19.7999 0 19.4581 0.141574 19.2061 0.393576C18.9541 0.645578 18.8125 0.987365 18.8125 1.34375V8.33125C15.7773 8.9508 13.0494 10.6 11.0905 12.9997C9.13154 15.3994 8.06187 18.4022 8.0625 21.5V24.1875H5.375C3.94946 24.1875 2.58231 24.7538 1.5743 25.7618C0.566293 26.7698 0 28.137 0 29.5625V40.3125C0 41.0253 0.283146 41.7088 0.78715 42.2129C1.29115 42.7169 1.97473 43 2.6875 43H14.7812C15.1376 43 15.4794 42.8584 15.7314 42.6064C15.9834 42.3544 16.125 42.0126 16.125 41.6562V36.2812C16.125 35.9249 16.2666 35.5831 16.5186 35.3311C16.7706 35.0791 17.1124 34.9375 17.4688 34.9375H25.5312C25.8876 34.9375 26.2294 35.0791 26.4814 35.3311C26.7334 35.5831 26.875 35.9249 26.875 36.2812V41.6562C26.875 42.0126 27.0166 42.3544 27.2686 42.6064C27.5206 42.8584 27.8624 43 28.2188 43H40.3125C41.0253 43 41.7088 42.7169 42.2129 42.2129C42.7169 41.7088 43 41.0253 43 40.3125V29.5625C43 28.137 42.4337 26.7698 41.4257 25.7618C40.4177 24.7538 39.0505 24.1875 37.625 24.1875H34.9375V21.5C34.9375 17.9362 33.5218 14.5183 31.0017 11.9983C28.4817 9.47823 25.0638 8.0625 21.5 8.0625V5.375H28.2188C28.5751 5.375 28.9169 5.23343 29.1689 4.98142C29.4209 4.72942 29.5625 4.38763 29.5625 4.03125V1.34375C29.5625 0.987365 29.4209 0.645578 29.1689 0.393576C28.9169 0.141574 28.5751 0 28.2188 0H20.1562ZM10.75 30.9062V36.2812C10.75 36.6376 10.6084 36.9794 10.3564 37.2314C10.1044 37.4834 9.76263 37.625 9.40625 37.625C9.04987 37.625 8.70808 37.4834 8.45608 37.2314C8.20407 36.9794 8.0625 36.6376 8.0625 36.2812V30.9062C8.0625 30.5499 8.20407 30.2081 8.45608 29.9561C8.70808 29.7041 9.04987 29.5625 9.40625 29.5625C9.76263 29.5625 10.1044 29.7041 10.3564 29.9561C10.6084 30.2081 10.75 30.5499 10.75 30.9062ZM33.5938 29.5625C33.9501 29.5625 34.2919 29.7041 34.5439 29.9561C34.7959 30.2081 34.9375 30.5499 34.9375 30.9062V36.2812C34.9375 36.6376 34.7959 36.9794 34.5439 37.2314C34.2919 37.4834 33.9501 37.625 33.5938 37.625C33.2374 37.625 32.8956 37.4834 32.6436 37.2314C32.3916 36.9794 32.25 36.6376 32.25 36.2812V30.9062C32.25 30.5499 32.3916 30.2081 32.6436 29.9561C32.8956 29.7041 33.2374 29.5625 33.5938 29.5625ZM18.8125 20.1562V25.5312C18.8125 25.8876 18.6709 26.2294 18.4189 26.4814C18.1669 26.7334 17.8251 26.875 17.4688 26.875C17.1124 26.875 16.7706 26.7334 16.5186 26.4814C16.2666 26.2294 16.125 25.8876 16.125 25.5312V20.1562C16.125 19.7999 16.2666 19.4581 16.5186 19.2061C16.7706 18.9541 17.1124 18.8125 17.4688 18.8125C17.8251 18.8125 18.1669 18.9541 18.4189 19.2061C18.6709 19.4581 18.8125 19.7999 18.8125 20.1562ZM25.5312 18.8125C25.8876 18.8125 26.2294 18.9541 26.4814 19.2061C26.7334 19.4581 26.875 19.7999 26.875 20.1562V25.5312C26.875 25.8876 26.7334 26.2294 26.4814 26.4814C26.2294 26.7334 25.8876 26.875 25.5312 26.875C25.1749 26.875 24.8331 26.7334 24.5811 26.4814C24.3291 26.2294 24.1875 25.8876 24.1875 25.5312V20.1562C24.1875 19.7999 24.3291 19.4581 24.5811 19.2061C24.8331 18.9541 25.1749 18.8125 25.5312 18.8125Z" fill="white" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-white">Our Legacy</h2>
            </div>
            <p className="mt-2 text-xs font-medium leading-relaxed text-[#DCE6FF]/80">
              Inspired by the strength and heritage of the ancient Numidian civilization.
            </p>
          </div>
          <div className="flex flex-col rounded-[20px] border border-white/10 bg-white/[0.06] p-4.5 text-left backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <svg width="20" height="20" viewBox="0 0 43 43" fill="none" className="shrink-0" aria-hidden>
                  <path d="M41.3875 23.1125C42.2905 23.1125 43 22.3815 43 21.5C43 20.597 42.2905 19.8875 41.3875 19.8875H38.7V15.1575H41.3875C42.2905 15.1575 43 14.448 43 13.545C43 12.6635 42.2905 11.9325 41.3875 11.9325H38.2055C37.6961 10.2466 36.7779 8.71279 35.5325 7.46745C34.2872 6.22212 32.7534 5.30391 31.0675 4.7945V1.6125C31.0675 0.731 30.3365 0 29.455 0C28.5735 0 27.8425 0.731 27.8425 1.6125V4.3H23.1125V1.6125C23.1125 0.731 22.3815 0 21.5 0C20.6185 0 19.8875 0.731 19.8875 1.6125V4.3H15.179V1.6125C15.179 1.18484 15.0091 0.774693 14.7067 0.47229C14.4043 0.169888 13.9942 0 13.5665 0C13.1388 0 12.7287 0.169888 12.4263 0.47229C12.1239 0.774693 11.954 1.18484 11.954 1.6125V4.7945C10.2641 5.30085 8.72594 6.2177 7.47667 7.46322C6.2274 8.70874 5.30593 10.2442 4.7945 11.9325H1.6125C1.18484 11.9325 0.774693 12.1024 0.47229 12.4048C0.169888 12.7072 0 13.1173 0 13.545C0 13.9727 0.169888 14.3828 0.47229 14.6852C0.774693 14.9876 1.18484 15.1575 1.6125 15.1575H4.3V19.8875H1.6125C1.18484 19.8875 0.774693 20.0574 0.47229 20.3598C0.169888 20.6622 0 21.0723 0 21.5C0 21.9277 0.169888 22.3378 0.47229 22.6402C0.774693 22.9426 1.18484 23.1125 1.6125 23.1125H4.3V27.8425H1.6125C1.18484 27.8425 0.774693 28.0124 0.47229 28.3148C0.169888 28.6172 0 29.0273 0 29.455C0 29.8827 0.169888 30.2928 0.47229 30.5952C0.774693 30.8976 1.18484 31.0675 1.6125 31.0675H4.7945C5.30247 32.7576 6.22277 34.2949 7.47255 35.5409C8.72233 36.7869 10.2624 37.7026 11.954 38.2055V41.3875C11.954 41.8152 12.1239 42.2253 12.4263 42.5277C12.7287 42.8301 13.1388 43 13.5665 43C21.9492 43 22.3593 42.8301 22.6617 42.5277C22.9641 42.2253 23.134 41.8152 23.134 41.3875V38.7H27.8425V41.3875C27.8425 42.269 28.5735 43 29.455 43C30.3365 43 31.0675 42.269 31.0675 41.3875V38.2055C32.7534 37.6961 34.2872 36.7779 35.5325 35.5325C36.7779 34.2872 37.6961 32.7534 38.2055 31.0675H41.3875C42.2905 31.0675 43 30.3365 43 29.455C43 28.552 42.2905 27.8425 41.3875 27.8425H38.7V23.1125H41.3875ZM32.809 26.359C32.809 29.9065 29.9065 32.809 26.359 32.809H16.641C13.0935 32.809 10.191 29.9065 10.191 26.359V16.641C10.191 13.0935 13.0935 10.191 16.641 10.191H26.359C29.9065 10.191 32.809 13.0935 32.809 16.641V26.359Z" fill="white" />
                  <path d="M17.243 30.6332H25.7785C28.466 30.6332 30.659 28.4617 30.659 25.7527V17.2172C30.659 14.5297 28.4875 12.3367 25.7785 12.3367H17.243C14.5555 12.3367 12.3625 14.5082 12.3625 17.2172V25.7527C12.3625 28.4617 14.534 30.6332 17.243 30.6332Z" fill="white" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-white">Our Mission</h2>
            </div>
            <p className="mt-2 text-xs font-medium leading-relaxed text-[#DCE6FF]/80">
              Turning knowledge into innovation through technology, projects, and technical challenges.
            </p>
          </div>
        </div>
        <p className="mt-10 text-xl sm:text-2xl font-black tracking-wide text-white">Register Now</p>
        <a
          href="#registration-form"
          aria-label="Scroll to the registration form"
          className="group mt-3 inline-flex size-14 items-center justify-center rounded-full bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/25 active:scale-95 animate-bounce-slow"
        >
          <svg width="36" height="36" viewBox="0 0 54 54" fill="none" className="transition-transform duration-300 group-hover:translate-y-1" aria-hidden>
            <path d="M26.625 36V18M34.5 28.125L26.625 36L18.75 28.125" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <div className="relative mt-4 h-[320px] w-full overflow-hidden flex items-end">
        {/* Massinisa statue: reversed with -scale-x-100 so he looks to the right! */}
        <img
          src={IMG.statueMobile}
          alt="Massinisa"
          className="pointer-events-none absolute -left-2 -bottom-2 h-[395px] w-auto max-w-none -scale-x-100 rotate-[4deg] drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)]"
        />
        {/* Floating Speech bubble situated to the right of Massinisa */}
        <div className="absolute right-3 sm:right-6 top-[135px] flex w-[190px] sm:w-[215px] items-center justify-center animate-float">
          <div className="relative rounded-[20px] border border-white/20 bg-white/[0.12] p-4 shadow-[0_16px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 size-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-white/20" />
            <p className="text-xs sm:text-[13px] font-bold leading-snug text-white text-center">
              Fill The Form Below To Join Numidians Empire !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeRoute() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasLinkedin, setHasLinkedin] = useState<boolean | null>(null);
  const [hasGithub, setHasGithub] = useState<boolean | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const fd = new FormData(e.currentTarget);
    const val = (name: string) => (fd.get(name) as string)?.trim() || null;

    // Build individual department rank values
    const rankVal = (dept: string) => {
      const r = val(`rank-${dept}`);
      return r ? parseInt(r, 10) : null;
    };

    const payload = {
      full_name: val("fullName"),
      email: val("email"),
      phone: val("phone"),
      discord: val("discord"),
      dob: val("dob"),
      has_linkedin: hasLinkedin ?? false,
      linkedin_url: hasLinkedin ? val("linkedinUrl") : null,
      photo_url: val("photo"),
      academic_status: val("status"),
      has_github: hasGithub ?? false,
      github_username: hasGithub ? val("githubUsername") : null,
      portfolio_url: val("portfolio"),
      source_channel: val("introduction"),
      has_participated: val("participated") === "Yes",
      attended_welcome_day: val("welcomeDay"),
      why_join: val("whyJoin"),
      rank_design: rankVal("Design"),
      rank_development: rankVal("Development"),
      rank_logistics: rankVal("Logistics"),
      rank_communication: rankVal("Communication"),
      rank_photography: rankVal("Photography"),
      rank_video_production: rankVal("Video production"),
      rank_external_relations: rankVal("External Relations"),
      rank_ui_ux: rankVal("UI/UX"),
      contribution: val("contribution"),
      gain_goals: val("gain"),
      skills_and_experience: val("skills"),
      additional_notes: val("other"),
    };

    try {
      let { error } = await supabase
        .from("registrations")
        .insert([payload]);

      // If Supabase table does not yet have linkedin_url or github_username, retry gracefully
      if (error && (error.message?.includes("linkedin_url") || error.message?.includes("github_username"))) {
        console.warn("Retrying insert without optional social URL columns:", error.message);
        const fallbackPayload: Record<string, any> = { ...payload };
        delete fallbackPayload.linkedin_url;
        delete fallbackPayload.github_username;
        const retry = await supabase.from("registrations").insert([fallbackPayload]);
        error = retry.error;
      }

      if (error) {
        console.error("Supabase insert error:", error);
        setSubmitError(error.message);
      } else {
        setSubmitted(true);
      }
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#020617] via-[#060D2E] to-[#0A1647]">
      <Background />
      <div className="relative">
        <MobileIntro />
        <div className="relative px-3 pb-12 md:px-6 md:py-[100px]">
          <img
            src={IMG.statue}
            alt=""
            className="pointer-events-none absolute top-20 z-20 hidden aspect-[67/73] w-[61%] max-w-[877px] -rotate-[1.267deg] drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] transition-transform duration-700 md:block"
            style={{ right: "max(-17%, calc(50% - 720px - 240px))" }}
          />
          <form
            id="registration-form"
            onSubmit={handleSubmit}
            className="relative z-10 mx-auto flex w-full max-w-[440px] sm:max-w-[560px] md:max-w-[1080px] scroll-mt-6 flex-col gap-7 sm:gap-9 overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[40px] border border-white/[0.14] bg-white/[0.08] p-5 sm:p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-[24px] transition-all duration-300"
          >
            {/* Ambient top glowing line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />

            <div className="hidden flex-col items-center gap-5 md:flex">
              <img
                src={IMG.logo}
                alt="Numidians logo"
                className="h-[131.5px] w-[58px] drop-shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-105"
              />
              <h1 className="rounded-[24px] border border-white/20 bg-white/10 px-8 py-4 text-center text-xl font-extrabold text-white shadow-[0_12px_28px_rgba(0,0,0,0.25)] backdrop-blur-md">
                Fill The Form Below To Join The Numidians Empire!
              </h1>
              <p className="text-center text-sm font-medium text-white/80">
                Share a little about yourself and your journey.
              </p>
            </div>

            {/* Section 1: Personal info */}
            <section className="flex flex-col gap-5">
              <header className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-indigo-400/40 bg-indigo-500/15 px-3 py-0.5 text-xs font-bold text-indigo-300">
                    01 / Basics
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Let’s Get to Know You</h2>
                </div>
                <p className="text-[13px] font-medium text-[#DCE6FF] md:text-white/80">
                  Start with the basics so we can get your profile ready.
                </p>
              </header>
              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                <TextInput label="What is your full name?" name="fullName" placeholder="Enter your full name" required />
                <TextInput label="What is your email address?" name="email" type="email" placeholder="name@example.com" required />
                <TextInput label="What is your phone number?" name="phone" type="tel" placeholder="0540152000" required />
                <TextInput label="What is your Discord username?" name="discord" placeholder="username" required />
                <TextInput
                  label="What is your date of birth?"
                  name="dob"
                  type="date"
                  max="2018-12-31"
                  min="1960-01-01"
                />
                <fieldset className="flex min-w-0 flex-col gap-2">
                  <legend className="mb-2 text-sm font-semibold tracking-wide text-white">Do you have a LinkedIn profile?</legend>
                  <div className="grid grid-cols-2 gap-3">
                    {["Yes", "No"].map((o) => (
                      <label key={o} className="group relative block cursor-pointer">
                        <input
                          type="radio"
                          name="linkedin"
                          value={o}
                          checked={hasLinkedin === (o === "Yes")}
                          className="peer sr-only"
                          onChange={() => setHasLinkedin(o === "Yes")}
                        />
                        <span className="flex h-[50px] sm:h-[54px] cursor-pointer items-center justify-center rounded-[18px] border border-white/15 bg-white/[0.07] px-3 text-center text-sm sm:text-base md:text-sm font-semibold text-white transition-all duration-200 hover:border-white/25 hover:bg-white/[0.12] active:scale-[0.98] peer-checked:border-blue-400 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600 peer-checked:shadow-[0_0_20px_rgba(37,99,235,0.35)] peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 md:bg-[#1a206b]/30 md:hover:bg-[#1a206b]/45">
                          {o}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className={`grid transition-all duration-300 ease-in-out ${hasLinkedin ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <input
                        name="linkedinUrl"
                        type="url"
                        placeholder="https://www.linkedin.com/in/username (optional)"
                        className={inputCls}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
              <TextInput label="Link to a photo of you (optional)" name="photo" type="url" placeholder="https://drive.google.com/file/d/…" />
            </section>

            {/* Section 2: Studies & Career */}
            <Section
              badge="02 / Background"
              title="Your Studies & Career"
              description="Tell us about your current status and online presence."
            >
              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                <Select
                  label="What best describes your current status?"
                  name="status"
                  placeholder="Choose an option"
                  options={["High school student", "University student", "Graduate", "Employed", "Freelancer", "Other"]}
                />
                <fieldset className="flex min-w-0 flex-col gap-2">
                  <legend className="mb-2 text-sm font-semibold tracking-wide text-white">Do you have a GitHub profile?</legend>
                  <div className="grid grid-cols-2 gap-3">
                    {["Yes", "No"].map((o) => (
                      <label key={o} className="group relative block cursor-pointer">
                        <input
                          type="radio"
                          name="github"
                          value={o}
                          checked={hasGithub === (o === "Yes")}
                          className="peer sr-only"
                          onChange={() => setHasGithub(o === "Yes")}
                        />
                        <span className="flex h-[50px] sm:h-[54px] cursor-pointer items-center justify-center rounded-[18px] border border-white/15 bg-white/[0.07] px-3 text-center text-sm sm:text-base md:text-sm font-semibold text-white transition-all duration-200 hover:border-white/25 hover:bg-white/[0.12] active:scale-[0.98] peer-checked:border-blue-400 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600 peer-checked:shadow-[0_0_20px_rgba(37,99,235,0.35)] peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 md:bg-[#1a206b]/30 md:hover:bg-[#1a206b]/45">
                          {o}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className={`grid transition-all duration-300 ease-in-out ${hasGithub ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <input
                        name="githubUsername"
                        type="text"
                        placeholder="https://github.com/username or username (optional)"
                        className={inputCls}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
              <TextInput
                label="Link to your portfolio (optional)"
                name="portfolio"
                type="url"
                placeholder="https://…"
                hint="Optional · website, Behance, Dribbble, etc."
              />
            </Section>

            {/* Section 3: Connection */}
            <Section
              badge="03 / Connection"
              title="Your Connection with US"
              description="Tell us how you found us and whether you’ve already joined an event."
            >
              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                <Select
                  label="What first introduced you to NUMIDIANS club?"
                  name="introduction"
                  placeholder="Choose an option"
                  options={["Friend", "Social media", "Campus event", "Discord", "Search", "Other"]}
                />
                <Choice label="Have you ever participated in a NUMIDIANS club event or activity?" name="participated" />
              </div>
              <Choice
                label="Welcome Day"
                name="welcomeDay"
                options={["Yes, I attended", "No, I couldn’t attend"]}
                hint={<>Did you attend the <Brand /> Welcome Day?</>}
              />
            </Section>

            {/* Section 4: Journey & Department Ranks */}
            <Section
              badge="04 / Journey & Ranks"
              title="Your NUMIDIANS Journey"
              description="Rank each department by preference (1 = highest preference, 8 = lowest preference)."
            >
              <TextArea label="What made you want to join NUMIDIANS club?" name="whyJoin" placeholder="Tell us what drew you to the community." />
              
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold tracking-wide text-white">Department Preference Rankings</span>
                <p className={hintCls}>Rank all departments from 1 (your top choice) to 8.</p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                  {DEPARTMENTS.map((d, index) => (
                    <div
                      key={d.name}
                      className="group relative flex flex-col justify-between rounded-[22px] border border-white/12 bg-white/8 p-4 backdrop-blur-sm transition-all duration-200 hover:border-indigo-400/40 hover:bg-white/12 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] md:border-0 md:bg-[#2a2eb3]/20 md:hover:bg-[#2a2eb3]/35"
                    >
                      <div className="mb-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white transition-colors group-hover:text-indigo-200">
                            {d.name}
                          </span>
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/60">
                            #{index + 1}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-xs text-white/70">
                          {d.desc}
                        </p>
                      </div>
                      <div className="relative">
                        <select
                          name={`rank-${d.name}`}
                          defaultValue=""
                          className="w-full cursor-pointer appearance-none rounded-[14px] border border-white/15 bg-white/10 px-3 py-2.5 text-base md:text-sm font-semibold text-white outline-none transition-all hover:bg-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 has-[option[value='']:checked]:text-white/60 md:border-0 md:bg-[#1f228a]/40"
                        >
                          <option value="" className="bg-[#000A33] text-white/60">
                            Select Rank
                          </option>
                          {RANKS.map((r) => (
                            <option key={r} value={r} className="bg-[#000A33] text-white">
                              Rank {r} {r === "1" ? "⭐ (Top)" : r === "8" ? "(Lowest)" : ""}
                            </option>
                          ))}
                        </select>
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/60"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <TextArea label="How are you planning to contribute to the community?" name="contribution" placeholder="Share your ideas, skills, and how you’d like to help." />
              <TextArea label="What are you hoping to gain from your journey with us ?" name="gain" placeholder="What do you want to learn, build, or achieve?" />
              <TextArea
                label="Tell us about the skills and experience you have and what you’d like to bring to our community."
                name="skills"
                placeholder="Share your background, strengths, and what you hope to contribute."
              />
            </Section>

            {/* Section 5: Anything else */}
            <Section
              badge="05 / Notes"
              title="Anything Else"
              description="Add anything that didn’t fit above."
            >
              <TextArea label="Is there anything else you’d like to share?" name="other" placeholder="Add any extra details that will help us get to know you." />
            </Section>

            {/* Submit Action Area */}
            {submitError && (
              <div className="flex items-start gap-3 rounded-[20px] border border-red-400/30 bg-red-500/12 p-5 backdrop-blur-md animate-fade-in-up">
                <svg className="mt-0.5 size-5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-red-300">Submission failed</p>
                  <p className="text-xs text-red-200/80">{submitError}</p>
                </div>
              </div>
            )}
            {submitted ? (
              <div className="flex flex-col items-center gap-4 rounded-[28px] border border-green-400/30 bg-green-500/15 p-8 text-center backdrop-blur-md animate-fade-in-up">
                <div className="flex size-16 items-center justify-center rounded-full bg-green-500/20 text-green-400 shadow-[0_0_30px_rgba(74,222,128,0.4)]">
                  <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Application Submitted!</h3>
                <p className="max-w-md text-sm text-[#DCE6FF]">
                  Thank you for registering to join the Numidians Empire. Your application has been recorded successfully — we'll be in touch soon!
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setSubmitError(null); }}
                  className="mt-2 text-sm font-semibold text-indigo-300 underline hover:text-white transition-colors"
                >
                  Submit Another Response
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center gap-4 border-t border-white/15 pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex h-16 w-full max-w-md cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] px-6 sm:px-8 text-base sm:text-lg font-bold text-white shadow-[0_12px_32px_rgba(29,78,216,0.4)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_16px_40px_rgba(37,99,235,0.55)] active:scale-[0.98] disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? "Submitting Application..." : "Submit Registration"}
                    <svg className="size-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>
                <p className="text-center text-xs font-medium text-white/60">
                  By registering, you take your first step into the Numidians Empire.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
