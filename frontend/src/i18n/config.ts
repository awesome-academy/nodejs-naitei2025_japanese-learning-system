import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


const resources = {
  en: {
    translation: {
      // Common
      common: {
        appName: 'JLPT',
        welcome: 'Welcome',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back',
        next: 'Next',
        submit: 'Submit',
        close: 'Close',
        completed: 'Completed',
      },
      
      // Auth
      auth: {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        fullName: 'Full Name',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password?',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
        resetPassword: 'Reset Password',
        sendResetLink: 'Send Reset Link',
        backToLogin: 'Back to Login',
        invalidEmail: 'Please enter a valid email address',
        passwordTooShort: 'Password must be at least 6 characters',
        fullNameRequired: 'Please enter your full name',
        passwordMismatch: 'Passwords do not match',
        resetLinkSent: 'Password reset link sent to {{email}}',
        resetPasswordDesc: "Enter your email address and we'll send you a link to reset your password.",
        registerSuccess: 'Registration successful!',
        loginSuccess: 'Login successful!',
      },
      
      // Landing
      landing: {
        title: 'JLPT Master',
        subtitle: 'Master Japanese Language Proficiency Test',
        description: 'Practice JLPT tests with realistic questions, instant feedback, and progress tracking.',
        start: 'Start Now',
        features: {
          practice: 'Practice Tests',
          practiceDesc: 'Full-length JLPT tests for all levels',
          tracking: 'Progress Tracking',
          trackingDesc: 'Monitor your improvement over time',
          feedback: 'Instant Feedback',
          feedbackDesc: 'Get detailed explanations for every answer',
        },
      },
      
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        tests: 'Tests',
        history: 'History',
        profile: 'Profile',
        settings: 'Settings',
      },
      
      // Settings
      settings: {
        darkMode: 'Dark Mode',
        language: 'Language',
        theme: 'Theme',
      },
   
    },
  },
  
  ja: {
    translation: {
      common: {
        appName: 'JLPT',
        welcome: 'ようこそ',
        loading: '読み込み中...',
        error: 'エラー',
        success: '成功',
        cancel: 'キャンセル',
        confirm: '確認',
        save: '保存',
        delete: '削除',
        edit: '編集',
        back: '戻る',
        next: '次へ',
        submit: '送信',
        close: '閉じる',
        completed: '完了',
      },
      
      auth: {
        login: 'ログイン',
        register: '新規登録',
        logout: 'ログアウト',
        email: 'メールアドレス',
        password: 'パスワード',
        fullName: '氏名',
        confirmPassword: 'パスワード確認',
        forgotPassword: 'パスワードをお忘れですか？',
        dontHaveAccount: 'アカウントをお持ちでないですか？',
        alreadyHaveAccount: '既にアカウントをお持ちですか？',
        resetPassword: 'パスワードリセット',
        sendResetLink: 'リセットリンクを送信',
        backToLogin: 'ログインに戻る',
        invalidEmail: '有効なメールアドレスを入力してください',
        passwordTooShort: 'パスワードは6文字以上である必要があります',
        fullNameRequired: '氏名を入力してください',
        passwordMismatch: 'パスワードが一致しません',
        resetLinkSent: '{{email}}にパスワードリセットリンクを送信しました',
        resetPasswordDesc: 'メールアドレスを入力してください。パスワードリセットリンクを送信します。',
        registerSuccess: '登録が完了しました！',
        loginSuccess: 'ログインに成功しました！',
      },
      
      landing: {
        title: 'JLPT練習',
        subtitle: '日本語能力試験をマスターしよう',
        description: '実際の問題で練習し、即座のフィードバックと進捗追跡で上達しましょう。',
        start: '今すぐ始める',
        features: {
          practice: '練習テスト',
          practiceDesc: '全レベルの完全なJLPTテスト',
          tracking: '進捗追跡',
          trackingDesc: '時間をかけて上達を確認',
          feedback: '即座のフィードバック',
          feedbackDesc: 'すべての解答に詳しい説明',
        },
      },
      
      nav: {
        dashboard: 'ダッシュボード',
        tests: 'テスト',
        history: '履歴',
        profile: 'プロフィール',
        settings: '設定',
      },
      
      settings: {
        darkMode: 'ダークモード',
        language: '言語',
        theme: 'テーマ',
      },          
    },
  },
  
  vi: {
    translation: {
      common: {
        appName: 'JLPT',
        welcome: 'Chào mừng',
        loading: 'Đang tải...',
        error: 'Lỗi',
        success: 'Thành công',
        cancel: 'Hủy',
        confirm: 'Xác nhận',
        save: 'Lưu',
        delete: 'Xóa',
        edit: 'Chỉnh sửa',
        back: 'Quay lại',
        next: 'Tiếp theo',
        submit: 'Gửi',
        close: 'Đóng',
        completed: 'Hoàn thành',
      },
      
      auth: {
        login: 'Đăng nhập',
        register: 'Đăng ký',
        logout: 'Đăng xuất',
        email: 'Email',
        password: 'Mật khẩu',
        fullName: 'Họ và tên',
        confirmPassword: 'Xác nhận mật khẩu',
        forgotPassword: 'Quên mật khẩu?',
        dontHaveAccount: 'Chưa có tài khoản?',
        alreadyHaveAccount: 'Đã có tài khoản?',
        resetPassword: 'Đặt lại mật khẩu',
        sendResetLink: 'Gửi liên kết đặt lại',
        backToLogin: 'Quay lại đăng nhập',
        invalidEmail: 'Vui lòng nhập địa chỉ email hợp lệ',
        passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự',
        fullNameRequired: 'Vui lòng nhập họ tên của bạn',
        passwordMismatch: 'Mật khẩu không khớp',
        resetLinkSent: 'Đã gửi liên kết đặt lại mật khẩu đến {{email}}',
        resetPasswordDesc: 'Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.',
        registerSuccess: 'Đăng ký thành công!',
        loginSuccess: 'Đăng nhập thành công!',
      },
      
      landing: {
        title: 'Luyện thi JLPT',
        subtitle: 'Làm chủ kỳ thi năng lực tiếng Nhật',
        description: 'Luyện tập với các đề thi JLPT thực tế, nhận phản hồi ngay lập tức và theo dõi tiến độ.',
        start: 'Bắt đầu ngay',
        features: {
          practice: 'Đề thi luyện tập',
          practiceDesc: 'Đề thi JLPT đầy đủ cho mọi cấp độ',
          tracking: 'Theo dõi tiến độ',
          trackingDesc: 'Giám sát sự tiến bộ của bạn theo thời gian',
          feedback: 'Phản hồi ngay lập tức',
          feedbackDesc: 'Giải thích chi tiết cho mọi câu trả lời',
        },
      },
      
      nav: {
        dashboard: 'Bảng điều khiển',
        tests: 'Bài kiểm tra',
        history: 'Lịch sử',
        profile: 'Hồ sơ',
        settings: 'Cài đặt',
      },
      
      settings: {
        darkMode: 'Chế độ tối',
        language: 'Ngôn ngữ',
        theme: 'Giao diện',
      },
      
    
    },
  },
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('jlpt-language') || 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
  });

// Save language preference on change
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('jlpt-language', lng);
});

export default i18n;
