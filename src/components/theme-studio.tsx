"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Palette, RotateCcw, Check } from "lucide-react";
import {
  getThemeConfig,
  saveThemeConfig,
  resetThemeConfig,
  applyThemeConfig,
  type ThemeConfig,
} from "@/lib/theme-store";
import { Button } from "@/components/ui/button";

const PRESET_PRIMARY = [
  { hue: 42, sat: 65, label: "Gold", class: "bg-[hsl(42,65%,55%)]" },
  { hue: 220, sat: 70, label: "Blue", class: "bg-[hsl(220,70%,55%)]" },
  { hue: 270, sat: 60, label: "Purple", class: "bg-[hsl(270,60%,55%)]" },
  { hue: 160, sat: 60, label: "Teal", class: "bg-[hsl(160,60%,55%)]" },
  { hue: 0, sat: 65, label: "Rose", class: "bg-[hsl(0,65%,55%)]" },
  { hue: 90, sat: 50, label: "Lime", class: "bg-[hsl(90,50%,55%)]" },
];

const PRESET_RADII = [
  { value: 0, label: "None" },
  { value: 0.375, label: "Subtle" },
  { value: 0.625, label: "Default" },
  { value: 1, label: "Rounded" },
  { value: 1.5, label: "Pill" },
];

export function ThemeStudio() {
  const [config, setConfig] = useState<ThemeConfig>(getThemeConfig());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    applyThemeConfig(config);
  }, []);

  const update = useCallback((partial: Partial<ThemeConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      applyThemeConfig(next);
      return next;
    });
  }, []);

  const handleSave = () => {
    saveThemeConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetThemeConfig();
    setConfig(getThemeConfig());
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Palette className="h-5 w-5 text-primary" />
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Customization
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Theme Studio</h1>
        <p className="mt-2 text-muted-foreground">
          Customize the look and feel of your store. Changes apply in real time.
        </p>
      </motion.div>

      <div className="mt-10 space-y-10">
        {/* Primary Color */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h2 className="text-sm font-semibold mb-4">Primary Color</h2>
          <div className="flex flex-wrap gap-3">
            {PRESET_PRIMARY.map((preset) => (
              <button
                key={preset.hue}
                onClick={() => update({ primaryHue: preset.hue, primarySaturation: preset.sat })}
                className={`relative h-14 w-14 rounded-2xl transition-all ${
                  config.primaryHue === preset.hue && config.primarySaturation === preset.sat
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: `hsl(${preset.hue},${preset.sat}%,55%)` }}
                aria-label={preset.label}
                title={preset.label}
              >
                {config.primaryHue === preset.hue && config.primarySaturation === preset.sat && (
                  <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>

          {/* Hue slider */}
          <div className="mt-4 max-w-md">
            <label className="text-xs text-muted-foreground mb-2 block">
              Hue: <span className="font-mono text-foreground">{config.primaryHue}°</span>
            </label>
            <input
              type="range"
              min={0}
              max={360}
              value={config.primaryHue}
              onChange={(e) => update({ primaryHue: Number(e.target.value) })}
              className="w-full accent-foreground"
              style={{
                background: `linear-gradient(to right, 
                  hsl(0,${config.primarySaturation}%,55%),
                  hsl(60,${config.primarySaturation}%,55%),
                  hsl(120,${config.primarySaturation}%,55%),
                  hsl(180,${config.primarySaturation}%,55%),
                  hsl(240,${config.primarySaturation}%,55%),
                  hsl(300,${config.primarySaturation}%,55%),
                  hsl(360,${config.primarySaturation}%,55%))`,
                height: 8,
                borderRadius: 4,
                WebkitAppearance: "none",
                appearance: "none",
              }}
            />
          </div>
        </motion.section>

        {/* Accent Color */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold mb-4">Accent Color</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { hue: 28, sat: 55, label: "Warm", class: "bg-[hsl(28,55%,50%)]" },
              { hue: 200, sat: 60, label: "Cool", class: "bg-[hsl(200,60%,50%)]" },
              { hue: 330, sat: 55, label: "Pink", class: "bg-[hsl(330,55%,50%)]" },
              { hue: 80, sat: 50, label: "Green", class: "bg-[hsl(80,50%,50%)]" },
            ].map((preset) => (
              <button
                key={preset.hue}
                onClick={() => update({ accentHue: preset.hue, accentSaturation: preset.sat })}
                className={`relative h-10 w-10 rounded-full transition-all ${
                  config.accentHue === preset.hue && config.accentSaturation === preset.sat
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: `hsl(${preset.hue},${preset.sat}%,50%)` }}
                aria-label={preset.label}
                title={preset.label}
              >
                {config.accentHue === preset.hue && config.accentSaturation === preset.sat && (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 max-w-md">
            <label className="text-xs text-muted-foreground mb-2 block">
              Hue: <span className="font-mono text-foreground">{config.accentHue}°</span>
            </label>
            <input
              type="range"
              min={0}
              max={360}
              value={config.accentHue}
              onChange={(e) => update({ accentHue: Number(e.target.value) })}
              className="w-full"
              style={{
                background: `linear-gradient(to right,
                  hsl(0,${config.accentSaturation}%,50%),
                  hsl(60,${config.accentSaturation}%,50%),
                  hsl(120,${config.accentSaturation}%,50%),
                  hsl(180,${config.accentSaturation}%,50%),
                  hsl(240,${config.accentSaturation}%,50%),
                  hsl(300,${config.accentSaturation}%,50%),
                  hsl(360,${config.accentSaturation}%,50%))`,
                height: 8,
                borderRadius: 4,
                WebkitAppearance: "none",
                appearance: "none",
              }}
            />
          </div>
        </motion.section>

        {/* Border Radius */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-sm font-semibold mb-4">Border Radius</h2>
          <div className="flex flex-wrap gap-2">
            {PRESET_RADII.map((preset) => (
              <button
                key={preset.value}
                onClick={() => update({ radius: preset.value })}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                  config.radius === preset.value
                    ? "bg-foreground text-background border-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground border-transparent"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="mt-4 max-w-md">
            <label className="text-xs text-muted-foreground mb-2 block">
              Radius: <span className="font-mono text-foreground">{config.radius}rem</span>
            </label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.125}
              value={config.radius}
              onChange={(e) => update({ radius: Number(e.target.value) })}
              className="w-full accent-foreground"
            />
          </div>

          {/* Preview shapes */}
          <div className="mt-6 flex gap-3 items-center">
            {[0.25, 0.5, 1, 1.5].map((r) => (
              <div
                key={r}
                className="h-12 w-12 bg-primary/20 border border-primary/30"
                style={{ borderRadius: `${r}rem` }}
                title={`${r}rem`}
              />
            ))}
          </div>
        </motion.section>

        {/* Live Preview Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border bg-card p-6"
          style={{ borderRadius: `${config.radius}rem` }}
        >
          <h2 className="text-sm font-semibold mb-3">Preview</h2>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-5 py-2 text-sm font-semibold rounded-full"
              style={{
                backgroundColor: `hsl(${config.primaryHue},${config.primarySaturation}%,55%)`,
                color: `hsl(${config.primaryHue},${config.primarySaturation}%,4%)`,
                borderRadius: `${config.radius}rem`,
              }}
            >
              Primary Button
            </button>
            <button
              className="px-5 py-2 text-sm font-semibold rounded-full"
              style={{
                backgroundColor: `hsl(${config.accentHue},${config.accentSaturation}%,50%)`,
                color: `hsl(${config.accentHue},${config.accentSaturation}%,95%)`,
                borderRadius: `${config.radius}rem`,
              }}
            >
              Accent Button
            </button>
            <div
              className="px-5 py-2 text-sm border"
              style={{ borderRadius: `${config.radius}rem` }}
            >
              Bordered
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <span className="inline-block" style={{ borderRadius: `${config.radius}rem`, backgroundColor: "hsl(var(--color-primary) / 0.1)", padding: "0.25rem 0.75rem" }}>
              This is how text selections and highlights will look.
            </span>
          </div>
        </motion.section>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-20">
          <Button
            onClick={handleSave}
            className="gap-2 rounded-full"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Palette className="h-4 w-4" />
                Save Theme
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2 rounded-full"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  );
}
