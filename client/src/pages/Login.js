import React, { useContext,useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './login.scss'
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../src/context/auth';
import { useForm } from '../../src/util/hooks';


function Login() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { onChange, values } = useForm(loginUserCallback, {
    username: '',
    password: ''
  });
      
  const [loginUser] = useMutation(LOGIN_USER, {
    update(
      _, 
      {
        data: {login: userData}
      }) {
      context.login(userData)
      console.log(userData);
      navigate('/')
    },
    variables: values
  })

  function loginUserCallback() {
    loginUser();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('values', values);
    const { username, password } = values;
    if (
      username.trim() !== '' &&
      password.trim() !== '' 
    ) {
      setErrorMsg('');
      try {
        // throw new Error();
        loginUser();            
      }  catch (error) {
        setSubmitting(false);
        console.log(error.response);
        if (error.response) {
          setErrorMsg(error.response.data);
        } else {
          setErrorMsg('Something went wrong. Try again later.');
        }
      }
    } else {
      setErrorMsg('All the fields are required.');
    }
  };
     
  return (
  <div className='login'>
     <h2 className='heading'>Login Page</h2>
     <Form onSubmit={handleSubmit}>
     {errorMsg && <p className='error-msg'>{errorMsg}</p>}
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Username</Form.Label>
        <Form.Control
            type='text'
            placeholder='Enter your Username'
            name='username'
            value={values.username}
            onChange={onChange}
          />
     </Form.Group>
     <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
            type='password'
            placeholder='Enter your password'
            name='password'
            value={values.password}
            onChange={onChange}
          />
     </Form.Group>
     <Button variant='primary' type='submit' disabled={submitting}>
          {submitting ? 'Submitting...' : 'Login'}
        </Button>
     <div className='mt-2'>
          Don't have an account? <Link to='/register'>register here</Link>
        </div>
      </Form>
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login