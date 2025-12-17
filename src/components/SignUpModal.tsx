import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { USER_LIST } from '../../public/UserData';
import type { Mentor, Student, User } from '../types/types';

const Modal = styled.div`
  position: fixed;
  z-index: 1001;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: black;
  padding: 2rem;
  border-radius: 15px;
  min-width: 600px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
`;

const Overlay = styled.div`
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(91, 112, 131, 0.4);
`;

const Label = styled.label`
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const TypeButton = styled.button`
  background-color: white;
  color: black;
  border-radius: 10px;
`;

export const SignUpModal = ({
  show,
  close,
  userList,
  setUserList,
  setFilteredList,
}: {
  show: boolean;
  // クリックとキーボードの両方で使用するため、両方受けられるこの方にしている。
  // eventを設けてKeyboardEventとReact.MouseEvent<HTMLDivElement, MouseEvent>を使用したが、
  // 一方が他方を受け入れない状態になるので、eventの使用を中断した。
  close: () => void;
  userList: User[];
  setUserList: React.Dispatch<React.SetStateAction<User[]>>;
  setFilteredList: React.Dispatch<React.SetStateAction<User[]>>;
}) => {
  // student, mentorの両方でhobbiesを管理するために別途作成。他のプロパティと同様に直接set関数で受け取ると
  // splitメソッドが意図した通りに機能しないので、userListに登録する直前まではこれらのstate変数で管理する
  const [hobbiesInput, setHobbiesInput] = useState<string>(''); //student, mentorの両方で使用
  const [studyLangsInput, setStudyLangsInput] = useState<string>(''); // studentで使用
  const [useLangsInput, setUseLangsInput] = useState<string>(''); // mentorで使用

  // student・mentorの入力内容を管理する
  // 初期値においてrole部分は型が決まれば一緒に決まるので、リテラル型で固定する。roleはstudentをベース値とする。
  const [inputUser, setInputUser] = useState<User>({
    id: 0,
    name: '',
    role: 'student',
    email: '',
    age: 0,
    postCode: '',
    phone: '',
    hobbies: [hobbiesInput],
    url: '',
    studyMinutes: 0,
    taskCode: 0,
    studyLangs: [studyLangsInput],
    score: 0,
    availableMentor: [],
    experienceDays: 0,
    useLangs: [useLangsInput],
    availableStartCode: 0,
    availableEndCode: 0,
    availableStudent: [],
  });

  //モーダルをstudentとmentorで分岐させるために使用
  const [modalType, setModalType] = useState<string>('');

  // 大元のリストデータ
  const baseList = USER_LIST as User[];

  const mentorList = baseList.filter(
    (mentorLike) => mentorLike.role === 'mentor'
  ) as Mentor[];

  // リストからidだけの配列を取り出し、一番大きい値のidをベースにidが重複しないようにインクリメントして付与する
  const idList: number[] = baseList.map((user) => user.id);
  const maxId = Math.max(...idList) + 1;
  const [designatedId, setDesignatedId] = useState<number>(maxId);

  const handleStudentRegistration = () => {
    const studentInput = inputUser as Student;
    // 入力されたtaskCodeに対応できるmentorのリストを作成する
    const availableMentor: Mentor[] = mentorList.filter(
      (mentor) =>
        mentor.availableStartCode <= studentInput.taskCode &&
        studentInput.taskCode <= mentor.availableEndCode
    );
    // 対応可能なメンターの配列から前だけを取り出す
    const availableMentorsName: string[] = availableMentor.map(
      (mentor) => mentor.name
    );

    // set関数で新しく登録するためのstudentデータを定数のオブジェクトで生成する。
    // split, map, filterの部分はそれぞれをstate変数として管理している特定のプロパティをカンマで区切った配列に切り替える
    const nextStudent: Student = {
      ...studentInput,
      id: designatedId,
      hobbies: hobbiesInput
        .split(',')
        .map((hobby) => hobby.trim())
        .filter((hobby) => hobby !== ''),
      studyLangs: studyLangsInput
        .split(',')
        .map((hobby) => hobby.trim())
        .filter((hobby) => hobby !== ''),
      availableMentor: availableMentorsName,
    };
    setInputUser(nextStudent);
    // set関数の更新にはstate変数ではなく、定数のオブジェクトを使う。state変数は同じ処理内で使っても再レンダリング後で
    // なければ値の更新がされないので、set関数の引数には適さない
    const addedUserList = [...userList, nextStudent];
    setUserList(addedUserList);
    // 生徒・メンター用のデータも反映されるように更新する
    setFilteredList(addedUserList);
    close();
    // 新規登録が終わったらそれぞれの入力内容はデフォルトに戻して、idのstate変数は次に備えてインクリメントする
    setHobbiesInput('');
    setStudyLangsInput('');
    setInputUser({
      id: 0,
      name: '',
      role: 'student',
      email: '',
      age: 0,
      postCode: '',
      phone: '',
      hobbies: [hobbiesInput],
      url: '',
      studyMinutes: 0,
      taskCode: 0,
      studyLangs: [studyLangsInput],
      score: 0,
      availableMentor: [],
      experienceDays: 0,
      useLangs: [useLangsInput],
      availableStartCode: 0,
      availableEndCode: 0,
      availableStudent: [],
    });
    setModalType('');
    setDesignatedId(designatedId + 1);
  };

  const studentList = baseList.filter(
    (studentLike) => studentLike.role === 'student'
  ) as Student[];

  const handleMentorRegistration = () => {
    const mentorInput = inputUser as Mentor;
    const availableStudent: Student[] = studentList.filter(
      (student) =>
        mentorInput.availableStartCode <= student.taskCode &&
        student.taskCode <= mentorInput.availableEndCode
    );
    const availableStudentName: string[] = availableStudent.map(
      (student) => student.name
    );
    const nextMentor: Mentor = {
      ...mentorInput,
      id: designatedId,
      role: 'mentor',
      hobbies: hobbiesInput
        .split(',')
        .map((hobby) => hobby.trim())
        .filter((hobby) => hobby !== ''),
      useLangs: useLangsInput
        .split(',')
        .map((hobby) => hobby.trim())
        .filter((hobby) => hobby !== ''),
      availableStudent: availableStudentName,
    };
    setInputUser(nextMentor);
    const addedUserList = [...userList, nextMentor];
    setUserList(addedUserList);
    // 生徒・メンター用のリストも同時に更新する
    setFilteredList(addedUserList);
    close();
    setHobbiesInput('');
    setUseLangsInput('');
    setInputUser({
      id: 0,
      name: '',
      role: 'student',
      email: '',
      age: 0,
      postCode: '',
      phone: '',
      hobbies: [hobbiesInput],
      url: '',
      studyMinutes: 0,
      taskCode: 0,
      studyLangs: [studyLangsInput],
      score: 0,
      availableMentor: [],
      experienceDays: 0,
      useLangs: [useLangsInput],
      availableStartCode: 0,
      availableEndCode: 0,
      availableStudent: [],
    });
    setModalType('');
    setDesignatedId(designatedId + 1);
  };

  // 入力内容を受け取って、state変数を逐次更新する
  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputUser({
      ...inputUser,
      [name]: value,
    });
  };

  // HTMLタグを作るコンポーネントの中ではif文が使えないので、書き出して挿入する
  const selectModalType = () => {
    if (modalType === 'student') {
      return (
        <Modal>
          <Label>id</Label>
          <input
            placeholder="id"
            name="id"
            value={inputUser.id}
            onChange={handleUserChange}
          />
          <Label>name</Label>
          <input
            placeholder="name"
            name="name"
            value={inputUser.name}
            onChange={handleUserChange}
          />
          <Label>role</Label>
          <input
            placeholder="role"
            name="role"
            value="student"
            onChange={handleUserChange}
          />
          <Label>email</Label>
          <input
            placeholder="email"
            name="email"
            value={inputUser.email}
            onChange={handleUserChange}
          />
          <Label>age</Label>
          <input
            placeholder="age"
            name="age"
            value={inputUser.age}
            onChange={handleUserChange}
          />
          <Label>postCode</Label>
          <input
            placeholder="postCode"
            name="postCode"
            value={inputUser.postCode}
            onChange={handleUserChange}
          />
          <Label>phone</Label>
          <input
            placeholder="phone"
            name="phone"
            value={inputUser.phone}
            onChange={handleUserChange}
          />
          <Label>hobbies</Label>
          <input
            placeholder="hobbies"
            name="hobbies"
            // 型が配列でsplitを使ったカンマ区切りで配列に切り替えたいので、別途state変数を設けて管理する
            value={hobbiesInput}
            onChange={(event) => setHobbiesInput(event.target.value)}
          />
          <Label>url</Label>
          <input
            placeholder="url"
            name="url"
            value={inputUser.url}
            onChange={handleUserChange}
          />
          <Label>studyMinutes</Label>
          <input
            placeholder="studyMinutes"
            name="studyMinutes"
            value={(inputUser as Student).studyMinutes}
            onChange={handleUserChange}
          />
          <Label>taskCode</Label>
          <input
            placeholder="taskCode"
            name="taskCode"
            value={(inputUser as Student).taskCode}
            onChange={handleUserChange}
          />
          <Label>studyLangs</Label>
          <input
            placeholder="studyLangs"
            name="studyLangs"
            // 型が配列でsplitを使ったカンマ区切りで配列に切り替えたいので、別途state変数を設けて管理する
            value={studyLangsInput}
            onChange={(event) => setStudyLangsInput(event.target.value)}
          />
          <Label>score</Label>
          <input
            placeholder="score"
            name="score"
            value={(inputUser as Student).score}
            onChange={handleUserChange}
          />
          <button onClick={handleStudentRegistration}>登録</button>
        </Modal>
      );
    } else {
      return (
        <Modal>
          <Label>id</Label>
          <input
            placeholder="id"
            name="id"
            value={inputUser.id}
            onChange={handleUserChange}
          />
          <Label>name</Label>
          <input
            placeholder="name"
            name="name"
            value={inputUser.name}
            onChange={handleUserChange}
          />
          <Label>role</Label>
          <input
            placeholder="role"
            name="role"
            value="mentor"
            onChange={handleUserChange}
          />
          <Label>email</Label>
          <input
            placeholder="email"
            name="email"
            value={inputUser.email}
            onChange={handleUserChange}
          />
          <Label>age</Label>
          <input
            placeholder="age"
            name="age"
            value={inputUser.age}
            onChange={handleUserChange}
          />
          <Label>postCode</Label>
          <input
            placeholder="postCode"
            name="postCode"
            value={inputUser.postCode}
            onChange={handleUserChange}
          />
          <Label>phone</Label>
          <input
            placeholder="phone"
            name="phone"
            value={inputUser.phone}
            onChange={handleUserChange}
          />
          <Label>hobbies</Label>
          <input
            placeholder="hobbies"
            name="hobbies"
            // 型が配列でsplitを使ったカンマ区切りで配列に切り替えたいので、別途state変数を設けて管理する
            value={hobbiesInput}
            onChange={(event) => setHobbiesInput(event.target.value)}
          />
          <Label>url</Label>
          <input
            placeholder="url"
            name="url"
            value={inputUser.url}
            onChange={handleUserChange}
          />
          <Label>experienceDays </Label>
          <input
            placeholder="experienceDays	"
            name="experienceDays"
            value={(inputUser as Mentor).experienceDays}
            onChange={handleUserChange}
          />
          <Label>useLangs</Label>
          <input
            placeholder="useLangs"
            name="useLangs"
            // 型が配列でsplitを使ったカンマ区切りで配列に切り替えたいので、別途state変数を設けて管理する
            value={useLangsInput}
            onChange={(event) => setUseLangsInput(event.target.value)}
          />
          <Label>availableStartCode</Label>
          <input
            placeholder="availableStartCode"
            name="availableStartCode"
            value={(inputUser as Mentor).availableStartCode}
            onChange={handleUserChange}
          />
          <Label>availableEndCode </Label>
          <input
            placeholder="availableEndCode"
            name="availableEndCode"
            value={(inputUser as Mentor).availableEndCode}
            onChange={handleUserChange}
          />
          <button onClick={handleMentorRegistration}>登録</button>
        </Modal>
      );
    }
  };

  // モーダルの切り替え管理
  const handleStudentButton = () => {
    setModalType('student');
  };

  // モーダルの切り替え管理
  const handleMentorButton = () => {
    setModalType('mentor');
  };

  // Escapeを押したらモーダルを閉じる
  useEffect(() => {
    // showがtrue且つ、押下されたキーがEscapeボタンの場合に実行される
    const onKeyDownEsc = (event: KeyboardEvent) => {
      if (show && event.key === 'Escape') {
        event.preventDefault();
        close();
        setModalType('');
      }
    };
    // window全体にイベントリスナーを追加
    window.addEventListener('keydown', onKeyDownEsc);
    // useEffectの再実行やアンマウント時に前回のイベントリスナーを削除
    return () => window.removeEventListener('keydown', onKeyDownEsc);
  }, [show, close]);

  if (!show) return <></>;
  return (
    <>
      {show && <Overlay onClick={close}></Overlay>}
      {show && modalType === '' && (
        <Modal>
          {/* roleを選択させて、回答に対して必要な登録モーダルを表示する */}
          <Label>どちらを登録しますか？</Label>{' '}
          <ButtonGroup>
            <TypeButton onClick={handleStudentButton}>Student</TypeButton>
            <TypeButton onClick={handleMentorButton}>Mentor</TypeButton>
          </ButtonGroup>
        </Modal>
      )}
      {show && modalType !== '' && selectModalType()}
    </>
  );
};
