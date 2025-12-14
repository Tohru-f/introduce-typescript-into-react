import styled from 'styled-components';
import type { Mentor, Student, User } from '../types/types';
import { useState } from 'react';

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

  const filteredStudentList = filteredList as Student[];

  let sortedList!: Student[];

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleStudyMinutesClick = () => {
    if (isAscendingStudyMinutes === false) {
      sortedList = filteredStudentList.toSorted(
        (a, b) => a.studyMinutes - b.studyMinutes
      );
      setIsAscendingStudyMinutes(true);
    } else {
      sortedList = filteredStudentList.toReversed();
      setIsAscendingStudyMinutes(false);
    }
    setFilteredList(sortedList);
  };

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleScoreClick = () => {
    if (isAscendingScore === false) {
      sortedList = filteredStudentList.toSorted((a, b) => a.score - b.score);
      setIsAscendingScore(true);
    } else {
      sortedList = filteredStudentList.toReversed();
      setIsAscendingScore(false);
    }
    setFilteredList(sortedList);
  };

  // リストの昇順・降順を管理する
  const [isAscending, setIsAscending] = useState<boolean>(false);

  const filteredMentorList = filteredList as Mentor[];

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleExperienceDays = () => {
    let sortedList!: Mentor[];
    if (isAscending === false) {
      sortedList = filteredMentorList.toSorted(
        (a, b) => a.experienceDays - b.experienceDays
      );
      setIsAscending(true);
    } else {
      sortedList = filteredMentorList.toReversed();
      setIsAscending(false);
    }
    setFilteredList(sortedList);
  };

  return (
    <BackGround>
      {/* user用のコンポーネント */}
      {tab === 'user' && (
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
              <th scope="col">studyMinutes</th>
              <th scope="col">experienceDays</th>
              <th scope="col">taskCode</th>
              <th scope="col">studyLangs</th>
              <th scope="col">useLangs</th>
              <th scope="col">score</th>
              <th scope="col">availableStartCode</th>
              <th scope="col">availableEndCode</th>
              <th scope="col">availableStudent</th>
              <th scope="col">availableMentor</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
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
                {user.studyMinutes ? <td>{user.studyMinutes}</td> : <td></td>}
                {user.experienceDays ? (
                  <td>{user.experienceDays}</td>
                ) : (
                  <td></td>
                )}
                {user.taskCode ? <td>{user.taskCode}</td> : <td></td>}
                {user.studyLangs ? (
                  <td>{user.studyLangs.join('\n')}</td>
                ) : (
                  <td></td>
                )}
                {user.useLangs ? (
                  <td>{user.useLangs.join('\n')}</td>
                ) : (
                  <td></td>
                )}
                {user.score ? <td>{user.score}</td> : <td></td>}
                {user.availableStartCode ? (
                  <td>{user.availableStartCode}</td>
                ) : (
                  <td></td>
                )}
                {user.availableEndCode ? (
                  <td>{user.availableEndCode}</td>
                ) : (
                  <td></td>
                )}
                {user.availableStudent ? (
                  <td>{user.availableStudent.join('\n')}</td>
                ) : (
                  <td></td>
                )}
                {user.availableMentor ? (
                  <td>{user.availableMentor.join('\n')}</td>
                ) : (
                  <td></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* student用のコンポーネント */}
      {tab === 'student' && (
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
              <th scope="col" onClick={handleStudyMinutesClick}>
                studyMinutes
              </th>
              <th scope="col">taskCode</th>
              <th scope="col">studyLangs</th>
              <th scope="col" onClick={handleScoreClick}>
                score
              </th>
              <th scope="col">availableMentor</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudentList.map((user) => (
              <tr key={user.id}>
                <th scope="row">{user.id}</th>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>{user.postCode}</td>
                <td>{user.phone}</td>
                {/* 配列を改行でつなげる */}
                <td>{user.hobbies.join('\n')}</td>
                <td>{user.url}</td>
                <td>{user.studyMinutes}</td>
                <td>{user.taskCode}</td>
                {/* 配列を改行でつなげる */}
                <td>{user.studyLangs.join('\n')}</td>
                <td>{user.score}</td>
                {/* 配列を改行でつなげる */}
                <td>{user.availableMentor.join('\n')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* mentor用のコンポーネント */}
      {tab === 'mentor' && (
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
              <th scope="col" onClick={handleExperienceDays}>
                experienceDays
              </th>
              <th scope="col">useLangs</th>
              <th scope="col">availableStartCode</th>
              <th scope="col">availableEndCode</th>
              <th scope="col">availableStudent</th>
            </tr>
          </thead>
          <tbody>
            {filteredMentorList.map((user) => (
              <tr key={user.id}>
                <th scope="row">{user.id}</th>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>{user.postCode}</td>
                <td>{user.phone}</td>
                {/* 配列を改行でつなげる */}
                <td>{user.hobbies.join('\n')}</td>
                <td>{user.url}</td>
                <td>{user.experienceDays}</td>
                {/* 配列を改行でつなげる */}
                <td>{user.useLangs.join('\n')}</td>
                <td>{user.availableStartCode}</td>
                <td>{user.availableEndCode}</td>
                {/* 配列を改行でつなげる */}
                <td>{user.availableStudent.join('\n')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </BackGround>
  );
};
