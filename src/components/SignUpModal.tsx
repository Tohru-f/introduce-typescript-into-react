import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import type { InputUser, Mentor, Student, User } from '../types/types';

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

// inputUserのリセット時に使用する
const resetUser: InputUser = {
  id: 0,
  name: '',
  role: '',
  email: '',
  age: 0,
  postCode: '',
  phone: '',
  hobbies: '',
  url: '',
  studyMinutes: 0,
  taskCode: 0,
  studyLangs: '',
  score: 0,
  availableMentor: [],
  experienceDays: 0,
  useLangs: '',
  availableStartCode: 0,
  availableEndCode: 0,
  availableStudent: [],
};

export const SignUpModal = ({
  show,
  close,
  userList,
  setUserList,
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
  // const [hobbiesInput, setHobbiesInput] = useState<string>(''); //student, mentorの両方で使用
  // const [studyLangsInput, setStudyLangsInput] = useState<string>(''); // studentで使用
  // const [useLangsInput, setUseLangsInput] = useState<string>(''); // mentorで使用

  // student・mentorの入力内容を管理する
  // 型は入力受付用でInputUser型を新たに設けた。
  const [inputUser, setInputUser] = useState<InputUser>({
    id: 0,
    name: '',
    role: '',
    email: '',
    age: 0,
    postCode: '',
    phone: '',
    hobbies: '',
    url: '',
    studyMinutes: 0,
    taskCode: 0,
    studyLangs: '',
    score: 0,
    availableMentor: [],
    experienceDays: 0,
    useLangs: '',
    availableStartCode: 0,
    availableEndCode: 0,
    availableStudent: [],
  });

  //モーダルをstudentとmentorで分岐させるために使用
  const [modalType, setModalType] = useState<string>('');

  // リストからidだけの配列を取り出し、一番大きい値のidをベースにidが重複しないようにインクリメントして付与する
  // レンダリングに関与しないので、useStateではなくuseRefで管理する
  const idList: number[] = userList.map((user) => user.id);
  const maxId = Math.max(...idList) + 1;
  const idRef = useRef<number>(0);
  idRef.current = maxId;

  // ユーザー登録機能をmodalTypeで分岐してStudent, Mentorの登録を管理する。
  const handleRegistration = () => {
    // 入力を受け付けたstate変数から分割代入で個別に値を取り出す。
    const {
      id,
      name,
      role,
      email,
      age,
      postCode,
      phone,
      url,
      hobbies,
      studyMinutes,
      taskCode,
      studyLangs,
      score,
      availableMentor,
      experienceDays,
      useLangs,
      availableStartCode,
      availableEndCode,
      availableStudent,
    } = inputUser;

    if (modalType === 'student') {
      // inputUserから分割代入で取得した値のうちstudent側で使用するデータを使う
      let registeredUser: User = {
        id,
        name,
        role,
        email,
        age,
        postCode,
        phone,
        hobbies: hobbies
          .split(',')
          .map((hobby) => hobby.trim())
          .filter((hobby) => hobby !== ''),
        url,
        studyMinutes,
        taskCode,
        studyLangs: studyLangs
          .split(',')
          .map((studyLang) => studyLang.trim())
          .filter((studyLang) => studyLang !== ''),
        score,
        availableMentor,
      };
      // set関数で新しく登録するためのstudentデータを定数のオブジェクトで生成する。
      // split, map, filterの部分はそれぞれをstate変数として管理している特定のプロパティをカンマで区切った配列に切り替える
      const nextStudent: Student = {
        ...registeredUser,
        id: idRef.current,
        role: 'student',
      };
      // set関数の更新にはstate変数ではなく、定数のオブジェクトを使う。state変数は同じ処理内で使っても再レンダリング後で
      // なければ値の更新がされないので、set関数の引数には適さない
      const addedUserList = [...userList, nextStudent];
      setUserList(addedUserList);
      close();
      // 新規登録が終わったらそれぞれの入力内容はデフォルトに戻して、idのstate変数は次に備えてインクリメントする
      setInputUser(resetUser);
      setModalType('');
      idRef.current += idRef.current;
    } else {
      // inputUserから分割代入で取得した値のうちmentor側で使う値だけを使う
      let registeredUser: User = {
        id,
        name,
        role,
        email,
        age,
        postCode,
        phone,
        hobbies: hobbies
          .split(',')
          .map((hobby) => hobby.trim())
          .filter((hobby) => hobby !== ''),
        url,
        experienceDays,
        useLangs: useLangs
          .split(',')
          .map((useLang) => useLang.trim())
          .filter((useLang) => useLang !== ''),
        availableStartCode,
        availableEndCode,
        availableStudent,
      };
      const nextMentor: Mentor = {
        ...registeredUser,
        id: idRef.current,
        role: 'mentor',
      };
      const addedUserList = [...userList, nextMentor];
      setUserList(addedUserList);
      close();
      setInputUser(resetUser);
      setModalType('');
      idRef.current += idRef.current;
    }
  };

  // 入力内容を受け取って、state変数を逐次更新する
  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputUser({
      ...inputUser,
      [name]: value,
    });
  };
  // モーダルの切り替え管理
  const handleStudentButton = () => {
    setModalType('student');
  };

  // モーダルの切り替え管理
  const handleMentorButton = () => {
    setModalType('mentor');
  };

  // HTMLタグを作るコンポーネントの中ではif文が使えないので、書き出して挿入する
  const selectModalType = () => {
    return (
      <Modal>
        <Label>name</Label>
        <input
          placeholder="name"
          name="name"
          value={inputUser.name}
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
          value={inputUser.hobbies}
          onChange={handleUserChange}
        />
        <Label>url</Label>
        <input
          placeholder="url"
          name="url"
          value={inputUser.url}
          onChange={handleUserChange}
        />
        {modalType === 'student' ? (
          <>
            <Label>studyMinutes</Label>
            <input
              placeholder="studyMinutes"
              name="studyMinutes"
              value={inputUser.studyMinutes}
              onChange={handleUserChange}
            />
            <Label>taskCode</Label>
            <input
              placeholder="taskCode"
              name="taskCode"
              value={inputUser.taskCode}
              onChange={handleUserChange}
            />
            <Label>studyLangs</Label>
            <input
              placeholder="studyLangs"
              name="studyLangs"
              // 型が配列でsplitを使ったカンマ区切りで配列に切り替えたいので、別途state変数を設けて管理する
              value={inputUser.studyLangs}
              onChange={handleUserChange}
            />
            <Label>score</Label>
            <input
              placeholder="score"
              name="score"
              value={inputUser.score}
              onChange={handleUserChange}
            />
            <button onClick={handleRegistration}>登録</button>
          </>
        ) : (
          <>
            <Label>experienceDays </Label>
            <input
              placeholder="experienceDays	"
              name="experienceDays"
              value={inputUser.experienceDays}
              onChange={handleUserChange}
            />
            <Label>useLangs</Label>
            <input
              placeholder="useLangs"
              name="useLangs"
              // 型が配列でsplitを使ったカンマ区切りで配列に切り替えたいので、別途state変数を設けて管理する
              value={inputUser.useLangs}
              onChange={handleUserChange}
            />
            <Label>availableStartCode</Label>
            <input
              placeholder="availableStartCode"
              name="availableStartCode"
              value={inputUser.availableStartCode}
              onChange={handleUserChange}
            />
            <Label>availableEndCode </Label>
            <input
              placeholder="availableEndCode"
              name="availableEndCode"
              value={inputUser.availableEndCode}
              onChange={handleUserChange}
            />
            <button onClick={handleRegistration}>登録</button>
          </>
        )}
      </Modal>
    );
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
