type BaseUser = {
  id: number;
  name: string;
  role: string;
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

// hobbies, useLangs, studyLangsが既存の型と違うので、BaseUserなどは使えない。
export type InputUser = {
  id: number;
  name: string;
  role: string;
  email: string;
  age: number;
  postCode: string;
  phone: string;
  hobbies: string;
  url: string;
  experienceDays: number;
  useLangs: string;
  availableStartCode: number;
  availableEndCode: number;
  availableStudent: string[];
  studyMinutes: number;
  taskCode: number;
  studyLangs: string;
  score: number;
  availableMentor: string[];
};
