import { useEffect, useState } from 'react';
import { USER_LIST } from '../public/UserData.ts';
import { UserList } from './components/UserList';
import { StudentList } from './components/StudentList';
import { MentorList } from './components/MentorList';
import styled from 'styled-components';
import { SignUpModal } from './components/SignUpModal.tsx';

// 両方の片方のroleで使われるプロパティはオプショナルにする
type User = {
  id: number;
  name: string;
  role: string;
  email: string;
  age: number;
  postCode: string;
  phone: string;
  hobbies: string[];
  url: string;
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

type Student = {
  id: number;
  name: string;
  role: string;
  email: string;
  age: number;
  postCode: string;
  phone: string;
  hobbies: string[];
  url: string;
  studyMinutes: number;
  taskCode: number;
  studyLangs: string[];
  score: number;
  availableMentor: string[];
};

type Mentor = {
  id: number;
  name: string;
  role: string;
  email: string;
  age: number;
  postCode: string;
  phone: string;
  hobbies: string[];
  url: string;
  experienceDays: number;
  useLangs: string[];
  availableStartCode: number;
  availableEndCode: number;
  availableStudent: string[];
};

const BackGround = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
`;

const TabGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row;
`;

function App() {
  const [userList, setUserList] = useState<User[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [mentorList, setMentorList] = useState<Mentor[]>([]);

  // モーダルの表示を管理する
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const openSignUpModalHandler = () => setShowSignUpModal(true);
  const closeSignUpModalHandler = () => setShowSignUpModal(false);

  useEffect(() => {
    const baseList = USER_LIST as User[];

    // mentorのみのリストであり、型アサーションで型を確定させている
    const mentorList = baseList.filter(
      (mentorLike) => mentorLike.role === 'mentor'
    ) as Mentor[];

    // studentのみのリストであり、型アサーションで型を確定させている
    const studentList = baseList.filter(
      (studentLike) => studentLike.role === 'student'
    ) as Student[];

    // 初期データではavailableMentorとavailableStudentのプロパティが入力されていないので、
    // データから判別して決めてあげる
    const WithAvailableStudentAndMentor = baseList.map((user) => {
      if (user.role === 'student') {
        const student = user as Student;
        const filteredMentor = mentorList.filter(
          (mentor) =>
            mentor.availableStartCode <= student.taskCode &&
            student.taskCode <= mentor.availableEndCode
        );
        return {
          ...student,
          availableMentor: filteredMentor.map((m) => m.name),
        } as Student;
      }

      if (user.role === 'mentor') {
        const mentor = user as Mentor;
        const filteredStudent = studentList.filter(
          (student) =>
            mentor.availableStartCode <= student.taskCode &&
            student.taskCode <= mentor.availableEndCode
        );
        return {
          ...mentor,
          availableStudent: filteredStudent.map((s) => s.name),
        } as Mentor;
      }

      return user;
    });
    setUserList(WithAvailableStudentAndMentor);
    const filteredStudentList = WithAvailableStudentAndMentor.filter(
      (user) => user.role === 'student'
    ) as Student[];
    setStudentList(filteredStudentList);
    const filteredMentorList = WithAvailableStudentAndMentor.filter(
      (user) => user.role === 'mentor'
    ) as Mentor[];
    setMentorList(filteredMentorList);
  }, []);

  // タブの切り替えを管理
  const [tab, setTab] = useState<string>('user');
  const handleUserClick = () => {
    setTab('user');
  };
  const handleStudentClick = () => {
    setTab('student');
  };
  const handleMentorClick = () => {
    setTab('mentor');
  };

  return (
    <BackGround>
      <TabGroup>
        <button onClick={openSignUpModalHandler}>新規登録</button>
        <div
          className="btn-group"
          role="group"
          aria-label="Basic radio toggle button group"
        >
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio1"
            autoComplete="off"
            onClick={handleUserClick}
          />
          <label className="btn btn-outline-primary" htmlFor="btnradio1">
            ユーザー一覧表示
          </label>

          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio2"
            autoComplete="off"
            onClick={handleStudentClick}
          />
          <label className="btn btn-outline-primary" htmlFor="btnradio2">
            生徒一覧
          </label>

          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio3"
            autoComplete="off"
            onClick={handleMentorClick}
          />
          <label className="btn btn-outline-primary" htmlFor="btnradio3">
            メンター一覧
          </label>
        </div>
      </TabGroup>
      {tab === 'user' && <UserList userList={userList} />}
      {tab === 'student' && (
        <StudentList
          studentList={studentList}
          setStudentList={setStudentList}
        />
      )}
      {tab === 'mentor' && (
        <MentorList mentorList={mentorList} setMentorList={setMentorList} />
      )}
      <SignUpModal
        show={showSignUpModal}
        close={closeSignUpModalHandler}
        userList={userList}
        setUserList={setUserList}
        setStudentList={setStudentList}
        setMentorList={setMentorList}
      />
    </BackGround>
  );
}

export default App;
