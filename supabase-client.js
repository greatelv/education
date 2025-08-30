// Supabase 클라이언트 설정
class SupabaseClient {
    constructor() {
        // TODO: 실제 Supabase URL과 Key로 교체하세요
        this.supabaseUrl = 'https://cigcharcsgyunqklofmq.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZ2NoYXJjc2d5dW5xa2xvZm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MjQzNTUsImV4cCI6MjA3MjEwMDM1NX0.cZuCw4BrGxyOTQDhNuXfp5ZvEnzz6cOAAPPZJsDXPUk';
        this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
    }

    // 게시물 생성
    async createPost(userName, content) {
        try {
            const { data, error } = await this.supabase
                .from('posting')
                .insert({
                    user_name: userName,
                    content: content
                })
                .select(); // 생성된 데이터 반환

            if (error) {
                throw error;
            }

            console.log('게시물 생성 성공:', data);
            return { success: true, data };
        } catch (error) {
            console.error('게시물 생성 실패:', error);
            return { success: false, error: error.message };
        }
    }

    // 게시물 목록 조회
    async getPosts() {
        try {
            const { data, error } = await this.supabase
                .from('posting')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return { success: true, data };
        } catch (error) {
            console.error('게시물 조회 실패:', error);
            return { success: false, error: error.message };
        }
    }
}

// 전역 인스턴스 생성
const supabaseClient = new SupabaseClient();
