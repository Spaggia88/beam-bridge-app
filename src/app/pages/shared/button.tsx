import React from 'react';
import { styled } from '@linaria/react';

interface ButtonProps {
  color?: 'send' | 'receive';
  icon?: string;
}

const ButtonStyled = styled.button<ButtonProps>`
  display: block;
  padding: 10px 30px;
  border: none;
  border-radius: 50px;
  background-color: ${({ color }) => `var(--color-${color})`};
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: #032e49;
  cursor: pointer;

  &:hover,
  &:active {
    box-shadow: 0 0 8px white;
  }
`;

const Button: React.FC<ButtonProps> = ({
  color,
  icon,
  children,
  ...rest
}) => (
  <ButtonStyled color={color} {...rest}>
    {children}
  </ButtonStyled>
);

export default Button;
