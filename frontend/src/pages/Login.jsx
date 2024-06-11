import React from 'react';
import styled from 'styled-components';
import {
  useNavigate,
} from 'react-router-dom';
import * as Form from '@radix-ui/react-form';
import { apiCall } from '../utils/Helper';
import { EnvelopeClosedIcon, LockClosedIcon, EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'

// Styled components
const LoginWrapper = styled.div`
  background: linear-gradient(to right, #74ebd5, #acb6e5);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginContainer = styled(Form.Root)`
  min-width: 350px;
  display: flex;
  flex-direction: column;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled(Form.Message)`
  color: red;
  margin-bottom: 10px;
  font-style: italic;
`;

const FormControl = styled(Form.Control)`
  width: 100%;
  padding: 5px 10px;
  border: 2px solid transparent;
  border-radius: 15px;
  background: #F0F0F0;
  color: #333;
  transition: all 0.3s ease-in-out;
  outline: none;

  &:focus {
    border-color: #007BFF;
    background: white;
    box-shadow: 0 0 0 3px rgba(0,123,255,.25);
  }
`;

const Label = styled(Form.Label)`
  color: #8a2be2;
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  svg {
    margin-right: 5px;
  }
`;

const ShowPasswordIcon = styled(EyeClosedIcon).attrs({ 'data-testid': 'show-password-icon' })`
  cursor: pointer;
  margin-left: 15px;
`;

const HidePasswordIcon = styled(EyeOpenIcon)`
  cursor: pointer;
  margin-left: 15px;
`;

const Button = styled.button`
  cursor: pointer;
  background: linear-gradient(to bottom left, #8a2be2, #da70d6);
  color: white;
  border: none;
  border-radius: 20px;
  width: 100%;
  margin-top: 15px;
  padding: 5px 20px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Link = styled.a`
  display: block;
  text-align: center;
  color: #007bff;
  margin-top: 15px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isInvalidInput, setIsInvalidInput] = React.useState(false);
  // keep track of the form data
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  // Can show the password
  const passwordVisibility = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowPassword(!showPassword);
  };

  // Handle form input changes
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setIsInvalidInput(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const { email, password } = formData;
    if (email === '' || password === '') {
      return;
    }
    // Call the login API
    const data = await apiCall('/admin/auth/login', 'POST', { email, password }, null);
    if (data) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      navigate('/dashboard');
    } else {
      setIsInvalidInput(true);
    }
  }
  return (
    <LoginWrapper>
      <LoginContainer onSubmit={handleSubmit}>
        <h2 className="mb-4 text-center">Login</h2>
        {/* Email */}
        <Form.Field className='grid mb-3' name='email'>
          <InputField>
            <Label><EnvelopeClosedIcon /> Email</Label>
            <ErrorMessage match='typeMismatch'>Invalid Email !!! Please enter again</ErrorMessage>
            <ErrorMessage match='valueMissing'>Email is required !!!</ErrorMessage>
            {isInvalidInput && <ErrorMessage>Invalid Email or Password !!!</ErrorMessage>}
          </InputField>
          <FormControl data-testid="emailInput" value={formData.email} onChange={handleChange} type='email' required placeholder='Enter your email here' />
        </Form.Field>
        {/* Password */}
        <Form.Field className='grid mb-3' name='password'>
          <InputField>
            <Label>
              <LockClosedIcon /> Password
              {showPassword
                ? <ShowPasswordIcon data-testid="showPass" onClick={(event) => passwordVisibility(event)} />
                : <HidePasswordIcon data-testid="hidePass" onClick={(event) => passwordVisibility(event)} />}
            </Label>
            <ErrorMessage match='valueMissing'>Password is required !!!</ErrorMessage>
            {isInvalidInput && <ErrorMessage>Invalid Email or Password !!!</ErrorMessage>}
          </InputField>
          <FormControl data-testid="passwordInput" value={formData.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} required placeholder='Enter your password here' />
        </Form.Field>
        {/* Submit */}
        <Button data-testid="submitLogin" type="submit">Submit</Button>
        <Link data-testid="toRegister" href="/register">No accounts yet? Register</Link>
      </LoginContainer>
    </LoginWrapper>
  )
};

export default Login;
