import styled from 'styled-components';
import type { Mentor, Student, User } from '../types/types';
import React, { useEffect, useState } from 'react';

const BackGround = styled.div`
  width: 100%;
`;

export const UserList = ({
  userList,
  filteredList,
  setFilteredList,
  tab,
}: {
  userList: User[];
  filteredList: User[];
  setFilteredList: React.Dispatch<React.SetStateAction<User[]>>;
  tab: string;
}) => {
  // studyMinutesの昇順・降順を管理
  const [isAscendingStudyMinutes, setIsAscendingStudyMinutes] =
    useState<boolean>(false);
  // scoreの昇順・降順を管理
  const [isAscendingScore, setIsAscendingScore] = useState<boolean>(false);

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleSortStudyMinutes = () => {
    if (tab !== 'student') {
      return;
    }
    if (isAscendingStudyMinutes === false) {
      setFilteredList((prev) =>
        (prev as Student[]).toSorted((a, b) => a.studyMinutes - b.studyMinutes)
      );
      setIsAscendingStudyMinutes(true);
    } else {
      setFilteredList((prev) => (prev as Student[]).toReversed());
      setIsAscendingStudyMinutes(false);
    }
  };

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleSortScore = () => {
    if (tab !== 'student') {
      return;
    }
    if (isAscendingScore === false) {
      setFilteredList((prev) =>
        (prev as Student[]).toSorted((a, b) => a.score - b.score)
      );
      setIsAscendingScore(true);
    } else {
      setFilteredList((prev) => (prev as Student[]).toReversed());
      setIsAscendingScore(false);
    }
  };

  // リストの昇順・降順を管理する
  const [isAscending, setIsAscending] = useState<boolean>(false);

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleSortExperienceDays = () => {
    if (tab !== 'mentor') {
      return;
    }
    if (isAscending === false) {
      setFilteredList((prev) =>
        (prev as Mentor[]).toSorted(
          (a, b) => a.experienceDays - b.experienceDays
        )
      );
      setIsAscending(true);
    } else {
      setFilteredList((prev) => (prev as Mentor[]).toReversed());
      setIsAscending(false);
    }
  };

  // K extends keyof Userでは共通プロパティのBaseUserだけを対象としてしまうので、
  // StudentとMentorの両方のプロパティを持つ型を作る
  type UserKeys = keyof Student | keyof Mentor;

  const renderOptionalCell = <K extends UserKeys>(
    user: User,
    key: K,
    render: () => React.ReactNode, // Reactで表示可能な値を返す
    tab: string
  ) => {
    if (key in user) {
      return <td>{render()}</td>;
    }
    return tab === 'user' ? <td></td> : null;
  };

  const STUDENT_OR_USER = tab === 'user' || tab === 'student';

  const MENTOR_OR_USER = tab === 'user' || tab === 'mentor';

  useEffect(() => {
    // mentorのみのリストであり、型アサーションで型を確定させている
    const mentorList = userList.filter(
      (mentorLike) => mentorLike.role === 'mentor'
    ) as Mentor[];

    // studentのみのリストであり、型アサーションで型を確定させている
    const studentList = userList.filter(
      (studentLike) => studentLike.role === 'student'
    ) as Student[];

    // 初期データではavailableMentorとavailableStudentのプロパティが入力されていないので、
    // データから判別して決めてあげる
    userList.map((user) => {
      if (user.role === 'student') {
        const student = user as Student;
        const filteredMentor = mentorList.filter(
          (mentor) =>
            mentor.availableStartCode <= student.taskCode &&
            student.taskCode <= mentor.availableEndCode
        );
        student.availableMentor = filteredMentor.map((m) => m.name);
      }

      if (user.role === 'mentor') {
        const mentor = user as Mentor;
        const filteredStudent = studentList.filter(
          (student) =>
            mentor.availableStartCode <= student.taskCode &&
            student.taskCode <= mentor.availableEndCode
        );
        mentor.availableStudent = filteredStudent.map((s) => s.name);
      }
    });
  }, [userList]);

  return (
    <BackGround>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">name</th>
            <th scope="col">role</th>
            <th scope="col">email</th>
            <th scope="col">age</th>
            <th scope="col">postCode</th>
            <th scope="col">phone</th>
            <th scope="col">hobbies</th>
            <th scope="col">url</th>
            {STUDENT_OR_USER && (
              <th scope="col" onClick={handleSortStudyMinutes}>
                studyMinutes
              </th>
            )}
            {MENTOR_OR_USER && (
              <th scope="col" onClick={handleSortExperienceDays}>
                experienceDays
              </th>
            )}
            {STUDENT_OR_USER && <th scope="col">taskCode</th>}
            {STUDENT_OR_USER && <th scope="col">studyLangs</th>}
            {MENTOR_OR_USER && <th scope="col">useLangs</th>}
            {STUDENT_OR_USER && (
              <th scope="col" onClick={handleSortScore}>
                score
              </th>
            )}
            {MENTOR_OR_USER && <th scope="col">availableStartCode</th>}
            {MENTOR_OR_USER && <th scope="col">availableEndCode</th>}
            {MENTOR_OR_USER && <th scope="col">availableStudent</th>}
            {STUDENT_OR_USER && <th scope="col">availableMentor</th>}
          </tr>
        </thead>
        <tbody>
          {filteredList.map((user) => (
            <tr key={user.id}>
              <th scope="row">{user.id}</th>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>{user.postCode}</td>
              <td>{user.phone}</td>
              <td>{user.hobbies.join('\n')}</td>
              <td>{user.url}</td>
              {/* roleによって存在しないプロパティは三項演算子で分岐させる */}
              {renderOptionalCell(
                user,
                'studyMinutes',
                () => ('studyMinutes' in user ? user.studyMinutes : ''),
                tab
              )}
              {renderOptionalCell(
                user,
                'experienceDays',
                () => ('experienceDays' in user ? user.experienceDays : ''),
                tab
              )}
              {renderOptionalCell(
                user,
                'taskCode',
                () => ('taskCode' in user ? user.taskCode : ''),
                tab
              )}
              {renderOptionalCell(
                user,
                'studyLangs',
                () => ('studyLangs' in user ? user.studyLangs.join('\n') : ''),
                tab
              )}
              {renderOptionalCell(
                user,
                'useLangs',
                () => ('useLangs' in user ? user.useLangs.join('\n') : ''),
                tab
              )}
              {renderOptionalCell(
                user,
                'score',
                () => ('score' in user ? user.score : ''),
                tab
              )}
              {renderOptionalCell(
                user,
                'availableStartCode',
                () =>
                  'availableStartCode' in user ? user.availableStartCode : '',
                tab
              )}
              {renderOptionalCell(
                user,
                'availableEndCode',
                () => ('availableEndCode' in user ? user.availableEndCode : ''),
                tab
              )}
              {renderOptionalCell(
                user,
                'availableStudent',
                () =>
                  'availableStudent' in user
                    ? user.availableStudent.join('\n')
                    : '',
                tab
              )}
              {renderOptionalCell(
                user,
                'availableMentor',
                () =>
                  'availableMentor' in user
                    ? user.availableMentor.join('\n')
                    : '',
                tab
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </BackGround>
  );
};
