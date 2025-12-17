import { useEffect, useState } from 'react';
import { USER_LIST } from '../public/UserData.ts';
import { UserList } from './components/UserList';
import styled from 'styled-components';
import { SignUpModal } from './components/SignUpModal.tsx';
import type { Mentor, Student, User } from './types/types.ts';

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
  const [filteredList, setFilteredList] = useState<User[]>([]);

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
    const withAvailableStudentAndMentor = baseList.map((user) => {
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
    setUserList(withAvailableStudentAndMentor);
    setFilteredList(withAvailableStudentAndMentor);
  }, []);

  // タブの切り替えを管理
  const [tab, setTab] = useState<string>('user');
  const handleUserClick = () => {
    setTab('user');
  };
  const handleStudentClick = () => {
    setTab('student');
    const filteredStudentList = userList.filter(
      (user) => user.role === 'student'
    ) as Student[];
    setFilteredList(filteredStudentList);
  };
  const handleMentorClick = () => {
    setTab('mentor');
    const filteredMentorList = userList.filter(
      (user) => user.role === 'mentor'
    ) as Mentor[];
    setFilteredList(filteredMentorList);
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

      {/* タブ別に表示するユーザー・生徒・メンターのコンポーネント */}
      <UserList
        userList={userList}
        filteredList={filteredList}
        setFilteredList={setFilteredList}
        tab={tab}
      />

      <SignUpModal
        show={showSignUpModal}
        close={closeSignUpModalHandler}
        userList={userList}
        setUserList={setUserList}
        setFilteredList={setFilteredList}
      />
    </BackGround>
  );
}

export default App;
