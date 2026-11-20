// =====================================
// VYNEX SUPABASE CONFIGURATION
// =====================================

window.VYNEX_SUPABASE_CONFIG = {
    url: "YOUR_SUPABASE_PROJECT_URL",
    anonKey: "YOUR_SUPABASE_ANON_KEY"
};

// Supabase client will be initialized
// after we add your real project details.
window.getVynexSupabaseClient = function () {
    const config = window.VYNEX_SUPABASE_CONFIG;

    if (!window.supabase) {
        throw new Error("Supabase SDK has not loaded.");
    }

    if (
        !config.url ||
        !config.anonKey ||
        config.url === "YOUR_SUPABASE_PROJECT_URL" ||
        config.anonKey === "YOUR_SUPABASE_ANON_KEY"
    ) {
        throw new Error("Supabase has not been configured yet.");
    }

    if (!window.vynexSupabaseClient) {
        window.vynexSupabaseClient =
            window.supabase.createClient(
                config.url,
                config.anonKey
            );
    }

    return window.vynexSupabaseClient;
};
