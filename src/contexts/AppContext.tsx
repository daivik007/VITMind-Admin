
import React, { createContext, useContext, useState, useEffect } from "react";
import { Counselor, Chat, Resource, EmergencyKeywords } from "@/types";

// Sample data - in a real app this would come from a database
const initialCounselors: Counselor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    bio: "Licensed therapist with 15 years of experience in cognitive behavioral therapy.",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "active",
    chatCount: 24,
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Trauma Recovery",
    bio: "Specializes in PTSD and trauma recovery with a focus on mindfulness techniques.",
    avatarUrl: "https://randomuser.me/api/portraits/men/46.jpg",
    status: "active",
    chatCount: 18,
  },
  {
    id: "3",
    name: "Lisa Patel, LCSW",
    specialty: "Family Therapy",
    bio: "Family therapist helping improve communication and resolve conflicts.",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    status: "inactive",
    chatCount: 12,
  },
];

const initialResources: Resource[] = [
  {
    id: "1",
    title: "Understanding Anxiety",
    description: "A comprehensive guide to identifying and managing anxiety symptoms.",
    category: "Mental Health",
    link: "https://example.com/anxiety-guide",
    type: "article",
  },
  {
    id: "2",
    title: "Mindfulness Meditation",
    description: "10-minute guided meditation for stress reduction.",
    category: "Wellness",
    link: "https://example.com/mindfulness",
    type: "audio",
  },
  {
    id: "3",
    title: "Coping with Depression",
    description: "Evidence-based strategies for managing depression symptoms.",
    category: "Mental Health",
    link: "https://example.com/depression-coping",
    type: "pdf",
  },
];

const initialChats: Chat[] = [
  {
    id: "1",
    userId: "user1",
    counselorId: "1",
    messages: [
      {
        id: "m1",
        content: "I've been feeling really anxious lately.",
        sender: "user",
        timestamp: "2023-06-15T14:30:00Z",
      },
      {
        id: "m2",
        content: "I'm sorry to hear that. Could you tell me more about when you notice this anxiety?",
        sender: "counselor",
        timestamp: "2023-06-15T14:32:00Z",
      },
    ],
    createdAt: "2023-06-15T14:30:00Z",
    updatedAt: "2023-06-15T14:32:00Z",
    isEmergency: false,
  },
  {
    id: "2",
    userId: "user2",
    counselorId: "2",
    messages: [
      {
        id: "m3",
        content: "I don't know if I can continue like this. I don't want to live anymore.",
        sender: "user",
        timestamp: "2023-06-16T09:15:00Z",
        isEmergency: true,
      },
      {
        id: "m4",
        content: "I'm very concerned about what you're sharing. Your life matters and I want to help. Can we talk about what's going on right now?",
        sender: "counselor",
        timestamp: "2023-06-16T09:16:00Z",
      },
    ],
    createdAt: "2023-06-16T09:15:00Z",
    updatedAt: "2023-06-16T09:16:00Z",
    isEmergency: true,
  },
];

// Keywords for emergency detection
const emergencyKeywords: EmergencyKeywords = {
  "suicide": ["kill myself", "end my life", "suicide", "don't want to live", "better off dead"],
  "self-harm": ["cut myself", "hurt myself", "self-harm", "harming myself"],
  "violence": ["hurt someone", "kill someone", "attack", "violent thoughts"],
  "abuse": ["being abused", "abusing me", "hit me", "hurting me"],
};

interface AppContextType {
  counselors: Counselor[];
  addCounselor: (counselor: Omit<Counselor, "id" | "chatCount">) => void;
  updateCounselor: (id: string, updates: Partial<Counselor>) => void;
  deleteCounselor: (id: string) => void;
  
  resources: Resource[];
  addResource: (resource: Omit<Resource, "id">) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  
  chats: Chat[];
  emergencyChats: Chat[];
  checkForEmergency: (text: string) => boolean;
  
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [counselors, setCounselors] = useState<Counselor[]>(initialCounselors);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Filtered emergency chats
  const emergencyChats = chats.filter(chat => chat.isEmergency);

  // Check for emergency keywords in text
  const checkForEmergency = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    
    for (const category in emergencyKeywords) {
      for (const keyword of emergencyKeywords[category]) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Counselor CRUD operations
  const addCounselor = (counselor: Omit<Counselor, "id" | "chatCount">) => {
    const newCounselor: Counselor = {
      ...counselor,
      id: Date.now().toString(),
      chatCount: 0,
    };
    setCounselors([...counselors, newCounselor]);
  };
  
  const updateCounselor = (id: string, updates: Partial<Counselor>) => {
    setCounselors(
      counselors.map((counselor) =>
        counselor.id === id ? { ...counselor, ...updates } : counselor
      )
    );
  };
  
  const deleteCounselor = (id: string) => {
    setCounselors(counselors.filter((counselor) => counselor.id !== id));
  };
  
  // Resource CRUD operations
  const addResource = (resource: Omit<Resource, "id">) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
    };
    setResources([...resources, newResource]);
  };
  
  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources(
      resources.map((resource) =>
        resource.id === id ? { ...resource, ...updates } : resource
      )
    );
  };
  
  const deleteResource = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };
  
  // Auth operations
  const login = () => {
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        counselors,
        addCounselor,
        updateCounselor,
        deleteCounselor,
        resources,
        addResource,
        updateResource,
        deleteResource,
        chats,
        emergencyChats,
        checkForEmergency,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
