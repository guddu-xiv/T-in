import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, Languages, KeyRound, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { TRANSLATIONS, LANGUAGES, LanguageCode } from "../translations";

interface AdminLockScreenProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onAuthenticate: (token: string) => void;
  logoUrl?: string;
  themePreset?: "taiyariya" | "prayas";
  onThemeChange?: (theme: "taiyariya" | "prayas") => void;
}

const DEFAULT_MASTER_PASSWORD = "Guddu2005@@";

export const AdminLockScreen: React.FC<AdminLockScreenProps> = ({
  currentLang,
  onLanguageChange,
  onAuthenticate,
  logoUrl,
  themePreset = "taiyariya",
  onThemeChange
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage(t.invalidPassword);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      let backendHandled = false;
      try {
        const response = await fetch("/api/admin/verify-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: password.trim() })
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          backendHandled = true;

          if (response.ok && data.success) {
            sessionStorage.setItem("p1_admin_token", data.token);
            localStorage.setItem("p1_admin_token", data.token);
            onAuthenticate(data.token);
            return;
          } else {
            setErrorMessage(data.message || t.invalidPassword);
            return;
          }
        }
      } catch (backendErr) {
        // Backend not available or route not found (e.g. static hosting on GitHub Pages)
        console.warn("Backend API not reachable, falling back to local credentials:", backendErr);
      }

      if (!backendHandled) {
        // Static hosting fallback (e.g. GitHub Pages / offline / serverless)
        const customPass = localStorage.getItem("p1_admin_custom_password");
        const validPassword = customPass ? customPass.trim() : DEFAULT_MASTER_PASSWORD;

        if (password.trim() === validPassword) {
          const clientToken = "p1_token_client_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
          sessionStorage.setItem("p1_admin_token", clientToken);
          localStorage.setItem("p1_admin_token", clientToken);
          onAuthenticate(clientToken);
        } else {
          setErrorMessage(t.invalidPassword || "Incorrect Admin Password! Access denied.");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      const customPass = localStorage.getItem("p1_admin_custom_password");
      const validPassword = customPass ? customPass.trim() : DEFAULT_MASTER_PASSWORD;
      if (password.trim() === validPassword) {
        const clientToken = "p1_token_client_" + Date.now();
        sessionStorage.setItem("p1_admin_token", clientToken);
        localStorage.setItem("p1_admin_token", clientToken);
        onAuthenticate(clientToken);
      } else {
        setErrorMessage(t.invalidPassword || "Incorrect Admin Password! Access denied.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isPrayas = themePreset === "prayas";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B131E] via-[#0F1B2B] to-[#122438] text-slate-100 flex flex-col justify-between items-center p-3 sm:p-6 relative overflow-y-auto font-sans selection:bg-[#009CFC] selection:text-white">
      {/* Background Decorative Theme Elements */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 ${isPrayas ? "bg-[#FF5722]/15" : "bg-[#009CFC]/15"} rounded-full blur-3xl pointer-events-none transition-all duration-300`}></div>
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isPrayas ? "bg-[#E05621]/20" : "bg-[#0077C8]/20"} rounded-full blur-3xl pointer-events-none transition-all duration-300`}></div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${isPrayas ? "bg-[#FF5722]/10" : "bg-[#009CFC]/10"} rounded-full blur-2xl pointer-events-none transition-all duration-300`}></div>

      {/* Top Header Controls: Theme Switcher & Language Switcher */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 z-20 mb-3 sm:mb-6 shrink-0 flex-wrap">
        {/* Theme Preset Switcher */}
        {onThemeChange && (
          <div className="flex items-center bg-[#121F2F]/85 border border-[#1E344B] rounded-xl p-1 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => onThemeChange("taiyariya")}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isPrayas
                  ? "bg-[#009CFC] text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
              title="Taiyariya Theme (Sky Blue)"
            >
              <span className="w-2 h-2 rounded-full bg-[#009CFC] border border-white shrink-0"></span>
              <span className="text-[11px] sm:text-xs">Taiyariya</span>
            </button>
            <button
              type="button"
              onClick={() => onThemeChange("prayas")}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isPrayas
                  ? "bg-[#FF5722] text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
              title="Prayas One Theme (Deep Orange)"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF5722] border border-white shrink-0"></span>
              <span className="text-[11px] sm:text-xs">Prayas One</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-1.5 bg-[#121F2F]/85 border border-[#1E344B] rounded-xl px-2.5 py-1.5 backdrop-blur-md shadow-lg">
          <Languages className={`w-3.5 h-3.5 ${isPrayas ? "text-[#FF5722]" : "text-[#009CFC]"}`} />
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">{t.languageSelect}:</span>
          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer pr-1"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[#121F2F] text-white">
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#121F2F]/95 border border-[#1E344B] rounded-2xl p-4 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 my-auto">
        {/* Logo & Title Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4 relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_2px_rgba(255,255,255,0.95)] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl tracking-tighter text-white ${isPrayas ? "bg-[#FF5722]" : "bg-[#009CFC]"}`}>
                  {isPrayas ? "P1" : "TY"}
                </div>
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 bg-[#0B131E] border ${isPrayas ? "border-[#FF5722]/40" : "border-[#009CFC]/40"} p-1 sm:p-1.5 rounded-lg shadow`}>
              <ShieldCheck className={`w-3.5 h-3.5 ${isPrayas ? "text-[#FF5722]" : "text-[#009CFC]"}`} />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1">
            {t.adminPanelTitle}
          </h1>
          <p className={`text-xs font-semibold ${isPrayas ? "text-[#FF5722]" : "text-[#009CFC]"} uppercase tracking-wider flex items-center justify-center gap-1.5`}>
            <Sparkles className="w-3.5 h-3.5" />
            {isPrayas ? "Prayas One Ultimate Edition" : t.studioSubtitle}
          </p>
        </div>

        {/* Security Info Banner */}
        <div className="mb-6 bg-[#0B131E]/80 border border-[#1E344B] rounded-xl p-3.5 flex items-start gap-3 text-left">
          <Lock className="w-4 h-4 text-[#009CFC] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-white block">{t.lockTitle}</span>
            <p className="text-[#94A9BE] leading-relaxed text-[11px]">
              {t.lockSubtitle}
            </p>
          </div>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="mb-5 bg-red-950/60 border border-red-800/80 rounded-xl p-3.5 flex items-center gap-3 text-red-200 text-xs font-medium animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <KeyRound className={`w-3.5 h-3.5 ${isPrayas ? "text-[#FF5722]" : "text-[#009CFC]"}`} />
              {t.enterPassword}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                disabled={loading}
                className={`w-full bg-[#0B131E] border border-[#1E344B] ${
                  isPrayas
                    ? "focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20"
                    : "focus:border-[#009CFC] focus:ring-2 focus:ring-[#009CFC]/20"
                } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:outline-none pr-10 font-mono`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              isPrayas
                ? "bg-gradient-to-r from-[#FF5722] via-[#F4511E] to-[#E05621] hover:from-[#F4511E] hover:to-[#D84315] shadow-lg shadow-[#FF5722]/30"
                : "bg-gradient-to-r from-[#009CFC] via-[#008AE6] to-[#0077C8] hover:from-[#008AE6] hover:to-[#006BB5] shadow-lg shadow-[#009CFC]/30"
            } text-white font-bold text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.checkingPassword}
              </span>
            ) : (
              <>
                <span>{t.unlockButton}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice Footnote */}
        <div className="mt-6 pt-5 border-t border-[#1E344B] text-center">
          <p className="text-[11px] text-[#94A9BE] leading-relaxed font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t.inspectSecurityNotice}</span>
          </p>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-xs text-[#667788] relative z-10">
        &copy; 2026 {isPrayas ? "Prayas One (prayasone.com)" : "Taiyariya (taiyariya.in)"} • All Rights Reserved
      </div>
    </div>
  );
};
