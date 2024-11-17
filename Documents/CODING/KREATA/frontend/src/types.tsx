export interface User {
    username?: string;
    password?: string;
    role?: string;
    userData?: Record<string, any>;
    authToken?: string;
  }
  

  export interface LoginFormProps {
    onLogin: (user: User) => void;
    onRegister: (user: User) => void;
  }

