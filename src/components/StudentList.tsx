import React, { useEffect, useState } from 'react';

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

export const StudentList = ({
  studentList,
  setStudentList,
}: {
  studentList: Student[];
  setStudentList: React.Dispatch<React.SetStateAction<Student[]>>;
}) => {
  // studyMinutesの昇順・降順を管理
  const [isAscendingStudyMinutes, setIsAscendingStudyMinutes] =
    useState<boolean>(false);
  // scoreの昇順・降順を管理
  const [isAscendingScore, setIsAscendingScore] = useState<boolean>(false);

  let sortedList!: Student[];

  // studentListが変わったら再レンダリングを促す
  useEffect(() => {
    setStudentList(studentList);
  }, [studentList]);

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleStudyMinutesClick = () => {
    if (isAscendingStudyMinutes === false) {
      sortedList = studentList.toSorted(
        (a, b) => a.studyMinutes - b.studyMinutes
      );
      setIsAscendingStudyMinutes(true);
    } else {
      sortedList = studentList.toReversed();
      setIsAscendingStudyMinutes(false);
    }
    setStudentList(sortedList);
  };

  // 定数sortedListに昇順・降順に並べ直した配列を代入して、set関数に渡すことで再レンダリングを促す
  const handleScoreClick = () => {
    if (isAscendingScore === false) {
      sortedList = studentList.toSorted((a, b) => a.score - b.score);
      setIsAscendingScore(true);
    } else {
      sortedList = studentList.toReversed();
      setIsAscendingScore(false);
    }
    setStudentList(sortedList);
  };

  return (
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
        {studentList.map((user) => (
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
            <td>{user.studyMinutes}</td>
            <td>{user.taskCode}</td>
            <td>{user.studyLangs.join('\n')}</td> {/* 配列を改行でつなげる */}
            <td>{user.score}</td>
            {/* 配列を改行でつなげる */}
            <td>{user.availableMentor.join('\n')}</td>{' '}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
