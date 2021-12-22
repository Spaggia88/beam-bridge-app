import React from 'react';
import { styled } from '@linaria/react';
import { isNil } from '@app/core/utils.js';
import { ButtonVariant, Pallete } from '@app/core/types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.FC;
  pallete?: Pallete;
  variant?: ButtonVariant;
}

const BaseButtonStyled = styled.button<ButtonProps>`
  &[disabled] {
    opacity: 0.5;

    &:hover, &:active {
      box-shadow: none !important;
      cursor: not-allowed !important;
    }
  }
`;

const ButtonStyled = styled(BaseButtonStyled)`
  display: block;
  width: 100%;
  max-width: 254px;
  margin: 0 auto;
  margin-bottom: 10px;
  padding: 8px 24px;
  border: none;
  border-radius: 50px;
  background-color: ${({ pallete }) => `var(--color-${pallete})`};
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: var(--color-dark-blue);

  &:hover,
  &:active {
    box-shadow: 0 0 8px white;
    cursor: pointer;
  }

  > svg {
    vertical-align: sub;
    margin-right: 10px;
  }
`;

const GhostButtonStyled = styled(ButtonStyled)`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;

  &:hover,
  &:active {
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const BlockButtonStyled = styled(GhostButtonStyled)`
  width: 100%;
  max-width: none;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.03);
  font-size: 14px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: ${({ pallete }) => `var(--color-${pallete})`};

  &:hover,
  &:active {
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
`;

const IconButtonStyled = styled(BaseButtonStyled)`
  display: inline-block;
  vertical-align: sub;
  line-height: 0;
  margin: 0 10px;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${({ pallete }) => `var(--color-${pallete})`};

  > svg {
    vertical-align: sub;
  }
`;

const LinkButtonStyled = styled(IconButtonStyled)`
  margin: 20px 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ pallete }) => `var(--color-${pallete})`};
`;

const RevokeButtonStyled = styled(GhostButtonStyled)`
  color: var(--color-disconnect);
  border: 1px solid var(--color-disconnect);
  padding: 10px 30px;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  background-color: transparent;

  &:hover,
  &:active {
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const ValidateButtonStyled = styled(GhostButtonStyled)`
  color: var(--color-green);
  border: 1px solid var(--color-green);
  padding: 8px 30px;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
`;

const DisconnectButtonStyled = styled(ButtonStyled)`
  color: var(--color-darkest-blue);
`;

const VARIANTS = {
  regular: ButtonStyled,
  ghost: GhostButtonStyled,
  link: LinkButtonStyled,
  icon: IconButtonStyled,
  block: BlockButtonStyled,
  validate: ValidateButtonStyled,
  darkest_blue: DisconnectButtonStyled,
  revoke: RevokeButtonStyled
};

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  pallete = 'green',
  variant = 'regular',
  icon: IconComponent,
  children,
  ...rest
}) => {
  const ButtonComponent = VARIANTS[variant];

  return (
    <ButtonComponent type={type} pallete={pallete} {...rest}>
      {!isNil(IconComponent) && <IconComponent />}
      {children}
    </ButtonComponent>
  );
};

export default Button;
