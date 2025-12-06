import styled from 'styled-components';

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

const BackGround = styled.div`
  width: 100%;
`;

export const UserList = ({ userList }: { userList: User[] }) => {
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
              {user.experienceDays ? <td>{user.experienceDays}</td> : <td></td>}
              {user.taskCode ? <td>{user.taskCode}</td> : <td></td>}
              {user.studyLangs ? (
                <td>{user.studyLangs.join('\n')}</td>
              ) : (
                <td></td>
              )}
              {user.useLangs ? <td>{user.useLangs.join('\n')}</td> : <td></td>}
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
    </BackGround>
  );
};
