"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import AppService from "@/services/app.service";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState({
        storeName: "Admin Panel",
        logoUrl: "",
        primaryColor: "#0f172a",
        secondaryColor: "#3b82f6"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await AppService.getSettings();
                if (settings && settings.identity) {
                    setTheme(settings.identity);
                }
            } catch (error) {
                console.error("Failed to load theme settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const updateTheme = (newIdentity) => {
        setTheme((prev) => {
            const updated = { ...prev, ...newIdentity };

            // Apply to CSS variables
            if (updated.secondaryColor) {
                const root = document.documentElement;
                // Convert Hex to OKLCH or just use Hex if Tailwind supports it (it does via variable reference)
                // However, globals.css uses oklch() wrapper. We need to override the variable content.
                // Since globals.css defines --primary: oklch(0.55 0.22 260), we should probably override the property directly with hex
                // BUT, Tailwind 4 (or configured theme) might expect specific format.
                // Let's try setting the variable to the hex value directly.
                // Note: If globals.css has --primary: oklch(...), setting it to #hex might break if tailwind expects channels.
                // Looking at globals.css: --primary: oklch(0.55 0.22 260);
                // We will override the CSS variable to be the hex color.

                root.style.setProperty('--primary', updated.secondaryColor);
                root.style.setProperty('--ring', updated.secondaryColor);
                // Also update secondary to be the same or a variant? 
                // The user wants "secondary" input to control "primary" buttons.
                // So we map secondaryColor -> --primary.
            }

            return updated;
        });
    };

    useEffect(() => {
        if (theme.secondaryColor) {
            const root = document.documentElement;
            root.style.setProperty('--primary', theme.secondaryColor);
            root.style.setProperty('--ring', theme.secondaryColor);
        }
    }, [theme.secondaryColor]);

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, loading }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
