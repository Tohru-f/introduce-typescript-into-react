type BaseUser = {
  id: number;
  name: string;
  role: 'student' | 'mentor';
  email: string;
  age: number;
  postCode: string;
  phone: string;
  hobbies: string[];
  url: string;
};

type StudentPart = {
  studyMinutes: number;
  taskCode: number;
  studyLangs: string[];
  score: number;
  availableMentor: string[];
};

type MentorPart = {
  experienceDays: number;
  useLangs: string[];
  availableStartCode: number;
  availableEndCode: number;
  availableStudent: string[];
};

export type Mentor = BaseUser & MentorPart;

export type Student = BaseUser & StudentPart;

// 両方の片方のroleで使われるプロパティはオプショナルにする
export type UserPart = {
  studyMinutes?: number;
  experienceDays?: number;
  taskCode?: number;
  studyLangs?: string[];
  useLangs?: string[];
  score?: number;
  availableStartCode?: number;
  availableEndCode?: number;
  availableStudent?: string[];
  availableMentor?: string[];
};

export type User = BaseUser & UserPart;
