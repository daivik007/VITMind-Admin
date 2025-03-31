
export interface Counselor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  avatarUrl: string;
  status: 'active' | 'inactive';
  chatCount: number;
}

export interface Chat {
  id: string;
  userId: string;
  counselorId: string | null;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  isEmergency: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'counselor' | 'ai';
  timestamp: string;
  isEmergency?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  type: 'article' | 'video' | 'audio' | 'pdf';
}

export interface EmergencyKeywords {
  [key: string]: string[];
}
