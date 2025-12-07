import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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
  width: 100%;
`;

export const MentorList = ({
  mentorList,
  setMentorList,
}: {
  mentorList: Mentor[];
  setMentorList: React.Dispatch<React.SetStateAction<Mentor[]>>;
}) => {
  // リストの昇順・降順を管理する
  const [isAscending, setIsAscending] = useState<boolean>(false);

  let sortedList!: Mentor[];

  // mentorListの値が変更されたら再レンダリングを促す
  useEffect(() => {
    setMentorList(mentorList);
  }, [mentorList]);

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleExperienceDays = () => {
    if (isAscending === false) {
      sortedList = mentorList.toSorted(
        (a, b) => a.experienceDays - b.experienceDays
      );
      setIsAscending(true);
    } else {
      sortedList = mentorList.toReversed();
      setIsAscending(false);
    }
    setMentorList(sortedList);
  };

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
          {mentorList.map((user) => (
            <tr key={user.id}>
              <th scope="row">{user.id}</th>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>{user.postCode}</td>
              <td>{user.phone}</td>
              <td>{user.hobbies.join('\n')}</td> {/* 配列を改行でつなげる */}
              <td>{user.url}</td>
              <td>{user.experienceDays}</td>
              <td>{user.useLangs.join('\n')}</td> {/* 配列を改行でつなげる */}
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
