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

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleStudyMinutesClick = () => {
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
  const handleScoreClick = () => {
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
  const handleExperienceDays = () => {
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

  // 表示部分を管理するコンポーネント
  const UserRow = ({ user }: { user: User }) => (
    <tr>
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
        tab === 'user' && <td></td>
      )}
      {'experienceDays' in user ? (
        <td>{user.experienceDays}</td>
      ) : (
        tab === 'user' && <td></td>
      )}
      {'taskCode' in user ? (
        <td>{user.taskCode}</td>
      ) : (
        tab === 'user' && <td></td>
      )}
      {/* 配列を改行でつなげる */}
      {'studyLangs' in user ? (
        <td>{user.studyLangs.join('\n')}</td>
      ) : (
        tab === 'user' && <td></td>
      )}
      {/* 配列を改行でつなげる */}
      {'useLangs' in user ? (
        <td>{user.useLangs.join('\n')}</td>
      ) : (
        tab === 'user' && <td></td>
      )}
      {'score' in user ? <td>{user.score}</td> : tab === 'user' && <td></td>}
      {'availableStartCode' in user ? (
        <td>{user.availableStartCode}</td>
      ) : (
        tab === 'user' && <td></td>
      )}
      {'availableEndCode' in user ? (
        <td>{user.availableEndCode}</td>
      ) : (
        tab === 'user' && <td></td>
      )}
      {/* 配列を改行でつなげる */}
      {'availableStudent' in user ? (
        <td>{user.availableStudent.join('\n')}</td>
      ) : (
        tab === 'user' && <td></td>
      )}
      {/* 配列を改行でつなげる */}
      {'availableMentor' in user ? (
        <td>{user.availableMentor.join('\n')}</td>
      ) : (
        tab === 'user' && <td></td>
      )}
    </tr>
  );

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
            {(tab === 'user' || tab === 'student') && (
              <th scope="col" onClick={handleStudyMinutesClick}>
                studyMinutes
              </th>
            )}
            {(tab === 'user' || tab === 'mentor') && (
              <th scope="col" onClick={handleExperienceDays}>
                experienceDays
              </th>
            )}
            {(tab === 'user' || tab === 'student') && (
              <th scope="col">taskCode</th>
            )}
            {(tab === 'user' || tab === 'student') && (
              <th scope="col">studyLangs</th>
            )}
            {(tab === 'user' || tab === 'mentor') && (
              <th scope="col">useLangs</th>
            )}
            {(tab === 'user' || tab === 'student') && (
              <th scope="col" onClick={handleScoreClick}>
                score
              </th>
            )}
            {(tab === 'user' || tab === 'mentor') && (
              <th scope="col">availableStartCode</th>
            )}
            {(tab === 'user' || tab === 'mentor') && (
              <th scope="col">availableEndCode</th>
            )}
            {(tab === 'user' || tab === 'mentor') && (
              <th scope="col">availableStudent</th>
            )}
            {(tab === 'user' || tab === 'student') && (
              <th scope="col">availableMentor</th>
            )}
          </tr>
        </thead>
        <tbody>
          {tab === 'user' &&
            userList.map((user) => <UserRow user={user} key={user.id} />)}
          {(tab === 'student' || tab === 'mentor') &&
            (filteredList as Student[]).map((user) => (
              <UserRow user={user} key={user.id} />
            ))}
        </tbody>
      </table>
    </BackGround>
  );
};
