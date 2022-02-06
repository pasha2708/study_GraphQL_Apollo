import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import './App.scss';
import { ADD_NEW_USER, DELETE_USER } from './mutations/user';
import { GET_ALL_USERS, GET_ONE_USER } from './query/user';

function App() {
  const { data, loading, refetch } = useQuery(GET_ALL_USERS);
  const { data: oneUser } = useQuery(GET_ONE_USER, {
    variables: {
      id: 1
    },
  });
  const [newUser] = useMutation(ADD_NEW_USER);
  const [delUser] = useMutation(DELETE_USER);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    if (!loading) {
      setUsers(data.getAllUsers);
      refetch();
    }
    if (loading) {
      return <h1>Loading...</h1>;
    };
    

  }, [data, loading, refetch]);

  const addUser = (e) => {
    e.preventDefault();
    newUser({
      variables: {
        input: {
          username,
          age
        },
      },
    }).then(({ data }) => {
      setAge('');
      refetch();
    });
  };

  const getAll = (e) => {
    e.preventDefault();
    refetch();
  };

  const deleteUser = (id) => {
    delUser({
      variables: {
        id: id
      }
    });
    refetch();
  };

  return (
    <>
      <form>
        <input
          placeholder='Your name'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type='text'
        />
        <input
          placeholder='Your age'
          value={age}
          onChange={(e) => setAge(e.target.value)}
          type='number'
        />
        <div className='btns'>
          <button onClick={(e) => addUser(e)}>Создать</button>
          <button onClick={(e) => getAll(e)}>Получить</button>
        </div>
      </form>
      <div>
        {(users.length !== 0) ? (users.map((user) => (
          <div className='user' key={user.id}>
            {user.id}. {user.username}, age: {user.age}
            <div onClick={() => deleteUser(user.id)}>
              <span>&times;</span>
            </div>
          </div>))) : (<div>Нет пользователей</div>)}
      </div>
    </>
  );
}

export default App;
