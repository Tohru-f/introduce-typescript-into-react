import styled from 'styled-components';
import type { Mentor, Student, User } from '../types/types';
import React, { useState } from 'react';

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

  let sortedList!: Student[];

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleStudyMinutesClick = () => {
    if (tab !== 'student') {
      return;
    }
    if (isAscendingStudyMinutes === false) {
      sortedList = (filteredList as Student[]).toSorted(
        (a, b) => a.studyMinutes - b.studyMinutes
      );
      setIsAscendingStudyMinutes(true);
    } else {
      sortedList = (filteredList as Student[]).toReversed();
      setIsAscendingStudyMinutes(false);
    }
    setFilteredList(sortedList);
  };

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleScoreClick = () => {
    if (tab !== 'student') {
      return;
    }
    if (isAscendingScore === false) {
      sortedList = (filteredList as Student[]).toSorted(
        (a, b) => a.score - b.score
      );
      setIsAscendingScore(true);
    } else {
      sortedList = (filteredList as Student[]).toReversed();
      setIsAscendingScore(false);
    }
    setFilteredList(sortedList);
  };

  // リストの昇順・降順を管理する
  const [isAscending, setIsAscending] = useState<boolean>(false);

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleExperienceDays = () => {
    if (tab !== 'mentor') {
      return;
    }
    let sortedList!: Mentor[];
    if (isAscending === false) {
      sortedList = (filteredList as Mentor[]).toSorted(
        (a, b) => a.experienceDays - b.experienceDays
      );
      setIsAscending(true);
    } else {
      sortedList = (filteredList as Mentor[]).toReversed();
      setIsAscending(false);
    }
    setFilteredList(sortedList);
  };

  return (
    <BackGround>
      <table className="table">
        <thead>
          <tr>
            {/* user用のコンポーネント */}
            {tab === 'user' && (
              <>
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
              </>
            )}
            {/* student用のコンポーネント */}
            {tab === 'student' && (
              <>
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
              </>
            )}
            {/* mentor用のコンポーネント */}
            {tab === 'mentor' && (
              <>
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
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {tab === 'user' &&
            userList.map((user) => (
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
                {'studyMinutes' in user ? (
                  <td>{user.studyMinutes}</td>
                ) : (
                  <td></td>
                )}
                {'experienceDays' in user ? (
                  <td>{user.experienceDays}</td>
                ) : (
                  <td></td>
                )}
                {'taskCode' in user ? <td>{user.taskCode}</td> : <td></td>}
                {'studyLangs' in user ? (
                  <td>{user.studyLangs.join('\n')}</td>
                ) : (
                  <td></td>
                )}
                {'useLangs' in user ? (
                  <td>{user.useLangs.join('\n')}</td>
                ) : (
                  <td></td>
                )}
                {'score' in user ? <td>{user.score}</td> : <td></td>}
                {'availableStartCode' in user ? (
                  <td>{user.availableStartCode}</td>
                ) : (
                  <td></td>
                )}
                {'availableEndCode' in user ? (
                  <td>{user.availableEndCode}</td>
                ) : (
                  <td></td>
                )}
                {'availableStudent' in user ? (
                  <td>{user.availableStudent.join('\n')}</td>
                ) : (
                  <td></td>
                )}
                {'availableMentor' in user ? (
                  <td>{user.availableMentor.join('\n')}</td>
                ) : (
                  <td></td>
                )}
              </tr>
            ))}
          {tab === 'student' &&
            (filteredList as Student[]).map((user) => (
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
          {tab === 'mentor' &&
            (filteredList as Mentor[]).map((user) => (
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
    </BackGround>
  );
};
