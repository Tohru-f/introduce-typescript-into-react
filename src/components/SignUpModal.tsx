import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { USER_LIST } from '../../public/UserData';

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
  setStudentList,
  setMentorList,
}: {
  show: boolean;
  // クリックとキーボードの両方で使用するため、両方受けられるこの方にしている。
  // eventを設けてKeyboardEventとReact.MouseEvent<HTMLDivElement, MouseEvent>を使用したが、
  // 一方が他方を受け入れない状態になるので、eventの使用を中断した。
  close: () => void;
  userList: User[];
  setUserList: React.Dispatch<React.SetStateAction<User[]>>;
  setStudentList: React.Dispatch<React.SetStateAction<Student[]>>;
  setMentorList: React.Dispatch<React.SetStateAction<Mentor[]>>;
}) => {
  // 初期値においてrole部分は型が決まれば一緒に決まるので、リテラル型で固定する
  const [student, setStudent] = useState<Student>({
    id: 0,
    name: '',
    role: 'student',
    email: '',
    age: 0,
    postCode: '',
    phone: '',
    hobbies: [],
    url: '',
    studyMinutes: 0,
    taskCode: 0,
    studyLangs: [],
    score: 0,
    availableMentor: [],
  });
  // student, mentorの両方でhobbiesを管理するために別途作成。他のプロパティと同様に直接set関数で受け取ると
  // splitメソッドが意図した通りに機能しないので、userListに登録する直前まではこれらのstate変数で管理する
  const [hobbiesInput, setHobbiesInput] = useState<string>(''); //student, mentorの両方で使用
  const [studyLangsInput, setStudyLangsInput] = useState<string>(''); // studentで使用
  const [useLangsInput, setUseLangsInput] = useState<string>(''); // mentorで使用

  //モーダルをstudentとmentorで分岐させるために使用
  const [modalType, setModalType] = useState<string>('');

  // 初期値においてrole部分は型が決まれば一緒に決まるので、リテラル型で固定する
  const [mentor, setMentor] = useState<Mentor>({
    id: 0,
    name: '',
    role: 'mentor',
    email: '',
    age: 0,
    postCode: '',
    phone: '',
    hobbies: [],
    url: '',
    experienceDays: 0,
    useLangs: [],
    availableStartCode: 0,
    availableEndCode: 0,
    availableStudent: [],
  });

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
    // 入力されたtaskCodeに対応できるmentorのリストを作成する
    const availableMentor: Mentor[] = mentorList.filter(
      (mentor) =>
        mentor.availableStartCode <= student.taskCode &&
        student.taskCode <= mentor.availableEndCode
    );
    // 対応可能なメンターの配列から前だけを取り出す
    const availableMentorsName: string[] = availableMentor.map(
      (mentor) => mentor.name
    );

    // set関数で新しく登録するためのstudentデータを定数のオブジェクトで生成する。
    // split, map, filterの部分はそれぞれをstate変数として管理している特定のプロパティをカンマで区切った配列に切り替える
    const nextStudent: Student = {
      ...student,
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
    setStudent(nextStudent);
    // set関数の更新にはstate変数ではなく、定数のオブジェクトを使う。state変数は同じ処理内で使っても再レンダリング後で
    // なければ値の更新がされないので、set関数の引数には適さない
    const addedUserList = [...userList, nextStudent];
    setUserList(addedUserList);
    // 生徒一覧のデータも反映されるように更新する
    const newStudentList = addedUserList.filter(
      (user) => user.role === 'student'
    ) as Student[];
    setStudentList(newStudentList);
    close();
    // 新規登録が終わったらそれぞれの入力内容はデフォルトに戻して、idのstate変数は次に備えてインクリメントする
    setStudent({
      id: 0,
      name: '',
      role: 'student',
      email: '',
      age: 0,
      postCode: '',
      phone: '',
      hobbies: [],
      url: '',
      studyMinutes: 0,
      taskCode: 0,
      studyLangs: [],
      score: 0,
      availableMentor: [],
    });
    setHobbiesInput('');
    setStudyLangsInput('');
    setModalType('');
    setDesignatedId(designatedId + 1);
  };

  const studentList = baseList.filter(
    (studentLike) => studentLike.role === 'student'
  ) as Student[];

  const handleMentorRegistration = () => {
    const availableStudent: Student[] = studentList.filter(
      (student) =>
        mentor.availableStartCode <= student.taskCode &&
        student.taskCode <= mentor.availableEndCode
    );
    const availableStudentName: string[] = availableStudent.map(
      (student) => student.name
    );
    const nextMentor: Mentor = {
      ...mentor,
      id: designatedId,
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
    setMentor(nextMentor);
    const addedUserList = [...userList, nextMentor];
    setUserList(addedUserList);
    const newMentorList = addedUserList.filter(
      (user) => user.role === 'mentor'
    ) as Mentor[];
    setMentorList(newMentorList);
    close();
    setMentor({
      id: 0,
      name: '',
      role: 'mentor',
      email: '',
      age: 0,
      postCode: '',
      phone: '',
      hobbies: [],
      url: '',
      experienceDays: 0,
      useLangs: [],
      availableStartCode: 0,
      availableEndCode: 0,
      availableStudent: [],
    });
    setHobbiesInput('');
    setUseLangsInput('');
    setModalType('');
    setDesignatedId(designatedId + 1);
  };

  // 入力内容を受け取って、state変数を逐次更新する
  const handleStudentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setStudent({
      ...student,
      [name]: value,
    });
  };

  // 入力内容を受け取って、state変数を逐次更新する
  const handleMentorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMentor({
      ...mentor,
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
            value={student.id}
            onChange={handleStudentChange}
          />
          <Label>name</Label>
          <input
            placeholder="name"
            name="name"
            value={student.name}
            onChange={handleStudentChange}
          />
          <Label>role</Label>
          <input
            placeholder="role"
            name="role"
            value="student"
            onChange={handleStudentChange}
          />
          <Label>email</Label>
          <input
            placeholder="email"
            name="email"
            value={student.email}
            onChange={handleStudentChange}
          />
          <Label>age</Label>
          <input
            placeholder="age"
            name="age"
            value={student.age}
            onChange={handleStudentChange}
          />
          <Label>postCode</Label>
          <input
            placeholder="postCode"
            name="postCode"
            value={student.postCode}
            onChange={handleStudentChange}
          />
          <Label>phone</Label>
          <input
            placeholder="phone"
            name="phone"
            value={student.phone}
            onChange={handleStudentChange}
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
            value={student.url}
            onChange={handleStudentChange}
          />
          <Label>studyMinutes</Label>
          <input
            placeholder="studyMinutes"
            name="studyMinutes"
            value={student.studyMinutes}
            onChange={handleStudentChange}
          />
          <Label>taskCode</Label>
          <input
            placeholder="taskCode"
            name="taskCode"
            value={student.taskCode}
            onChange={handleStudentChange}
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
            value={student.score}
            onChange={handleStudentChange}
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
            value={mentor.id}
            onChange={handleMentorChange}
          />
          <Label>name</Label>
          <input
            placeholder="name"
            name="name"
            value={mentor.name}
            onChange={handleMentorChange}
          />
          <Label>role</Label>
          <input
            placeholder="role"
            name="role"
            value="mentor"
            onChange={handleMentorChange}
          />
          <Label>email</Label>
          <input
            placeholder="email"
            name="email"
            value={mentor.email}
            onChange={handleMentorChange}
          />
          <Label>age</Label>
          <input
            placeholder="age"
            name="age"
            value={mentor.age}
            onChange={handleMentorChange}
          />
          <Label>postCode</Label>
          <input
            placeholder="postCode"
            name="postCode"
            value={mentor.postCode}
            onChange={handleMentorChange}
          />
          <Label>phone</Label>
          <input
            placeholder="phone"
            name="phone"
            value={mentor.phone}
            onChange={handleMentorChange}
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
            value={mentor.url}
            onChange={handleMentorChange}
          />
          <Label>experienceDays </Label>
          <input
            placeholder="experienceDays	"
            name="experienceDays	"
            value={mentor.experienceDays}
            onChange={handleMentorChange}
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
            value={mentor.availableStartCode}
            onChange={handleMentorChange}
          />
          <Label>availableEndCode </Label>
          <input
            placeholder="availableEndCode"
            name="availableEndCode"
            value={mentor.availableEndCode}
            onChange={handleMentorChange}
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
