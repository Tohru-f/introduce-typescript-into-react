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

export type Mentor = BaseUser & {
  experienceDays: number;
  useLangs: string[];
  availableStartCode: number;
  availableEndCode: number;
  availableStudent: string[];
};

export type Student = BaseUser & {
  studyMinutes: number;
  taskCode: number;
  studyLangs: string[];
  score: number;
  availableMentor: string[];
};

export type User = Student | Mentor;
