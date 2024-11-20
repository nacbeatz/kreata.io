

export interface Channel {
  id: string; 
  name: string;
  channelId: String,
  title: String,
  handle:String,
  profile: String,
  description: String ,
  country:  String ,
  owner: String ,
  publishedAt: String,
  subscriberCount: Number,
  viewCount:  Number, 
  videoCount:Number,
  keywords:String,
  createdAt:  Date,
  updatedAt: Date,
}

export interface User {
    username?: string;
    password?: string;
    role?: string;
    userData?: Record<string, any>;
    authToken?: string;
    channels?: Channel[];
  }
  

  export interface LoginFormProps {
    onLogin: (user: User) => void;
    onRegister: (user: User) => void;
  }

