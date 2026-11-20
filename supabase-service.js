// =====================================
// VYNEX SUPABASE SERVICE
// Authentication, profiles, videos,
// posts and messaging
// =====================================

window.VynexSupabase = {

    // GET SUPABASE CLIENT
    client() {
        return window.getVynexSupabaseClient();
    },

    // -------------------------------
    // AUTHENTICATION
    // -------------------------------

    async signUp(username, email, password) {
        const client = this.client();

        return await client.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });
    },

    async signIn(email, password) {
        const client = this.client();

        return await client.auth.signInWithPassword({
            email,
            password
        });
    },

    async signOut() {
        const client = this.client();
        return await client.auth.signOut();
    },

    async getCurrentUser() {
        const client = this.client();
        const { data, error } = await client.auth.getUser();

        if (error) throw error;

        return data.user;
    },

    // -------------------------------
    // USER PROFILES
    // -------------------------------

    async saveProfile(profile) {
        const client = this.client();
        const user = await this.getCurrentUser();

        return await client
            .from("profiles")
            .upsert({
                id: user.id,
                username: profile.username,
                display_name: profile.display_name || "",
                bio: profile.bio || "",
                updated_at: new Date().toISOString()
            });
    },

    async getProfile(userId) {
        const client = this.client();

        return await client
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
    },

    // -------------------------------
    // VIDEO STORAGE
    // -------------------------------

    async uploadVideo(file) {
        const client = this.client();
        const user = await this.getCurrentUser();

        if (!file || !file.type.startsWith("video/")) {
            throw new Error("Please select a valid video.");
        }

        const extension = file.name.split(".").pop();
        const filePath =
            user.id + "/" + Date.now() + "." + extension;

        const { data, error } = await client.storage
            .from("vynex-videos")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type
            });

        if (error) throw error;

        return data;
    },

    // -------------------------------
    // VIDEO POSTS
    // -------------------------------

    async createPost(videoPath, caption) {
        const client = this.client();
        const user = await this.getCurrentUser();

        return await client
            .from("posts")
            .insert({
                user_id: user.id,
                video_path: videoPath,
                caption: caption || ""
            })
            .select()
            .single();
    },

    async getFeed() {
        const client = this.client();

        return await client
            .from("posts")
            .select("*")
            .order("created_at", {
                ascending: false
            });
    },

    // -------------------------------
    // MESSAGES
    // -------------------------------

    async sendMessage(receiverId, message) {
        const client = this.client();
        const user = await this.getCurrentUser();

        return await client
            .from("messages")
            .insert({
                sender_id: user.id,
                receiver_id: receiverId,
                content: message
            })
            .select()
            .single();
    },

    async getMessages(otherUserId) {
        const client = this.client();
        const user = await this.getCurrentUser();

        return await client
            .from("messages")
            .select("*")
            .or(
                "and(sender_id.eq." + user.id +
                ",receiver_id.eq." + otherUserId +
                "),and(sender_id.eq." + otherUserId +
                ",receiver_id.eq." + user.id + ")"
            )
            .order("created_at", {
                ascending: true
            });
    },

    // -------------------------------
    // REAL-TIME MESSAGES
    // -------------------------------

    subscribeToMessages(callback) {
        const client = this.client();

        return client
            .channel("vynex-messages")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages"
                },
                payload => callback(payload.new)
            )
            .subscribe();
    },

    unsubscribe(channel) {
        if (!channel) return;

        const client = this.client();
        return client.removeChannel(channel);
    }

};

console.log("Vynex Supabase service prepared.");
