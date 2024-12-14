
export interface ChannelData {
  title: string;
  viewCount: number;
}
export interface Channel {
  id: string; 
  name: string;
  channelId: string,
  title: string,
  handle:string,
  profile: string,
  description: string ,
  country:  string ,
  owner: string ,
  publishedAt: string,
  subscriberCount: Number,
  viewCount:  number, 
  videoCount:number,
  keywords:string,
  createdAt:  Date,
  updatedAt: Date,
  subs: number,
  views: number,
  videos: number,
  videoMade: number,
  gainedViews: number,
  gainedSub: number,
  topVideos: ChannelData[];
  latestVideos: ChannelData[];
  snapshotUpdatedAt:Date;
}

export interface User {
    id?:string;
    username?: string;
    password?: string;
    role?: string;
    email?: string;
    userData?: Record<string, any>;
    authToken?: string;
    channels?: Channel[];
  credits: number;
  hasChannel: boolean;
  userPlan: string;
  referenceChannels?:Channel[];
  outdatedChannels?:Channel[];
  }
  
  export interface LoginFormProps {
    onLogin: (user: User) => void;
    onRegister: (user: User) => void;
  }

